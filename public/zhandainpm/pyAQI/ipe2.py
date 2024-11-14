import requests

from datetime import datetime, timedelta

# 获取当前时间
current_time = datetime.now()

# 加上五小时
new_time = current_time - timedelta(hours=3)

# 将时间取整到最接近的整点
rounded_time = new_time.replace(minute=0, second=0, microsecond=0)

# 格式化为指定的字符串格式
formatted_time = rounded_time.strftime('%Y/%m/%d %H:%M:%S')

headers1 = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    # 'cookie': '__utma=105455707.196742729.1724842190.1724842190.1724842190.1; __utmz=105455707.1724842190.1.1.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _dx_captcha_cid=60093346; _dx_uzZo5y=ee447ff132165196b924d2a32fa1999baa556a85722d4acbcd7a1eb19e8079cf4a7b3aa7; _dx_FMrPY6=66cf012eHm09oikW8KHgCd1YWFHKrG2ct77P88e1; _dx_app_81e16deaf5fee41ed38834363824b3e3=66cf012eHm09oikW8KHgCd1YWFHKrG2ct77P88e1; _ajm=avE6MDpvX8mUGr/+VT/nGZwdg3xLtqWqn6jCyhFoSit/mjbl/KaJqd2BH36bC6LT; _ajx=vwNhbCtXQDnMaS5Y+zr/pg==; _ajy=kaP2VpqDIM82lAXzlTo7GQ==; Hm_lvt_7ad5a3f0ba646f5864e788025aab20a2=1724842189,1724843797; HMACCOUNT=50106F964DD65844; __utmc=105455707; __utmt=1; ajaxkey=AED9C727370DAC37126B59A2385CC8B752C7612A9CA71110; .ASPXAUTH=76C433A451EDFD902726DF967973F56992E60FE00BB41418ACEF751FC37E21E4C7B712615E9750CD7AD26170DDC92C7D449AAB99E0311371D97D588B982AC250B9EC79A1CEAC406A3ABF42B0A6B62D8AE6413DCA2D0E0B1BCE70221B0722A12D82F71800ABCF12CE6C0FA42C; __utmb=105455707.14.10.1724842190; Hm_lpvt_7ad5a3f0ba646f5864e788025aab20a2=1724844027; SERVERID=63ce6a224eb1e4e64c95f4d7b348be8a|1724844255|1724843890; _dx_captcha_vid=A2949A696338D53507F6322A71A635FEB8A3D88509BCF9A28DB54E3EB47A69F3FB4F1445C9AC2509FB17CB578B5D8610C62DCDB71E52006D6E1A09652AA75E824F2A11C8AA9107008C48CE628C203B92',
    'origin': 'https://www.ipe.org.cn',
    'priority': 'u=1, i',
    'referer': 'https://www.ipe.org.cn/AirMap_fxy/AirMap.html?q=1',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
    'x-requested-with': 'XMLHttpRequest',
}

params1 = {
    'xx': 'userloginnew',
}

data1 = 'headers%5BCookie%5D=__utma%3D105455707.196742729.1724842190.1724842190.1724842190.1%3B+__utmz%3D105455707.1724842190.1.1.utmcsr%3Dcn.bing.com%7Cutmccn%3D(referral)%7Cutmcmd%3Dreferral%7Cutmcct%3D%2F%3B+_dx_captcha_cid%3D60093346%3B+_dx_uzZo5y%3Dee447ff132165196b924d2a32fa1999baa556a85722d4acbcd7a1eb19e8079cf4a7b3aa7%3B+_dx_FMrPY6%3D66cf012eHm09oikW8KHgCd1YWFHKrG2ct77P88e1%3B+_dx_app_81e16deaf5fee41ed38834363824b3e3%3D66cf012eHm09oikW8KHgCd1YWFHKrG2ct77P88e1%3B+_ajm%3DavE6MDpvX8mUGr%2F%2BVT%2FnGZwdg3xLtqWqn6jCyhFoSit%2Fmjbl%2FKaJqd2BH36bC6LT%3B+_ajx%3DvwNhbCtXQDnMaS5Y%2Bzr%2Fpg%3D%3D%3B+_ajy%3DkaP2VpqDIM82lAXzlTo7GQ%3D%3D%3B+Hm_lvt_7ad5a3f0ba646f5864e788025aab20a2%3D1724842189%2C1724843797%3B+HMACCOUNT%3D50106F964DD65844%3B+__utmc%3D105455707%3B+__utmt%3D1%3B+ajaxkey%3DAED9C727370DAC37126B59A2385CC8B752C7612A9CA71110%3B+.ASPXAUTH%3D76C433A451EDFD902726DF967973F56992E60FE00BB41418ACEF751FC37E21E4C7B712615E9750CD7AD26170DDC92C7D449AAB99E0311371D97D588B982AC250B9EC79A1CEAC406A3ABF42B0A6B62D8AE6413DCA2D0E0B1BCE70221B0722A12D82F71800ABCF12CE6C0FA42C%3B+__utmb%3D105455707.14.10.1724842190%3B+Hm_lpvt_7ad5a3f0ba646f5864e788025aab20a2%3D1724844027%3B+SERVERID%3D63ce6a224eb1e4e64c95f4d7b348be8a%7C1724844255%7C1724843890%3B+_dx_captcha_vid%3DA2949A696338D53507F6322A71A635FEB8A3D88509BCF9A28DB54E3EB47A69F3FB4F1445C9AC2509FB17CB578B5D8610C62DCDB71E52006D6E1A09652AA75E824F2A11C8AA9107008C48CE628C203B92&cmd=userloginnew&userName=1vpMoFoUlI%2FlxTCxiixQaQ%3D%3D&password=YncNvB4qL9FBSxvTCyn99w%3D%3D&code=A2949A696338D53507F6322A71A635FEB8A3D88509BCF9A28DB54E3EB47A69F3FB4F1445C9AC2509FB17CB578B5D8610C62DCDB71E52006D6E1A09652AA75E824F2A11C8AA9107008C48CE628C203B92%3A66cf012eHm09oikW8KHgCd1YWFHKrG2ct77P88e1&isRemeber=0&iscode=1&isthird=1'



response = requests.post(
    'https://www.ipe.org.cn/data_ashx/GetAirData.ashx',
    params=params1,
    # cookies=cookies,
    headers=headers1,
    data=data1,
)

jar_cookies =response.cookies

aspxauth_cookie = jar_cookies.get('.ASPXAUTH')
serverid_cookie = jar_cookies.get('SERVERID')

cookies = {'.ASPXAUTH': aspxauth_cookie, 'SERVERID': serverid_cookie}




headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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