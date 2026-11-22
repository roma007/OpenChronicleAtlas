#!/usr/bin/env python3
"""Build regions.json and region-index.json for the anti-Japanese-war atlas.

Inputs:
  data/atlases/anti-japanese-war/events/events.json
  data/atlases/anti-japanese-war/routes/*.geojson
  data/atlases/anti-japanese-war/territories/roc-provinces.geojson

Outputs:
  data/atlases/anti-japanese-war/regions.json
  data/atlases/anti-japanese-war/region-index.json

The assignment is deterministic: province boundaries by point-in-polygon,
places by exact alias match, routes by 10 km sampling.
"""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATLAS = ROOT / "data/atlases/anti-japanese-war"
BOUNDARIES = ATLAS / "territories/roc-provinces.geojson"

PROVINCE_META = {
    "jiangsu": ("江苏省", "江苏", "今江苏省"),
    "zhejiang": ("浙江省", "浙江", "今浙江省"),
    "anhui": ("安徽省", "安徽", "今安徽省"),
    "jiangxi": ("江西省", "江西", "今江西省"),
    "hubei": ("湖北省", "湖北", "今湖北省"),
    "hunan": ("湖南省", "湖南", "今湖南省"),
    "sichuan": ("四川省", "四川", "今四川省与重庆市"),
    "xikang": ("西康省", "西康", "今四川西部、西藏东部"),
    "fujian": ("福建省", "福建", "今福建省"),
    "guangdong": ("广东省", "广东", "今广东省、海南省、香港、澳门"),
    "guangxi": ("广西省", "广西", "今广西壮族自治区"),
    "yunnan": ("云南省", "云南", "今云南省"),
    "guizhou": ("贵州省", "贵州", "今贵州省"),
    "hebei": ("河北省", "河北", "今河北省、北京市、天津市"),
    "shandong": ("山东省", "山东", "今山东省"),
    "henan": ("河南省", "河南", "今河南省"),
    "shanxi": ("山西省", "山西", "今山西省"),
    "shaanxi": ("陕西省", "陕西", "今陕西省"),
    "gansu": ("甘肃省", "甘肃", "今甘肃省、宁夏回族自治区"),
    "ningxia": ("宁夏省", "宁夏", "今宁夏回族自治区"),
    "qinghai": ("青海省", "青海", "今青海省"),
    "suiyuan": ("绥远省", "绥远", "今内蒙古自治区中部"),
    "chahar": ("察哈尔省", "察哈尔", "今河北北部、内蒙古锡林郭勒"),
    "rehe": ("热河省", "热河", "今河北东北部、内蒙古赤峰、辽宁西部"),
    "liaoning": ("辽宁省", "辽宁", "今辽宁省"),
    "jilin": ("吉林省", "吉林", "今吉林省"),
    "heilongjiang": ("黑龙江省", "黑龙江", "今黑龙江省"),
    "xinjiang": ("新疆省", "新疆", "今新疆维吾尔自治区"),
    "tibet": ("西藏地方", "西藏", "今西藏自治区"),
    "taiwan": ("台湾省", "台湾", "今台湾省"),
}

MUNICIPALITIES = {
    "南京": ("nanjing", "南京市（院辖市）", "南京", "今南京市"),
    "上海": ("shanghai", "上海市（院辖市）", "上海", "今上海市"),
    "北平": ("beiping", "北平市（院辖市）", "北平", "今北京市"),
    "天津": ("tianjin", "天津市（院辖市）", "天津", "今天津市"),
    "青岛": ("qingdao", "青岛市（院辖市）", "青岛", "今青岛市"),
    "重庆": ("chongqing", "重庆市（院辖市）", "重庆", "今重庆市"),
    "西安": ("xian", "西安市（院辖市）", "西安", "今西安市"),
    "香港": ("hongkong", "香港（英属）", "香港", "今香港特别行政区"),
}

MUNICIPALITY_POINTS = {
    "nanjing": (118.78, 32.06),
    "shanghai": (121.47, 31.23),
    "beiping": (116.40, 39.90),
    "tianjin": (117.20, 39.13),
    "qingdao": (120.38, 36.07),
    "chongqing": (106.55, 29.56),
    "xian": (108.94, 34.34),
    "hongkong": (114.17, 22.32),
}

OVERSEAS = ("海外", "海外", "中国以外")

