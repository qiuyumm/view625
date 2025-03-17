# 爬取的360点进行插值，然后提取道路密度
import numpy as np
import pandas as pd
from scipy.spatial import distance_matrix
import matplotlib.pyplot as plt
import geopandas as gpd
import rasterio
from rasterio.transform import rowcol
import lightgbm as lgb
import json
import sys

# 获取气象数据
import time

import requests
import json
import csv

# 读取CSV文件
csv_file_path_point = './public/predicte/henanairpredict/xuanqudian.csv'
airData = []

requests.DEFAULT_RETRIES = 5
s = requests.session()
s.keep_alive = False

with open(csv_file_path_point, newline='', encoding='utf-8') as csvfile:
    csv_reader = csv.DictReader(csvfile)
    for row in csv_reader:
        latitude = row['latitude']
        longitude = row['longitude']

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

        params = {
            'lat': latitude,
            'lon': longitude,
        }

        params1 = {
            'elements': 'PRS',
            'interfaceId': 'getSensitiveWeatherLBS',
            'lat': latitude,
            'lon': longitude,
        }

        response_press = s.get('https://data.cma.cn/dataGis/multinewSource/getAPILiveDataInfoByEle', params=params1,
                                headers=headers)
        press = json.loads(response_press.text)

        response = s.get('https://data.cma.cn/dataGis/multiSource/getAPILiveDataInfo', params=params,
                                headers=headers)
        response_data = json.loads(response.text)

        if response_data == {}:
            break

        # 初始化结果字典
        result = {
            'latitude': latitude,
            'longitude': longitude,
            'TEM': '',
            'RHU': '',
            'WINS': '',
            'WIND': '',
            'WEA': '',
            'VIS': '',
            'TCDC': '',
            'PRS': '',
            'PRE_1H': '',
            'PRE_24H': ''
        }

        # 提取 'fastEle' 和 'value' 并更新结果字典
        for item in response_data.get('list', []):
            fastEle = item['fastEle']
            if fastEle in result:
                result[fastEle] = item['value']
            for item in press.get('list', []):
                fastEle = item['fastEle']
                if fastEle in result:
                    result[fastEle] = item['value']
        # 将 VIS 和 PRS 的值除以 100，并转换为字符串
        result['VIS'] = str(float(result['VIS']) / 100)
        result['PRS'] = str(float(result['PRS']) / 100)
        airData.append(result)
        # time.sleep(10)
# print(airData)

if airData == {}:
    print('数据为空')
    sys.exit()  # 终止程序                      

# 提取经纬度和目标参数
latitudes = np.array([float(d['latitude']) for d in airData])
longitudes = np.array([float(d['longitude']) for d in airData])
TEM = np.array([float(d['TEM']) for d in airData])
VIS = np.array([float(d['VIS']) for d in airData])
PRE_1H = np.array([float(d['PRE_1H']) for d in airData])
PRS = np.array([float(d['PRS']) for d in airData])
WINS = np.array([float(d['WINS']) for d in airData])

# 读取Shapefile并提取边界范围
shapefile_path = './public/predicte/henanairpredict/henan/hena.shp'  # 修改为你的Shapefile路径
gdf = gpd.read_file(shapefile_path)
bbox = gdf.total_bounds  # 返回 [minx, miny, maxx, maxy]

lat_min, lon_min, lat_max, lon_max = bbox[1], bbox[0], bbox[3], bbox[2]

# 假设每度大约等于111km，经度每度大约为111 * cos(纬度) km
grid_size_km = 1.0  # 1km的格网

# 计算步长
lat_step = grid_size_km / 111.0
lon_step = grid_size_km / (111.0 * np.cos(np.deg2rad(latitudes.mean())))

# 生成格网
grid_lat = np.arange(lat_min, lat_max, lat_step)
grid_lon = np.arange(lon_min, lon_max, lon_step)

# 生成目标网格点列表
grid_points = np.array([(lat, lon) for lat in grid_lat for lon in grid_lon])

# 插值函数
def idw_interpolation(target_point, coordinates, values, p=2):
    distances = distance_matrix([target_point], coordinates)[0]
    epsilon = 1e-10
    weights = 1 / (distances + epsilon) ** p
    weights /= weights.sum()
    return np.dot(weights, values)

