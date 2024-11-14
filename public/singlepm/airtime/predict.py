import sys
import pandas as pd
import lightgbm as lgb
import rasterio
from pyproj import Transformer
import requests
import json
import numpy as np

def main(lon, lat):
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Referer': 'https://data.cma.cn/dataGis/static/grid4/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    }

    params = {"lat": lat, "lon": lon}
    params2 = {'elements': 'PRS', 'interfaceId': 'getSensitiveWeatherLBS', 'lat': lat, "lon": lon}

    response = requests.get('https://data.cma.cn/dataGis/multiSource/getAPILiveDataInfo', params=params, headers=headers)
    response2 = requests.get('https://data.cma.cn/dataGis/multinewSource/getAPILiveDataInfoByEle', params=params2, headers=headers)

    response_data = json.loads(response.text)
    response2_data = json.loads(response2.text)

    extracted_data = [{item['fastEle']: item['value']} for item in response_data.get('list', [])]
    extracted2_data = response2_data.get('list', [])

    for item in extracted2_data:
        extracted_data.append({item['fastEle']: item['value']})

    air = {}

    for item in extracted_data:
        if 'TEM' in item:
            air['TEM'] = float(item['TEM'])
        if 'WINS' in item:
            air['WINS'] = float(item['WINS'])
        if 'VIS' in item:
            air['VIS'] = float(item['VIS']) / 1000
        if 'PRS' in item:
            air['PRS'] = float(item['PRS']) / 100
        if 'PRE_1H' in item:
            air['PRE_1H'] = float(item['PRE_1H'])

    air['TEMP'] = air.pop('TEM')
    air['MXSPD'] = air.pop('WINS')
    air['VISIB'] = air.pop('VIS')
    air['SLP'] = air.pop('PRS')
    air['PRCP'] = air.pop('PRE_1H')

    file_path = './public/singlepm/airtime/data/road/NC_roaddense.tif'
    with rasterio.open(file_path) as src:
        raster_data = src.read(1)
        transform_matrix = src.transform
        src_crs = src.crs

        wgs84 = 'epsg:4326'
        utm49n = 'epsg:32649'

        transformer = Transformer.from_crs(wgs84, utm49n, always_xy=True)
        utm_x, utm_y = transformer.transform(lon, lat)

        row, col = ~transform_matrix * (utm_x, utm_y)

        for val in src.sample([(utm_x, utm_y)]):
            value = val[0]

    air['RASTERVALU'] = value

    model_path = './public/singlepm/airtime/lightgbm_model.txt'
    features = ['VISIB', 'PRCP', 'SLP', 'TEMP', 'MXSPD', 'RASTERVALU']

    bst_loaded = lgb.Booster(model_file=model_path)

    df = pd.DataFrame([air])
    df = df.astype({
        'TEMP': 'float32',
        'VISIB': 'float32',
        'PRCP': 'float32',
        'SLP': 'float32',
        'MXSPD': 'float32',
        'RASTERVALU': 'float32'
    })

    X_new = df[features]
    df['PM2.5_Predicted'] = bst_loaded.predict(X_new, num_iteration=bst_loaded.best_iteration)

    # 将所有 float32 转换为 float
    for key in air:
        if isinstance(air[key], (np.float32, np.float64)):
            air[key] = float(air[key])

    # 将预测结果也转换为 float
    predicted_value = float(df['PM2.5_Predicted'].iloc[0])

    # 将air字典和预测结果打包成JSON对象
    result = {
        "air": air,
        "PM2_5_Predicted": predicted_value
    }

    print(json.dumps(result))

if __name__ == "__main__":
    lon = float(sys.argv[1])
    lat = float(sys.argv[2])
    main(lon, lat)