# 明确到县/市的地点；未列出的地点直接挂在省下。
COUNTY_HINTS = {
    "喜峰口": "迁安县",
    "古北口": "密云县",
    "南口": "昌平县",
    "平型关": "灵丘县",
    "阳明堡": "代县",
    "雁门关": "代县",
    "娘子关": "平定县",
    "七亘村": "平定县",
    "神头岭": "潞城县",
    "响堂铺": "涉县",
    "黄土岭": "涞源县",
    "狼牙山": "易县",
    "齐会": "河间县",
    "韩略村": "洪洞县",
    "关家垴": "武乡县",
    "长乐村": "武乡县",
    "石拐镇": "和顺县",
    "忻口": "忻县",
    "忻县": "忻县",
    "盂县": "盂县",
    "徐沟": "徐沟县",
    "台儿庄": "峄县",
    "三灶岛": "中山县",
    "五桂山": "中山县",
    "唐家、香洲": "中山县",
    "石岐": "中山县",
    "大亚湾": "惠阳县",
    "平海、稔山": "惠阳县",
    "澳头、霞涌": "惠阳县",
    "盐灶背": "惠阳县",
    "淡水": "惠阳县",
    "南头": "宝安县",
    "大鹏": "宝安县",
    "广州湾": "遂溪县",
    "通明港": "海康县",
    "钦州湾": "钦县",
    "嘉积": "琼东县",
    "新州": "儋县",
    "白马井": "儋县",
    "崖城": "崖县",
    "田独": "崖县",
    "八所": "昌江县",
    "北黎": "昌江县",
    "新街、墩头": "昌江县",
    "石碌": "昌江县",
    "老城": "澄迈县",
    "美合": "澄迈县",
    "金江": "澄迈县",
    "天尾港": "琼山县",
    "潭口渡口": "琼山县",
    "府城": "琼山县",
    "抱由": "乐东县",
    "文城": "文昌县",
    "清澜港": "文昌县",
    "新墙河": "岳阳县",
    "石牌": "宜昌县",
    "南瓜店": "宜城县",
    "百灵庙": "达尔罕旗",
    "红格尔图": "陶林县",
    "平顶山": "抚顺县",
    "山海关": "临榆县",
    "多伦": "多伦县",
    "朝阳": "朝阳县",
    "归绥": "归绥县",
    "包头": "包头县",
    "五原": "五原县",
    "兰封": "兰封县",
    "邳州": "邳县",
    "衢州": "衢县",
    "鄄城、郓城一带": "鄄城县",
    "正太铁路沿线": "平定县",
    "哈尔滨方向": "哈尔滨",
    "台北": "台北州",
    "海口": "琼山县",
    "三亚": "崖县",
    "五指山": "保亭县",
    "东方": "昌江县",
    "屯昌": "屯昌县",
    "嘉积（今琼海）": "琼东县",
    "琼东嘉积（今琼海）": "琼东县",
    # 城市/县治沿革：有把握的，挂到当时县名
    "保定": "清苑县",
    "石家庄": "石门市",
    "通州": "通县",
    "丰润": "丰润县",
    "易县": "易县",
    "涞源": "涞源县",
    "涉县": "涉县",
    "河间": "河间县",
    "南宫": "南宫县",
    "定县": "定县",
    "阜平": "阜平县",
    "蓟县": "蓟县",
    "遵化": "遵化县",
    "迁安": "迁安县",
    "承德": "承德县",
    "滦平": "滦平县",
    "兴隆": "兴隆县",
    "永清": "永清县",
    "固安": "固安县",
    "涿州": "涿县",
    "正定": "正定县",
    "井陉": "井陉县",
    # 热河 1933 年县名（M230）
    "北票": "朝阳县",
    "开鲁": "开鲁县",
    "凌南": "凌南县",
    "建昌": "凌南县",
    "叶柏寿": "建平县",
    "建平": "建平县",
    "赤峰": "赤峰县",
    "凌源": "凌源县",
    "平泉": "平泉县",
    "林西": "林西县",
    "围场": "围场县",
    "张家口": "万全县",
    "张北": "张北县",
    "沽源": "沽源县",
    "商都": "商都县",
    "沈阳": "沈阳县",
    "锦州": "锦县",
    "抚顺": "抚顺县",
    # 辽宁 1931 年县名（M228）
    "营口": "营口县",
    "安东": "安东县",
    "辽阳": "辽阳县",
    "鞍山": "辽阳县",
    "铁岭": "铁岭县",
    "本溪": "本溪县",
    "海城": "海城县",
    "盖平": "盖平县",
    "复县": "复县",
    "凤城": "凤城县",
    "开原": "开原县",
    "新民": "新民县",
    "锦西": "锦西县",
    "兴城": "兴城县",
    "绥中": "绥中县",
    "葫芦岛": "锦西县",
    "义县": "义县",
    "北镇": "北镇县",
    "岫岩": "岫岩县",
    "长春": "长春县",
    "吉林": "吉林市",
    "哈尔滨": "哈尔滨市",
    "齐齐哈尔": "齐齐哈尔",
    # 吉林、黑龙江 1931—1933 年县名（M229）
    "四平": "梨树县",
    "双城": "双城县",
    "海林": "宁安县",
    "牡丹江": "宁安县",
    "延吉": "延吉县",
    "龙井": "延吉县",
    "依兰": "依兰县",
    "佳木斯": "桦川县",
    "海伦": "海伦县",
    "通化": "通化县",
    "辑安": "辑安县",
    "临江": "临江县",
    "绥芬河": "东宁县",
    "绥阳": "东宁县",
    "东宁": "东宁县",
    "密山": "密山县",
    "宝清": "宝清县",
    "洮南": "洮南县",
    "海拉尔": "呼伦县",
    "满洲里": "胪滨县",
    "太原": "阳曲县",
    "大同": "大同县",
    "兴县": "兴县",
    "榆次": "榆次县",
    "浑源": "浑源县",
    "应县": "应县",
    "山阴": "山阴县",
    "右玉": "右玉县",
    "昔阳": "昔阳县",
    "太谷": "太谷县",
    "祁县": "祁县",
    "清源": "清源县",
    "交城": "交城县",
    "修武": "修武县",
    "博爱": "博爱县",
    "沁阳": "沁阳县",
    "孟县": "孟县",
    "辉县": "辉县",
    "延津": "延津县",
    "原武": "原武县",
    "阳武": "阳武县",
    "房山": "房山县",
    "良乡": "良乡县",
    "琉璃河": "良乡县",
    "温县": "温县",
    "辽县": "辽县",
    "黎城": "黎城县",
    "平陆": "平陆县",
    "永济": "永济县",
    "蒲州": "永济县",
    "闻喜": "闻喜县",
    "洪洞": "洪洞县",
    "灵丘": "灵丘县",
    "代县": "代县",
    "平定": "平定县",
    "武乡": "武乡县",
    "潞城": "潞城县",
    "和顺": "和顺县",
    "临沂": "临沂县",
    "枣庄": "峄县",
    "沂水": "沂水县",
    "济南": "历城县",
    "滕县": "滕县",
    "菏泽": "菏泽县",
    "信阳": "信阳县",
    "南阳": "南阳县",
    "商城": "商城县",
    "安阳": "安阳县",
    "开封": "开封县",
    "息县": "息县",
    "林县": "林县",
    "桐柏": "桐柏县",
    "洛阳": "洛阳县",
    "舞阳": "舞阳县",
    "许昌": "许昌县",
    "郑州": "郑县",
    "陕县": "陕县",
    "徐州": "铜山县",
    "江阴": "江阴县",
    "泰兴": "泰兴县",
    "淮安": "淮安县",
    "盐城": "盐城县",
    "金山卫": "金山县",
    # 江苏 1937 年县名（M213）
    "苏州": "吴县",
    "无锡": "无锡县",
    "常州": "武进县",
    "镇江": "镇江县",
    "扬州": "江都县",
    "南通": "南通县",
    "如皋": "如皋县",
    "海门": "海门县",
    "东台": "东台县",
    "阜宁": "阜宁县",
    "宿迁": "宿迁县",
    "连云港": "灌云县",
    "海州": "东海县",
    "淮阴": "淮阴县",
    "泰州": "泰县",
    "高邮": "高邮县",
    "宜兴": "宜兴县",
    "丹阳": "丹阳县",
    "金坛": "金坛县",
    "溧阳": "溧阳县",
    "溧水": "溧水县",
    "句容": "句容县",
    "昆山": "昆山县",
    "常熟": "常熟县",
    "太仓": "太仓县",
    "吴江": "吴江县",
    "白茆口": "常熟县",
    "姚港": "南通县",
    # 安徽 1937 年县名（M214）
    "广德": "广德县",
    "郎溪": "郎溪县",
    "宣城": "宣城县",
    "当涂": "当涂县",
    "马鞍山": "当涂县",
    "全椒": "全椒县",
    "滁县": "滁县",
    "明光": "嘉山县",
    "池河": "定远县",
    "临淮关": "凤阳县",
    "定远": "定远县",
    "凤阳": "凤阳县",
    "蚌埠": "凤阳县",
    "怀远": "怀远县",
    "蒙城": "蒙城县",
    "涡阳": "涡阳县",
    "亳县": "亳县",
    "亳州": "亳县",
    "萧县": "萧县",
    "宿县": "宿县",
    "砀山": "砀山县",
    "合肥": "合肥县",
    "潜山": "潜山县",
    "太湖": "太湖县",
    "宿松": "宿松县",
    "霍山": "霍山县",
    "东流": "东流县",
    "贵池": "贵池县",
    "和县": "和县",
    "泾县": "泾县",
    "桐城": "桐城县",
    "巢县": "巢县",
    "灵璧": "灵璧县",
    # 山东 1937 年县名（M215）
    "德州": "德县",
    "临清": "临清县",
    "高唐": "高唐县",
    "周村": "长山县",
    "淄川": "淄川县",
    "泰安": "泰安县",
    "潍县": "潍县",
    "兖州": "滋阳县",
    "曲阜": "曲阜县",
    "邹县": "邹县",
    "济宁": "济宁县",
    "泗水": "泗水县",
    "汶上": "汶上县",
    "即墨": "即墨县",
    "烟台": "福山县",
    "黄县": "黄县",
    "威海卫": "威海卫行政区",
    "滕县": "滕县",
    "峄县": "峄县",
    "枣庄": "峄县",
    "临沂": "临沂县",
    "郓城": "郓城县",
    "金乡": "金乡县",
    "聊城": "聊城县",
    "荣成": "荣成县",
    "沂水": "沂水县",
    "马鞍山": "淄川县",
    # 浙江 1937 年县名（M216）
    "嘉兴": "嘉兴县",
    "湖州": "吴兴县",
    "吴兴": "吴兴县",
    "长兴": "长兴县",
    "海宁": "海宁县",
    "乔司": "杭县",
    "富阳": "富阳县",
    "龙溪": "德清县",
    "萧山": "萧山县",
    "慈溪": "慈溪县",
    "奉化": "奉化县",
    "余姚": "余姚县",
    "大皎": "鄞县",
    "象山": "象山县",
    "诸暨": "诸暨县",
    "东阳": "东阳县",
    "义乌": "义乌县",
    "兰溪": "兰溪县",
    "丽水": "丽水县",
    "嵊县": "嵊县",
    "新昌": "新昌县",
    # 福建 1937 年县名（M217）
    "金门": "金门县",
    "厦门": "厦门市",
    "长乐": "长乐县",
    "连江": "连江县",
    "东山港": "东山县",
    "东山": "东山县",
    "永宁": "晋江县",
    "崇武": "惠安县",
    # 江西 1937 年县名（M218）
    "马当": "彭泽县",
    "彭泽": "彭泽县",
    "湖口": "湖口县",
    "星子": "星子县",
    "瑞昌": "瑞昌县",
    "德安": "德安县",
    "永修": "永修县",
    "高安": "高安县",
    "奉新": "奉新县",
    "南康": "南康县",
    # 河北 1937 年县名（M219）
    "廊坊": "安次县",
    "通州": "通县",
    "沧州": "沧县",
    "定县": "定县",
    "邢台": "邢台县",
    "邯郸": "邯郸县",
    "磁县": "磁县",
    "大名": "大名县",
    "宁波": "鄞县",
    "杭州": "杭县",
    "江山": "江山县",
    "温州": "永嘉县",
    "瑞安": "瑞安县",
    "绍兴": "绍兴县",
    "金华": "金华县",
    "镇海": "镇海县",
    "厦门": "厦门市",
    "福州": "闽侯县",
    "六安": "六安县",
    "安庆": "怀宁县",
    "芜湖": "芜湖县",
    "铜陵": "铜陵县",
    "立煌": "立煌县",
    "上饶": "上饶县",
    "上高": "上高县",
    "九江": "九江县",
    "修水": "修水县",
    "南昌": "南昌市",
    "大余": "大庾县",
    "庐山": "星子县",
    "德安": "德安县",
    "瑞昌": "瑞昌县",
    "赣州": "赣县",
    "遂川": "遂川县",
    "高安": "高安县",
    "长沙": "长沙县",
    "常德": "常德县",
    "衡阳": "衡阳县",
    "邵阳": "邵阳县",
    "湘潭": "湘潭县",
    "芷江": "芷江县",
    "沅陵": "沅陵县",
    "平江": "平江县",
    "南县": "南县",
    # 湖南 1937 年县名（M224）
    "营田": "湘阴县",
    "汨罗": "湘阴县",
    "永安": "永安县",
    "大云山": "岳阳县",
    "株洲": "湘潭县",
    "安乡": "安乡县",
    "石门": "石门县",
    "澧县": "澧县",
    "慈利": "慈利县",
    "桃源": "桃源县",
    "沅江": "沅江县",
    "益阳": "益阳县",
    "湘阴": "湘阴县",
    "浏阳": "浏阳县",
    "攸县": "攸县",
    "耒阳": "耒阳县",
    "新宁": "新宁县",
    "洞口": "武冈县",
    "武冈": "武冈县",
    "武阳": "绥宁县",
    "汉寿": "汉寿县",
    "临澧": "临澧县",
    "宁乡": "宁乡县",
    "湘乡": "湘乡县",
    "醴陵": "醴陵县",
    "安仁": "安仁县",
    "茶陵": "茶陵县",
    "绥宁": "绥宁县",
    "岳阳": "岳阳县",
    "宜昌": "宜昌县",
    "农安": "农安县",
    "兰州": "皋兰县",
    "荆州": "江陵县",
    "襄阳": "襄阳县",
    "随县": "随县",
    "枣阳": "枣阳县",
    "宜城": "宜城县",
    "当阳": "当阳县",
    "恩施": "恩施县",
    "公安": "公安县",
    "崇阳": "崇阳县",
    "阳新": "阳新县",
    "老河口": "光化县",
    "武昌": "武昌市",
    "汉口": "汉口市",
    "南市": "上海市",
    "虹口": "上海市",
    "松山": "台北州",
    "鼓浪屿": "厦门市",
    "英租界": "天津市",
    # 湖北 1937 年县名（M223）
    "小池口": "黄梅县",
    "黄梅": "黄梅县",
    "广济": "广济县",
    "武穴": "广济县",
    "田家镇": "广济县",
    "富池口": "阳新县",
    "半壁山": "阳新县",
    "蕲春": "蕲春县",
    "浠水": "浠水县",
    "大冶": "大冶县",
    "鄂城": "鄂城县",
    "黄石港": "大冶县",
    "黄冈": "黄冈县",
    "团风": "黄冈县",
    "黄陂": "黄陂县",
    "麻城": "麻城县",
    "黄安": "黄安县",
    "应城": "应城县",
    "咸宁": "咸宁县",
    "嘉鱼": "嘉鱼县",
    "蒲圻": "蒲圻县",
    "赤壁": "蒲圻县",
    "通山": "通山县",
    "通城": "通城县",
    "京山": "京山县",
    "宋河": "京山县",
    "钟祥": "钟祥县",
    "大沙坪": "崇阳县",
    "羊楼洞": "蒲圻县",
    "南漳": "南漳县",
    "荆门": "荆门县",
    "远安": "远安县",
    "江陵": "江陵县",
    "松滋": "松滋县",
    "宜都": "宜都县",
    "长阳": "长阳县",
    "樊城": "襄阳县",
    "谷城": "谷城县",
    "成都": "成都县",
    "贵阳": "贵阳县",
    "独山": "独山县",
    # 四川、贵州 1937 年县名（M227）
    "万县": "万县",
    "乐山": "乐山县",
    "自贡": "自贡市",
    "宜宾": "宜宾县",
    "泸县": "泸县",
    "泸州": "泸县",
    "黎明关": "荔波县",
    "荔波": "荔波县",
    "三都": "三都县",
    "丹寨": "丹寨县",
    "八寨": "丹寨县",
    "都匀": "都匀县",
    "昆明": "昆明县",
    "保山": "保山县",
    "腾冲": "腾冲县",
    "龙陵": "龙陵县",
    "松山": "龙陵县",
    "楚雄": "楚雄县",
    "蒙自": "蒙自县",
    "畹町": "畹町镇",
    # 云南 1937 年设治局/县名（M226）
    "遮放": "潞西设治局",
    "芒市": "潞西设治局",
    "潞西": "潞西设治局",
    "瑞丽": "瑞丽设治局",
    "陇川": "陇川设治局",
    "盈江": "盈江设治局",
    "梁河": "梁河设治局",
    "孟定": "镇康县",
    "沧源": "沧源设治局",
    "平戛": "龙陵县",
    "象达": "龙陵县",
    "惠通桥": "龙陵县",
    "延安": "肤施县",
    "洛川": "洛川县",
    "中山": "中山县",
    "惠阳": "惠阳县",
    "宝安": "宝安县",
    "新会": "新会县",
    "广州": "广州市",
    "汕头": "汕头市",
    "韶关": "曲江县",
    "佛山": "南海县",
    "江门": "新会县",
    "深圳": "宝安县",
    "惠州": "惠阳县",
    "潮州": "潮安县",
    "雷州": "海康县",
    "南宁": "邕宁县",
    "柳州": "柳州县",
    "桂林": "桂林县",
    "全州": "全县",
    "宾阳": "宾阳县",
    # 广西 1937 年县名（M225）
    "防城": "防城县",
    "钦县": "钦县",
    "小董": "钦县",
    "高峰隘": "武鸣县",
    "昆仑关": "邕宁县",
    "龙州": "龙州县",
    "武鸣": "武鸣县",
    "上林": "上林县",
    "黄沙河": "全县",
    "兴安": "兴安县",
    "灵川": "灵川县",
    "梧州": "苍梧县",
    "平南": "平南县",
    "桂平": "桂平县",
    "宜山": "宜山县",
    "忻城": "忻城县",
    "河池": "河池县",
    "南丹": "南丹县",
    "凭祥": "凭祥县",
    "柳城": "柳城县",
    "象县": "象县",
    "象州": "象县",
    "迁江": "迁江县",
    "花县": "花县",
    "番禺": "番禺县",
    "顺德": "顺德县",
    "高要": "高要县",
    "英德": "英德县",
    "云浮": "云浮县",
    "南雄": "南雄县",
    "和平": "和平县",
    "南澳": "南澳县",
    "澄海": "澄海县",
    "遂溪": "遂溪县",
    "海丰": "海丰县",
    "三水": "三水县",
    "东莞": "东莞县",
    "从化": "从化县",
    "增城": "增城县",
    "龙门": "龙门县",
    "博罗": "博罗县",
    "翁源": "翁源县",
    "新丰": "新丰县",
    # 山西 1937 年县名（M220）
    "阳高": "阳高县",
    "天镇": "天镇县",
    "怀仁": "怀仁县",
    "广灵": "广灵县",
    "左云": "左云县",
    "朔县": "朔县",
    "繁峙": "繁峙县",
    "宁武": "宁武县",
    "崞县": "崞县",
    "原平": "崞县",
    "阳泉": "平定县",
    "寿阳": "寿阳县",
    "平遥": "平遥县",
    "长治": "长治县",
    "晋城": "晋城县",
    "临汾": "临汾县",
    "运城": "安邑县",
    "垣曲": "垣曲县",
    # 河南 1937 年县名（M221）
    "南乐": "南乐县",
    "清丰": "清丰县",
    "濮阳": "濮阳县",
    "汤阴": "汤阴县",
    "淇县": "淇县",
    "长垣": "长垣县",
    "封丘": "封丘县",
    "汲县": "汲县",
    "卫辉": "汲县",
    "新乡": "新乡县",
    "获嘉": "获嘉县",
    "焦作": "修武县",
    "济源": "济源县",
    "永城": "永城县",
    "商丘": "商丘县",
    "杞县": "杞县",
    "通许": "通许县",
    "尉氏": "尉氏县",
    "中牟": "中牟县",
    "固始": "固始县",
    "潢川": "潢川县",
    "光山": "光山县",
    "罗山": "罗山县",
    "确山": "确山县",
    "驻马店": "确山县",
    "泌阳": "泌阳县",
    "新郑": "新郑县",
    "长葛": "长葛县",
    "临颍": "临颍县",
    "漯河": "郾城县",
    "西平": "西平县",
    "禹县": "禹县",
    "郏县": "郏县",
    "临汝": "临汝县",
    "登封": "登封县",
    "鲁山": "鲁山县",
    "巩县": "巩县",
    "渑池": "渑池县",
    "新安": "新安县",
    "西峡": "内乡县",
    "淅川": "淅川县",
    "郾城": "郾城县",
    "襄城": "襄城县",
    "宝丰": "宝丰县",
    "遂平": "遂平县",
    "密县": "密县",
    "广武": "广武县",
    "汜水": "汜水县",
    "荥阳": "荥阳县",
    "陈留": "陈留县",
    "太康": "太康县",
    "正阳": "正阳县",
    "汝南": "汝南县",
    "嵩县": "嵩县",
    "灵宝": "灵宝县",
    "阌乡": "阌乡县",
    "偃师": "偃师县",
    # 察哈尔、绥远 1937 年县名（M222）
    "万全": "万全县",
    "独石口": "赤城县",
    "怀来": "怀来县",
    "延庆": "延庆县",
    "赤城": "赤城县",
    "宣化": "宣化县",
    "柴沟堡": "怀安县",
    "蔚县": "蔚县",
    "丰镇": "丰镇县",
    "兴和": "兴和县",
    "集宁": "集宁县",
    "平地泉": "集宁县",
    "凉城": "凉城县",
    "宁远": "凉城县",
    "萨拉齐": "萨拉齐县",
    "武川": "武川县",
    "陶林": "陶林县",
    "固阳": "固阳县",
    "托克托": "托克托县",
    "清水河": "清水河县",
    "和林": "和林格尔县",
    "和林格尔": "和林格尔县",
}

