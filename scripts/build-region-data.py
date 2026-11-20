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
    "张家口": "万全县",
    "张北": "张北县",
    "沽源": "沽源县",
    "商都": "商都县",
    "沈阳": "沈阳县",
    "锦州": "锦县",
    "抚顺": "抚顺县",
    "长春": "长春县",
    "吉林": "吉林市",
    "哈尔滨": "哈尔滨市",
    "齐齐哈尔": "齐齐哈尔",
    "太原": "阳曲县",
    "大同": "大同县",
    "兴县": "兴县",
    "榆次": "榆次县",
    "辽县": "辽县",
    "黎城": "黎城县",
    "平陆": "平陆县",
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
    "岳阳": "岳阳县",
    "宜昌": "宜昌县",
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
    "成都": "成都县",
    "贵阳": "贵阳县",
    "独山": "独山县",
    "昆明": "昆明县",
    "保山": "保山县",
    "腾冲": "腾冲县",
    "龙陵": "龙陵县",
    "松山": "龙陵县",
    "楚雄": "楚雄县",
    "蒙自": "蒙自县",
    "畹町": "畹町镇",
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
COUNTY_RE = re.compile(r"^(.{2,8}?[县市旗区])(.*)$")

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
        # 1937 年钦州属广东，现代地名写“广西钦州”
        if norm.startswith("广西钦州"):
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
            for key in ("pointConfidence", "geonameId"):
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
        "generatedAt": "2026-11-20",
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