# 对每个格网点进行插值 (TEM, VIS, PRE_1H, PRS, WINS)
interpolated_grid_tem = np.array([
    idw_interpolation(point, np.column_stack((latitudes, longitudes)), TEM)
    for point in grid_points
])
interpolated_grid_vis = np.array([
    idw_interpolation(point, np.column_stack((latitudes, longitudes)), VIS)
    for point in grid_points
])
interpolated_grid_pre_1h = np.array([
    idw_interpolation(point, np.column_stack((latitudes, longitudes)), PRE_1H)
    for point in grid_points
])
interpolated_grid_prs = np.array([
    idw_interpolation(point, np.column_stack((latitudes, longitudes)), PRS)
    for point in grid_points
])
interpolated_grid_wins = np.array([
    idw_interpolation(point, np.column_stack((latitudes, longitudes)), WINS)
    for point in grid_points
])

# 结果保存为字典
interpolated_results = [
    {'latitude': point[0], 'longitude': point[1], 'TEMP': tem, 'VISIB': vis, 'PRCP': pre_1h, 'SLP': prs, 'MXSPD': wins}
    for point, tem, vis, pre_1h, prs, wins in zip(grid_points, interpolated_grid_tem, interpolated_grid_vis, interpolated_grid_pre_1h, interpolated_grid_prs, interpolated_grid_wins)
]

# 读取另一个CSV文件
csv_file_path = './public/predicte/henanairpredict/cahzhidian-road.csv'  # 替换为实际路径
raster_df = pd.read_csv(csv_file_path)

# 确保CSV文件中的RASTERVALU列与插值结果点数匹配
if len(raster_df) != len(interpolated_results):
    raise ValueError("CSV文件中的RASTERVALU列长度与插值结果不匹配！")

# 将RASTERVALU列值按顺序赋给每个插值后的点
for i, result in enumerate(interpolated_results):
    result['RASTERVALU'] = raster_df['RASTERVALU'].iloc[i]

# 保存最终结果为CSV文件
df = pd.DataFrame(interpolated_results)
df.to_csv('interpolated_with_raster_values.csv', index=False)
# print("插值结果及RASTERVALU值已保存为 interpolated_with_raster_values.csv")

# # 保存为CSV文件
# df = pd.DataFrame(interpolated_results)
# df.to_csv('interpolated_results.csv', index=False)
# print("插值结果已保存为 interpolated_results.csv")

# 3加载模型

model_path = './public/predicte/henanairpredict/lightgbm_model.txt'

# 假设data包含了所有数据，且特征和目标变量列名为以下名称
features =  ['VISIB', 'PRCP', 'SLP', 'TEMP', 'MXSPD', 'RASTERVALU']
target = 'PM2.5'

# Step 4: 加载模型并进行预测
# 加载模型
bst_loaded = lgb.Booster(model_file=model_path)

# 读取新CSV文件进行预测
# new_file_path = './data/train4/2023-01-01_extracted.csv'  # 替换为你的新CSV文件路径
new_data = interpolated_results

# 删除包含缺失值的行
# new_data_clean = new_data.dropna(subset=features)

# 将数据转换为DataFrame并进行类型转换
df = pd.DataFrame(interpolated_results)
# df = df.astype({
#     'latitude': 'float32',
#     'longitude': 'float32',
#     'TEM': 'float32',
#     'RHU': 'int32',
#     'WINS': 'float32',
#     'WIND': 'int32',
#     'WEA': 'int32',
#     'VIS': 'int32',
#     'TCDC': 'int32',
#     'PRE_1H': 'float32',
#     'PRE_24H': 'float32'
# })

# 进行预测
X_new = df[features]
df['PM2.5'] = bst_loaded.predict(X_new, num_iteration=bst_loaded.best_iteration)

# Step 4: 将负值设置为零
df['PM2.5'] = np.maximum(df['PM2.5'], 0)

# 将预测结果与原数据保存到一个新的CSV文件
output_file_path = 'test.csv'  # 替换为你想要保存的输出CSV文件路径
df.to_csv(output_file_path, index=False)

# print(f'预测结果已保存到 {output_file_path}')

interpolated_tem_list = [
    [row['longitude'], row['latitude'], row['PM2.5']]
    for _, row in df.iterrows()
]

# 将提取的数据转换为 JSON 格式
interpolated_tem_json = json.dumps(interpolated_tem_list, indent=4)

# 输出 JSON 数据
print(interpolated_tem_json)