PROVINCE_PREFIXES = [
    ("黑龙江", "heilongjiang"), ("内蒙古", "suiyuan"), ("热河", "rehe"),
    ("察哈尔", "chahar"), ("绥远", "suiyuan"), ("辽宁", "liaoning"),
    ("吉林", "jilin"), ("河北", "hebei"), ("山东", "shandong"),
    ("河南", "henan"), ("山西", "shanxi"), ("陕西", "shaanxi"),
    ("甘肃", "gansu"), ("宁夏", "ningxia"), ("青海", "qinghai"),
    ("新疆", "xinjiang"), ("四川", "sichuan"), ("西康", "xikang"),
    ("云南", "yunnan"), ("贵州", "guizhou"), ("广西", "guangxi"),
    ("广东", "guangdong"), ("海南", "guangdong"), ("福建", "fujian"),
    ("浙江", "zhejiang"), ("江西", "jiangxi"), ("湖南", "hunan"),
    ("湖北", "hubei"), ("安徽", "anhui"), ("江苏", "jiangsu"),
    ("台湾", "taiwan"), ("西藏", "tibet"),
]

OVERSEAS_PREFIXES = (
    "瑞士", "日本", "美国", "比利时", "埃及", "印度", "缅甸", "越南",
    "泰国", "新加坡", "马来", "菲律宾", "苏联", "朝鲜", "蒙古",
)

