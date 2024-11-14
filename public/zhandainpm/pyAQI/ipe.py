import requests

from datetime import datetime, timedelta

# # 获取当前时间
# current_time = datetime.now()

# # 加上五小时
# new_time = current_time - timedelta(hours=3)

# # 将时间取整到最接近的整点
# rounded_time = new_time.replace(minute=0, second=0, microsecond=0)

# # 格式化为指定的字符串格式
# formatted_time = rounded_time.strftime('%Y/%m/%d %H:%M:%S')


cookies = {
    '_dx_captcha_cid': '06039386',
    '_dx_app_81e16deaf5fee41ed38834363824b3e3': '',
    '_dx_captcha_vid': '5D101314D04C93C5AE131823B74A4D10AFAE4BFA2119ACE2F16109C763B7B3BE8861FA2FBD404482DE34F932D25E3B2487EEB63711891D1963F7D78B74E6746E6CDD024BF9318E6537194515FC566EC0',
    'Hm_lvt_7ad5a3f0ba646f5864e788025aab20a2': '1703466863',
    '__utma': '105455707.1208372624.1703466863.1703466863.1703466863.1',
    '__utmz': '105455707.1703466863.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',
    '.ASPXAUTH': '7DF398B6C81CD88F838693A94C1AA7DCC6921FC46666AE4E6B2E9A027582AB66881CAD19E80476658B8AC5AAA136D44475333BE2E25E893E76929E0722B25A9B872A2328BC791C4E773FB630E347E08F46483A40055682847EB8A2A1EED3BD6481FD10F6A9EFC1F5F0284EAC5A5FDFD042E43E93BBD41F80FD5DF977110075E155BE7F37799264DF0DAB2D6D73321DE1746C1A15C4790F9620DAE24EE467F1E2491D3994A99D99D3B4B9A2CB',
    'ajaxkey': '348F9F27A59EC86C6B20FA7AB3B59EBF1F66AD1FCF149094',
    'acw_tc': '7b39758817037219691277754e92d65f07d6d002d4e4c2519028693df708d9',
    'SERVERID': '8abfb74b5c7dce7c6fa0fa50eb3d63af|1703721984|1703721969',
}

headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    # 'Cookie': '_dx_captcha_cid=06039386; _dx_app_81e16deaf5fee41ed38834363824b3e3=; _dx_captcha_vid=5D101314D04C93C5AE131823B74A4D10AFAE4BFA2119ACE2F16109C763B7B3BE8861FA2FBD404482DE34F932D25E3B2487EEB63711891D1963F7D78B74E6746E6CDD024BF9318E6537194515FC566EC0; .ASPXAUTH=96DAD51EDC162439C88B17981477A9BF77B4D01B489621BF428673014FF58CC6F441AC7D455A74FA062CEDB59ABB5D4FEF3FE38EC55C837B18D4A9395A8750C9F398450E115C9FA00D49C2977216A45D9A17AF5A89F0E45CD8C087F08400E8A02739E0123663D5F7F491DC329C0C56CBE9E5CA2FB47475893EC64A2BD36187B7A86C8318606AD044F45FA7F1E162C3F8CDCAF91B426DA9A8A1AB91435D788A3301B454E00F2BE3589C440CEB; acw_tc=2760820917013157761056479e675b59ac8268af8df1652a389a7986c07663; SERVERID=63ce6a224eb1e4e64c95f4d7b348be8a|1701315898|1701315776',
    'Origin': 'https://www.ipe.org.cn',
    'Referer': 'https://www.ipe.org.cn/AirMap_fxy/AirMap.Html?q=1&vv=pm2_5&text=PM2_5',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

params = {
    'xx': 'getPointAQI',
}

data = {
    'headers[Cookie]': '_dx_captcha_cid=06039386; _dx_app_81e16deaf5fee41ed38834363824b3e3=; _dx_captcha_vid=5D101314D04C93C5AE131823B74A4D10AFAE4BFA2119ACE2F16109C763B7B3BE8861FA2FBD404482DE34F932D25E3B2487EEB63711891D1963F7D78B74E6746E6CDD024BF9318E6537194515FC566EC0; .ASPXAUTH=96DAD51EDC162439C88B17981477A9BF77B4D01B489621BF428673014FF58CC6F441AC7D455A74FA062CEDB59ABB5D4FEF3FE38EC55C837B18D4A9395A8750C9F398450E115C9FA00D49C2977216A45D9A17AF5A89F0E45CD8C087F08400E8A02739E0123663D5F7F491DC329C0C56CBE9E5CA2FB47475893EC64A2BD36187B7A86C8318606AD044F45FA7F1E162C3F8CDCAF91B426DA9A8A1AB91435D788A3301B454E00F2BE3589C440CEB; SERVERID=63ce6a224eb1e4e64c95f4d7b348be8a|1701315898|1701315776',
    'cmd': 'getPointAQI',
    'searchTxt': '',
    'province': '12',
    'city': '0',
    'level': '6',
    'mapprovince': '',
    'nostr': '',
    'indexname': 'pm2_5',
    'keycode': '4543j9f9ri334233r3rixxxyyo12',
    # 'time': '2023/12/6 15:00:00',
    'time': ''
}

# data['time']  = formatted_time

r = requests.post(
    'https://www.ipe.org.cn/data_ashx/GetAirData.ashx',
    params=params,
    cookies=cookies,
    headers=headers,
    data=data,
)
resData=r.text
datacode=''
if r.ok:
    print(resData)
# if resData:
#     datacode=resData['content'].key
#
# print(datacode)