PAREN_RE = re.compile(r"（[^）]*）|\([^)]*\)")
COUNTY_RE = re.compile(r"^(.{1,8}?[县市旗区])(.*)$")

# 县治所在的地点名：有同名地点时优先用它作为县标注落点
COUNTY_SEAT_PLACE = {
    "清苑县": "保定",
    "临榆县": "山海关",
    "万全县": "张家口",
    "阳曲县": "太原",
    "肤施县": "延安",
    "铜山县": "徐州",
    "郑县": "郑州",
    "怀宁县": "安庆",
    "全县": "全州",
    "曲江县": "韶关",
    "江陵县": "荆州",
    "赣县": "赣州",
    "大庾县": "大余",
    "石门市": "石家庄",
    "琼东县": "嘉积",
    "杭县": "杭州",
    "宜昌县": "宜昌",
    "龙陵县": "龙陵",
    "中山县": "石岐",
    "崖县": "崖城",
    "琼山县": "府城",
    "从化县": "街口",
    "潮安县": "潮州",
    "鄞县": "宁波",
    "永嘉县": "温州",
    "历城县": "济南",
    "惠阳县": "惠州",
    "邕宁县": "南宁",
    "宝安县": "南头",
    "台北州": "台北",
    "光化县": "老河口",
    "南海县": "佛山",
    "新会县": "会城",
    # 江苏 1937 年县治（M213）
    "吴县": "苏州",
    "无锡县": "无锡",
    "武进县": "常州",
    "镇江县": "镇江",
    "江都县": "扬州",
    "南通县": "南通",
    "如皋县": "如皋",
    "海门县": "海门",
    "东台县": "东台",
    "阜宁县": "阜宁",
    "宿迁县": "宿迁",
    "灌云县": "连云港",
    "东海县": "海州",
    "淮阴县": "淮阴",
    "泰县": "泰州",
    "高邮县": "高邮",
    "宜兴县": "宜兴",
    "丹阳县": "丹阳",
    "金坛县": "金坛",
    "溧阳县": "溧阳",
    "溧水县": "溧水",
    "句容县": "句容",
    "昆山县": "昆山",
    "常熟县": "常熟",
    "太仓县": "太仓",
    "吴江县": "吴江",
    # 安徽 1937 年县治（M214）
    "广德县": "广德",
    "郎溪县": "郎溪",
    "宣城县": "宣城",
    "当涂县": "当涂",
    "全椒县": "全椒",
    "滁县": "滁县",
    "嘉山县": "明光",
    "定远县": "定远",
    "凤阳县": "凤阳",
    "怀远县": "怀远",
    "蒙城县": "蒙城",
    "涡阳县": "涡阳",
    "亳县": "亳县",
    "萧县": "萧县",
    "宿县": "宿县",
    "砀山县": "砀山",
    "合肥县": "合肥",
    "潜山县": "潜山",
    "太湖县": "太湖",
    "宿松县": "宿松",
    "霍山县": "霍山",
    "东流县": "东流",
    "贵池县": "贵池",
    "和县": "和县",
    "泾县": "泾县",
    "桐城县": "桐城",
    "巢县": "巢县",
    "灵璧县": "灵璧",
    # 山东 1937 年县治（M215）
    "德县": "德州",
    "临清县": "临清",
    "高唐县": "高唐",
    "长山县": "周村",
    "淄川县": "淄川",
    "泰安县": "泰安",
    "潍县": "潍县",
    "滋阳县": "兖州",
    "曲阜县": "曲阜",
    "邹县": "邹县",
    "济宁县": "济宁",
    "泗水县": "泗水",
    "汶上县": "汶上",
    "即墨县": "即墨",
    "福山县": "烟台",
    "黄县": "黄县",
    "威海卫行政区": "威海卫",
    "滕县": "滕县",
    "峄县": "峄县",
    "临沂县": "临沂",
    "郓城县": "郓城",
    "金乡县": "金乡",
    "聊城县": "聊城",
    "荣成县": "荣成",
    # 浙江 1937 年县治（M216）
    "嘉兴县": "嘉兴",
    "吴兴县": "湖州",
    "长兴县": "长兴",
    "海宁县": "海宁",
    "富阳县": "富阳",
    "德清县": "龙溪",
    "萧山县": "萧山",
    "慈溪县": "慈溪",
    "奉化县": "奉化",
    "余姚县": "余姚",
    "象山县": "象山",
    "诸暨县": "诸暨",
    "东阳县": "东阳",
    "义乌县": "义乌",
    "兰溪县": "兰溪",
    "丽水县": "丽水",
    "嵊县": "嵊县",
    "新昌县": "新昌",
    # 福建 1937 年县治（M217）
    "金门县": "金门",
    "厦门市": "厦门",
    "长乐县": "长乐",
    "连江县": "连江",
    "东山县": "东山",
    "晋江县": "永宁",
    "惠安县": "崇武",
    # 江西 1937 年县治（M218）
    "彭泽县": "彭泽",
    "湖口县": "湖口",
    "星子县": "星子",
    "瑞昌县": "瑞昌",
    "德安县": "德安",
    "永修县": "永修",
    "高安县": "高安",
    "奉新县": "奉新",
    "南康县": "南康",
    # 河北 1937 年县治（M219）
    "安次县": "廊坊",
    "沧县": "沧州",
    "邢台县": "邢台",
    "邯郸县": "邯郸",
    "磁县": "磁县",
    "大名县": "大名",
}

GENERIC_PLACE_SUFFIXES = {"一线", "一带", "附近", "方向", "沿线", "战场", "地区", "城", "县城", "城内", "城外"}


def normalize(place: str) -> str:
    return PAREN_RE.sub("", place).strip().replace(" ", "")


def point_in_ring(point, ring):
    x, y = point
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i]
        xj, yj = ring[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-18) + xi):
            inside = not inside
        j = i
    return inside


def point_in_geometry(point, geom):
    if geom["type"] == "Polygon":
        rings = [geom["coordinates"]]
    else:
        rings = geom["coordinates"]
    for ringset in rings:
        if not ringset:
            continue
        if not point_in_ring(point, ringset[0]):
            continue
        in_hole = any(point_in_ring(point, hole) for hole in ringset[1:])
        if not in_hole:
            return True
    return False


def nearest_point(point, candidates):
    best = None
    best_d = 1e9
    for item in candidates:
        d = (point[0] - item["point"][0]) ** 2 + (point[1] - item["point"][1]) ** 2
        if d < best_d:
            best_d, best = d, item
    return best


def km_distance(a, b):
    dx = (a[0] - b[0]) * 111.32 * math.cos(math.radians((a[1] + b[1]) / 2))
    dy = (a[1] - b[1]) * 110.57
    return math.hypot(dx, dy)


def route_length_km(coords):
    total = 0.0
    for (x1, y1), (x2, y2) in zip(coords, coords[1:]):
        dx = (x2 - x1) * 111.32 * math.cos(math.radians((y1 + y2) / 2))
        dy = (y2 - y1) * 110.57
        total += math.hypot(dx, dy)
    return total


def sample_line(coords, step_km=10.0):
    length = route_length_km(coords)
    if length <= step_km:
        return [coords[0], coords[-1]]
    count = max(2, int(length / step_km) + 1)
    result = []
    for i in range(count):
        target = length * i / (count - 1)
        acc = 0.0
        for (x1, y1), (x2, y2) in zip(coords, coords[1:]):
            dx = (x2 - x1) * 111.32 * math.cos(math.radians((y1 + y2) / 2))
            dy = (y2 - y1) * 110.57
            seg = math.hypot(dx, dy)
            if acc + seg >= target or (x2, y2) == coords[-1]:
                t = 0 if seg == 0 else (target - acc) / seg
                result.append((x1 + (x2 - x1) * t, y1 + (y2 - y1) * t))
                break
            acc += seg
    return result


def slug(text):
    # 稳定、可读的 ASCII id：用 Unicode 码点，避免引入拼音依赖
    cleaned = re.sub(r"[^0-9A-Za-z\u4e00-\u9fff]+", "-", text).strip("-").lower()
    if not cleaned:
        return "x"
    out = []
    for ch in cleaned:
        if "\u4e00" <= ch <= "\u9fff":
            out.append(f"u{ord(ch):x}")
        else:
            out.append(ch)
    return "".join(out)


def main():
    events = json.loads((ATLAS / "events/events.json").read_text())
    boundaries = json.loads(BOUNDARIES.read_text())["features"]

    with open(BOUNDARIES) as f:
        raw = json.load(f)
    raw["features"] = boundaries
    periods = {}
    for feature in raw["features"]:
        props = feature["properties"]
        if props["startDate"] in periods:
            periods[props["startDate"]]["features"].append(feature)
        else:
            periods[props["startDate"]] = {
                "start": props["startDate"],
                "end": props["endDate"],
                "features": [feature],
            }
    period_list = sorted(periods.values(), key=lambda p: p["start"])

    def province_for(point, date):
        chosen = period_list[0]
        for period in period_list:
            if period["start"] <= date <= period["end"]:
                chosen = period
                break
        for feature in chosen["features"]:
            if point_in_geometry(point, feature["geometry"]):
                return feature["properties"]["extensions"]["regionId"]
        # 边界外/海上：取最近省界标识点
        candidates = [
            {
                "point": feature["properties"].get("labelPoint") or [0, 0],
                "id": feature["properties"]["extensions"]["regionId"],
            }
            for feature in chosen["features"]
        ]
        nearest = nearest_point(point, candidates)
        if nearest is None:
            return None
        # 离最近省界标识点超过 300km，视为境外（缅甸、印度等）
        if km_distance(point, nearest["point"]) > 300:
            return None
        return nearest["id"]

    regions = []
    for pid, (full, short, modern) in PROVINCE_META.items():
        regions.append(
            {
                "id": pid,
                "level": "province",
                "parentId": None,
                "name": {"zh": full, "en": pid.title()},
                "shortName": {"zh": short, "en": pid.title()},
                "aliases": [short],
                "modernName": {"zh": modern},
                "validFrom": "1945-01-01" if pid == "taiwan" else "1931-09-18",
                "validTo": "1945-12-31",
                "extensions": {
                    "frame": "ROC-1937",
                    **({"note": "1945 年台湾光复后纳入"} if pid == "taiwan" else {}),
                },
            }
        )
    for short, (mid, full, sname, modern) in MUNICIPALITIES.items():
        regions.append(
            {
                "id": mid,
                "level": "municipality",
                "parentId": None,
                "name": {"zh": full, "en": mid.title()},
                "shortName": {"zh": sname, "en": mid.title()},
                "aliases": [short],
                "modernName": {"zh": modern},
                "point": list(MUNICIPALITY_POINTS[mid]),
                "validFrom": "1931-09-18",
                "validTo": "1945-12-31",
                "extensions": {"frame": "ROC-1937"},
            }
        )
    regions.append(
        {
            "id": "overseas",
            "level": "overseas",
            "parentId": None,
            "name": {"zh": "海外", "en": "Overseas"},
            "shortName": {"zh": "海外", "en": "Overseas"},
            "aliases": list(OVERSEAS_PREFIXES),
            "validFrom": "1931-09-18",
            "validTo": "1945-12-31",
            "extensions": {"frame": "ROC-1937"},
        }
    )
    # 海南岛在 1937 年属广东，但事件密集，单列一个地理区便于筛选。
    regions.append(
        {
            "id": "hainan",
            "level": "county",
            "parentId": "guangdong",
            "name": {"zh": "海南岛", "en": "Hainan Island"},
            "shortName": {"zh": "海南", "en": "Hainan"},
            "aliases": ["海南", "琼崖"],
            "modernName": {"zh": "今海南省"},
            "validFrom": "1931-09-18",
            "validTo": "1945-12-31",
            "extensions": {"frame": "ROC-1937", "kind": "geographic-area"},
        }
    )

    county_ids = {}
    county_points = {}
    place_by_text = {}
    place_meta = {}

    def ensure_county(province_id, county_name):
        key = f"{province_id}:{county_name}"
        if key in county_ids:
            return county_ids[key]
        cid = f"county-{province_id}-{slug(county_name)}"
        county_ids[key] = cid
        regions.append(
            {
                "id": cid,
                "level": "county",
                "parentId": province_id,
                "name": {"zh": county_name},
                "shortName": {"zh": county_name.replace("县", "").replace("市", "")},
                "aliases": [county_name.replace("县", "").replace("市", "")],
                "extensions": {"frame": "ROC-1937"},
            }
        )
        return cid

    for event in events:
        place = (event["location"].get("place") or {}).get("zh", "")
        if place in place_by_text:
            continue
        norm = normalize(place)
        point = (event["location"]["lng"], event["location"]["lat"])
        date = event["date"]

        province_id = None
        parent_id = None
        for prefix, pid in PROVINCE_PREFIXES:
            if norm.startswith(prefix):
                province_id = pid
                break
        for prefix, meta in MUNICIPALITIES.items():
            if norm.startswith(prefix):
                province_id = meta[0]
                break
        if any(norm.startswith(prefix) for prefix in OVERSEAS_PREFIXES):
            province_id = "overseas"
        # 1937 年钦州、防城、钦县属广东，现代地名写“广西……”
        if norm.startswith(("广西钦州", "广西防城", "广西钦县", "广西小董")):
            province_id = "guangdong"
        if province_id is None:
            province_id = province_for(point, date) or "overseas"

        remainder = norm
        for prefix, pid in PROVINCE_PREFIXES:
            if remainder.startswith(prefix):
                remainder = remainder[len(prefix):]
                break
        for prefix, meta in MUNICIPALITIES.items():
            if remainder.startswith(prefix):
                province_id = meta[0]
                if len(remainder) > len(prefix):
                    remainder = remainder[len(prefix):]
                break
        for prefix in OVERSEAS_PREFIXES:
            if remainder.startswith(prefix):
                remainder = remainder[len(prefix):]
                break
        remainder = remainder or norm

        county_name = None
        place_name = remainder
        match = COUNTY_RE.match(remainder)
        if match and match.group(2):
            county_name = match.group(1)
            place_name = match.group(2) or match.group(1)
        elif remainder in COUNTY_HINTS:
            county_name = COUNTY_HINTS[remainder]
        elif remainder.startswith("海南"):
            county_name = "hainan"
        elif province_id == "guangdong" and any(
            remainder.startswith(x) for x in ("海口", "三亚", "琼山", "文昌", "定安", "澄迈", "临高", "儋", "嘉积", "琼东", "万宁", "陵水", "崖", "乐东", "保亭", "白沙", "昌江", "感恩", "屯昌", "东方", "五指山")
        ):
            county_name = "hainan"
        else:
            prefix_key = next(
                (
                    key
                    for key in sorted(COUNTY_HINTS, key=len, reverse=True)
                    if len(key) >= 2 and remainder.startswith(key) and len(remainder) > len(key)
                ),
                None,
            )
            if prefix_key:
                county_name = COUNTY_HINTS[prefix_key]
                place_name = remainder[len(prefix_key):] or remainder

        if place_name in GENERIC_PLACE_SUFFIXES or place_name.startswith(("、", "，", ",")):
            place_name = remainder

        if county_name == "hainan":
            parent_id = "hainan"
        elif county_name and province_id not in ("overseas",):
            if province_id in MUNICIPALITY_POINTS:
                parent_id = province_id
            else:
                parent_id = ensure_county(province_id, county_name)
        else:
            parent_id = province_id

        if parent_id and (parent_id.startswith("county-") or parent_id == "hainan"):
            county_points.setdefault(parent_id, []).append(point)

        pid = f"place-{province_id}-{slug(remainder)[:60]}"
        # 去重
        suffix = 2
        base = pid
        while pid in place_by_text.values():
            pid = f"{base}-{suffix}"
            suffix += 1

        place_by_text[place] = pid
        skip_place = bool(
            county_name
            and county_name != "hainan"
            and place_name in (county_name, county_name.rstrip("县市"))
        )
        place_id = parent_id if skip_place else pid
        place_meta[place] = {
            "provinceId": province_id,
            "parentId": province_id if skip_place else parent_id,
            "placeId": place_id,
            "point": [round(point[0], 4), round(point[1], 4)],
            "name": place_name,
            "countyName": county_name if county_name and county_name != "hainan" else None,
        }
        if not skip_place:
            regions.append(
                {
                    "id": pid,
                    "level": "place",
                    "parentId": parent_id,
                    "name": {"zh": place_name},
                    "shortName": {"zh": place_name},
                    "aliases": [place, norm],
                    "modernName": {"zh": place},
                    "point": [round(point[0], 4), round(point[1], 4)],
                    "extensions": {
                        "frame": "ROC-1937",
                        "sourcePlace": place,
                        "confidence": "medium" if county_name else "low",
                    },
                }
            )

    # 补一层“地点”到“省”的可反向匹配：事件/路线只存最细 id，
    # 过滤省级时由匹配逻辑沿 parentId 展开。
    regions_by_id = {region["id"]: region for region in regions}
    seat_points = {}
    for region in regions:
        if region["level"] != "place" or not region["parentId"].startswith("county-"):
            continue
        county = regions_by_id.get(region["parentId"])
        if county and COUNTY_SEAT_PLACE.get(county["name"]["zh"]) == region["name"]["zh"]:
            seat_points[county["id"]] = region["point"]

    for region in regions:
        if region["level"] != "county":
            continue
        points = county_points.get(region["id"])
        seat = seat_points.get(region["id"])
        if seat:
            region["point"] = seat
            region.setdefault("extensions", {})["pointSource"] = "county-seat-place"
        elif points:
            region["point"] = [
                round(sum(point[0] for point in points) / len(points), 4),
                round(sum(point[1] for point in points) / len(points), 4),
            ]
            region.setdefault("extensions", {})["pointSource"] = "event-average"

    # 人工/GeoNames 校订过的县治点位优先，见 county-seats.json
    seats_path = ATLAS / "county-seats.json"
    if seats_path.exists():
        overrides = json.loads(seats_path.read_text()).get("counties", {})
        for region in regions:
            override = overrides.get(region["id"])
            if not override:
                continue
            region["point"] = override["point"]
            extensions = region.setdefault("extensions", {})
            extensions["pointSource"] = override["source"]
            for key in ("pointConfidence", "geonameId", "note"):
                if key in override:
                    extensions[key] = override[key]
                else:
                    extensions.pop(key, None)

    out = {
        "schemaVersion": "1.0.0",
        "frame": "ROC-1937",
        "regions": regions,
    }
    (ATLAS / "regions.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # region-index
    event_index = {}
    for event in events:
        place = (event["location"].get("place") or {}).get("zh", "")
        meta = place_meta.get(place)
        if not meta:
            continue
        ids = [meta["provinceId"]]
        if meta["parentId"] and meta["parentId"] not in ids:
            ids.append(meta["parentId"])
        if meta["placeId"] not in ids:
            ids.append(meta["placeId"])
        event_index[event["id"]] = ids

    place_list = [
        {
            "id": meta["placeId"],
            "point": meta["point"],
            "parentId": meta["parentId"],
            "provinceId": meta["provinceId"],
        }
        for place, pid in place_by_text.items()
        for meta in [place_meta[place]]
        if meta["provinceId"] != "overseas"
    ]
    route_index = {}
    for route_file in sorted((ATLAS / "routes").glob("*.geojson")):
        data = json.loads(route_file.read_text())
        for feature in data["features"]:
            props = feature["properties"]
            key = f"{props['entityId']}:{props['order']}"
            coords = feature["geometry"]["coordinates"]
            samples = sample_line(coords)
            ids = set()
            place_ids = set()
            for point in samples:
                pid = province_for(point, props["startDate"]) or "overseas"
                ids.add(pid)
                # 院辖市 20km 内
                for mid, center in MUNICIPALITY_POINTS.items():
                    dx = (point[0] - center[0]) * 111.32 * math.cos(math.radians(point[1]))
                    dy = (point[1] - center[1]) * 110.57
                    if math.hypot(dx, dy) <= 20:
                        ids.add(mid)
                # 最近地点 15km 内
                near = nearest_point(point, place_list)
                if near:
                    dx = (point[0] - near["point"][0]) * 111.32 * math.cos(math.radians(point[1]))
                    dy = (point[1] - near["point"][1]) * 110.57
                    if math.hypot(dx, dy) <= 15:
                        place_ids.add(near["id"])
                        if near["parentId"]:
                            ids.add(near["parentId"])
                        ids.add(near["provinceId"])
            # 端点
            endpoint_ids = []
            for point in (coords[0], coords[-1]):
                pid = province_for(point, props["startDate"]) or "overseas"
                endpoint_ids.append(pid)
                ids.add(pid)
            bad = [x for x in ids if not isinstance(x, str)]
            if bad:
                print("BAD", key, bad[:5])
                raise SystemExit(1)
            route_index[key] = {
                "regionIds": sorted(ids),
                "endpointRegionIds": list(dict.fromkeys(endpoint_ids)),
            }

    index = {
        "schemaVersion": "1.0.0",
        "generatedAt": "2026-11-21",
        "events": event_index,
        "routes": route_index,
    }
    (ATLAS / "region-index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"regions: {len(regions)}; events: {len(event_index)}/{len(events)}; routes: {len(route_index)}")
    missing = [e['id'] for e in events if e['id'] not in event_index]
    if missing:
        print("missing events:", missing[:10], "…" if len(missing) > 10 else "")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
