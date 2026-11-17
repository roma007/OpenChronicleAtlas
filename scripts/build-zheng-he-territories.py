#!/usr/bin/env python3
"""生成郑和下西洋专题的疆域面。

大部分疆域面来自 Seshat Cliopatria（CC BY 4.0）的政权记录：
https://seshat-db.com/api/core/cliopatria-shapefiles/

Cliopatria 没有收录满剌加、古里、忽鲁谟斯等海上小国，也不覆盖明代古吉拉特，
这些面由本项目按史料大致范围手绘，精度标记为 schematic。

用法：
  python3 scripts/build-zheng-he-territories.py
"""

from __future__ import annotations

import json
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'data' / 'atlases' / 'zheng-he' / 'territories' / 'territories.geojson'
API = 'https://seshat-db.com/api/core/cliopatria-shapefiles/{record_id}/?format=json'
SOURCE = 'Seshat Cliopatria (CC BY 4.0), API snapshot 2026-11-17'
SCHEMATIC_SOURCE = '本项目示意边界（据史料大致范围绘制）'
CACHE = Path(tempfile.gettempdir()) / 'atlas-cliopatria-cache'

START = '1405-07-11'
END = '1433-07-22'

# (record id, 本项目起, 本项目止)
DATASET_RULES = [
    {
        'entityId': 'ming',
        'label': {'zh': '明', 'en': 'Ming'},
        'labelPoint': [112.0, 30.5],
        'records': [
            (22433, START, '1406-12-31'),
            (22443, '1407-01-01', '1414-12-31'),
            (22510, '1415-01-01', '1421-12-31'),
            (22608, '1422-01-01', '1428-12-31'),
            (22645, '1429-01-01', END),
        ],
    },
    {
        'entityId': 'champa',
        'label': {'zh': '占城', 'en': 'Champa'},
        'labelPoint': [108.0, 13.5],
        'records': [
            (22024, START, '1428-12-31'),
            (22632, '1429-01-01', END),
        ],
    },
    {
        'entityId': 'khmer',
        'label': {'zh': '真腊', 'en': 'Khmer'},
        'labelPoint': [104.5, 12.5],
        'records': [(22182, START, END)],
    },
    {
        'entityId': 'ayutthaya',
        'label': {'zh': '暹罗', 'en': 'Ayutthaya'},
        'labelPoint': [100.3, 14.5],
        'records': [(22332, START, END)],
    },
    {
        'entityId': 'majapahit',
        'label': {'zh': '满者伯夷', 'en': 'Majapahit'},
        'labelPoint': [111.5, -7.5],
        'records': [
            (22415, START, '1406-12-31'),
            (22455, '1407-01-01', END),
        ],
    },
    {
        'entityId': 'samudera-pasai',
        'label': {'zh': '苏门答剌', 'en': 'Samudera Pasai'},
        'labelPoint': [96.5, 5.2],
        'records': [(22054, START, END)],
    },
    {
        'entityId': 'ceylon',
        'label': {'zh': '锡兰', 'en': 'Ceylon'},
        'labelPoint': [80.7, 7.5],
        'records': [(21967, START, END)],
    },
    {
        'entityId': 'vijayanagara',
        'label': {'zh': '毗奢耶那伽罗', 'en': 'Vijayanagara'},
        'labelPoint': [77.0, 14.0],
        'records': [(22162, START, END)],
    },
    {
        'entityId': 'bahmani',
        'label': {'zh': '巴赫曼尼', 'en': 'Bahmani'},
        'labelPoint': [76.5, 18.0],
        'records': [(22199, START, END)],
    },
    {
        'entityId': 'bengal',
        'label': {'zh': '榜葛剌', 'en': 'Bengal'},
        'labelPoint': [88.5, 24.0],
        'records': [(22294, START, END)],
    },
    {
        'entityId': 'rasulid',
        'label': {'zh': '拉苏里', 'en': 'Rasulid'},
        'labelPoint': [45.0, 15.0],
        'records': [(21060, START, END)],
    },
    {
        'entityId': 'mamluk',
        'label': {'zh': '马穆鲁克', 'en': 'Mamluk'},
        'labelPoint': [39.5, 22.0],
        'records': [
            (22363, START, '1406-12-31'),
            (22488, '1407-01-01', '1414-12-31'),
            (22554, '1415-01-01', END),
        ],
    },
]

SCHEMATIC_RULES = [
    {
        'entityId': 'gujarat',
        'label': {'zh': '古吉拉特', 'en': 'Gujarat'},
        'labelPoint': [71.8, 22.9],
        'startDate': '1407-01-01',
        'endDate': END,
        'name': {'zh': '古吉拉特苏丹国（示意）', 'en': 'Gujarat Sultanate (schematic)'},
        'description': {
            'zh': '古吉拉特苏丹国 1407 年建立，以艾哈迈达巴德为中心。边界为示意，非精确国界。',
            'en': 'The Gujarat Sultanate was founded in 1407 with its centre at Ahmedabad. Boundary is schematic, not a precise border.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [68.5, 23.8], [69.5, 24.3], [70.8, 24.5], [72.0, 24.8],
                [73.2, 24.6], [74.0, 23.8], [74.2, 22.8], [73.6, 21.8],
                [72.8, 21.2], [71.8, 20.7], [70.8, 20.9], [69.8, 21.5],
                [68.9, 22.3], [68.5, 23.2], [68.5, 23.8],
            ]],
        },
    },
]

PORT_RULES = [
    {
        'label': {'zh': '满剌加', 'en': 'Malacca'},
        'labelPoint': [102.2, 2.2],
        'name': {'zh': '满剌加（示意）', 'en': 'Malacca (schematic)'},
        'description': {
            'zh': '满剌加苏丹国约 1400 年建立，1406 年起为明朝下西洋的中转官厂。边界为示意。',
            'en': 'The Malacca Sultanate arose around 1400 and from 1406 served as the Ming fleet’s transhipment depot. Boundary is schematic.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [100.2, 2.0], [101.0, 2.3], [102.0, 2.8], [103.0, 3.0],
                [103.8, 2.6], [103.7, 1.8], [102.8, 1.3], [101.6, 1.2],
                [100.6, 1.4], [100.2, 2.0],
            ]],
        },
    },
    {
        'label': {'zh': '古里', 'en': 'Calicut'},
        'labelPoint': [75.6, 10.8],
        'name': {'zh': '马拉巴尔诸港（古里、柯枝、小葛兰，示意）', 'en': 'Malabar ports (Calicut, Cochin, Quilon; schematic)'},
        'description': {
            'zh': '马拉巴尔海岸的古里、柯枝、小葛兰等港口由地方王公统治，古里为郑和船队的重要锚地。边界为示意。',
            'en': 'Calicut, Cochin and Quilon on the Malabar coast were ruled by local rulers; Calicut was a key anchorage for Zheng He’s fleet. Boundary is schematic.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [74.9, 8.0], [75.7, 8.1], [76.1, 9.2], [76.0, 10.5],
                [75.8, 11.8], [75.2, 12.2], [74.8, 11.5], [74.9, 10.3],
                [74.7, 9.2], [74.9, 8.0],
            ]],
        },
    },
    {
        'label': {'zh': '忽鲁谟斯', 'en': 'Hormuz'},
        'labelPoint': [56.4, 26.8],
        'name': {'zh': '忽鲁谟斯（示意）', 'en': 'Hormuz (schematic)'},
        'description': {
            'zh': '忽鲁谟斯扼守霍尔木兹海峡，是波斯湾与印度洋贸易的枢纽。边界为示意。',
            'en': 'Hormuz controlled the Strait of Hormuz and was a hub of Persian Gulf and Indian Ocean trade. Boundary is schematic.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [55.0, 26.6], [55.8, 27.2], [56.8, 27.6], [57.6, 27.4],
                [57.3, 26.4], [56.7, 25.7], [55.8, 25.6], [55.2, 26.0],
                [55.0, 26.6],
            ]],
        },
    },
    {
        'label': {'zh': '溜山', 'en': 'Maldives'},
        'labelPoint': [73.35, 4.1],
        'name': {'zh': '溜山（马尔代夫，示意）', 'en': 'Maldives (schematic)'},
        'description': {
            'zh': '溜山即马尔代夫群岛，郑和船队曾在此停泊。边界为示意。',
            'en': 'Liushan is the Maldive archipelago, where Zheng He’s fleet stopped. Boundary is schematic.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [72.9, 4.6], [73.4, 4.7], [73.9, 4.4], [73.8, 3.6],
                [73.2, 3.4], [72.8, 3.8], [72.9, 4.6],
            ]],
        },
    },
    {
        'label': {'zh': '佐法儿', 'en': 'Dhofar'},
        'labelPoint': [54.4, 17.1],
        'name': {'zh': '佐法儿（示意）', 'en': 'Dhofar (schematic)'},
        'description': {
            'zh': '佐法儿位于阿拉伯半岛南岸，以乳香贸易著称。边界为示意。',
            'en': 'Dhofar on the southern Arabian coast was known for its frankincense trade. Boundary is schematic.',
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[
                [53.5, 18.1], [54.2, 18.2], [55.2, 17.8], [55.6, 17.0],
                [55.2, 16.2], [54.3, 16.0], [53.6, 16.5], [53.5, 17.3],
                [53.5, 18.1],
            ]],
        },
    },
    {
        'label': {'zh': '东非城邦', 'en': 'Swahili city-states'},
        'labelPoint': [40.1, -3.3],
        'name': {'zh': '东非城邦（摩加迪沙、布拉瓦、竹步、马林迪，示意）', 'en': 'Swahili city-states (Mogadishu, Brava, Juba, Malindi; schematic)'},
        'description': {
            'zh': '索马里与肯尼亚沿岸的摩加迪沙、布拉瓦、竹步、马林迪等斯瓦希里城邦，郑和船队曾到访。各城邦范围狭小，边界为示意。',
            'en': 'The Swahili city-states of Mogadishu, Brava, Juba and Malindi on the Somali and Kenyan coast were visited by Zheng He’s fleet. Their extents were small; boundaries are schematic.',
        },
        'geometry': {
            'type': 'MultiPolygon',
            'coordinates': [
                [[[44.8, 2.5], [45.8, 2.5], [45.8, 1.5], [44.8, 1.5], [44.8, 2.5]]],
                [[[43.4, 1.4], [44.2, 1.4], [44.2, 0.4], [43.4, 0.4], [43.4, 1.4]]],
                [[[41.8, 0.1], [42.8, 0.1], [42.8, -0.9], [41.8, -0.9], [41.8, 0.1]]],
                [[[39.7, -2.8], [40.6, -2.8], [40.6, -3.8], [39.7, -3.8], [39.7, -2.8]]],
            ],
        },
    },
]


def fetch(record_id: int) -> dict:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f'{record_id}.json'
    if path.exists():
        return json.loads(path.read_text(encoding='utf-8'))
    req = urllib.request.Request(API.format(record_id=record_id), headers={'User-Agent': 'atlas-data-builder/1.0'})
    with urllib.request.urlopen(req, timeout=60) as response:
        data = json.load(response)
    path.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    return data


def close_ring(ring: list[list[float]]) -> list[list[float]]:
    cleaned = [[round(float(x), 5), round(float(y), 5)] for x, y in ring]
    if cleaned[0] != cleaned[-1]:
        cleaned.append(cleaned[0])
    return cleaned


def clean_geometry(geometry: dict) -> dict:
    if geometry['type'] == 'Polygon':
        return {'type': 'Polygon', 'coordinates': [close_ring(r) for r in geometry['coordinates']]}
    return {
        'type': 'MultiPolygon',
        'coordinates': [[close_ring(r) for r in part] for part in geometry['coordinates']],
    }


def ring_area(ring: list[list[float]]) -> float:
    area = 0.0
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % len(ring)]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2


def point_in_ring(x: float, y: float, ring: list[list[float]]) -> bool:
    inside = False
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % len(ring)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            inside = not inside
    return inside


def point_in_geometry(x: float, y: float, geometry: dict) -> bool:
    parts = (
        [geometry['coordinates']]
        if geometry['type'] == 'Polygon'
        else geometry['coordinates']
    )
    return any(
        point_in_ring(x, y, part[0]) and not any(point_in_ring(x, y, hole) for hole in part[1:])
        for part in parts
    )


def dataset_feature(rule: dict, record: dict, start: str, end: str) -> dict:
    geometry = clean_geometry(record['geom'])
    label = rule['label']
    return {
        'type': 'Feature',
        'geometry': geometry,
        'properties': {
            'entityId': rule['entityId'],
            'startDate': start,
            'endDate': end,
            'name': {
                'zh': f"{label['zh']}疆域（{record['start_year']}—{record['end_year']}）",
                'en': f"{label['en']} territory ({record['start_year']}–{record['end_year']})",
            },
            'description': {
                'zh': 'Seshat Cliopatria 疆域面，按本专题时间范围裁剪；边界为学术估算，非精确国界。',
                'en': 'Seshat Cliopatria territory polygon clipped to this atlas’s time range; boundaries are scholarly estimates, not precise state borders.',
            },
            'label': label,
            'labelPoint': rule['labelPoint'],
            'opacity': 0.15,
            'extensions': {
                'precision': 'dataset',
                'source': SOURCE,
                'sourceFeature': {
                    'recordId': record['id'],
                    'name': record['name'],
                    'fromYear': record['start_year'],
                    'toYear': record['end_year'],
                    'polityFromYear': record['polity_start_year'],
                    'polityToYear': record['polity_end_year'],
                    'wikipedia': record['wikipedia_name'],
                    'seshatId': record['seshat_id'],
                },
            },
        },
    }


def schematic_feature(rule: dict, entity_id: str) -> dict:
    return {
        'type': 'Feature',
        'geometry': rule['geometry'],
        'properties': {
            'entityId': entity_id,
            'startDate': rule.get('startDate', START),
            'endDate': rule.get('endDate', END),
            'name': rule['name'],
            'description': rule['description'],
            'label': rule['label'],
            'labelPoint': rule['labelPoint'],
            'opacity': 0.15,
            'extensions': {
                'precision': 'schematic',
                'source': SCHEMATIC_SOURCE,
            },
        },
    }


def main() -> None:
    features = []
    for rule in DATASET_RULES:
        for record_id, start, end in rule['records']:
            features.append(dataset_feature(rule, fetch(record_id), start, end))

    for rule in SCHEMATIC_RULES:
        features.append(schematic_feature(rule, rule['entityId']))

    for rule in PORT_RULES:
        features.append(schematic_feature(rule, 'port-states'))

    for feature in features:
        x, y = feature['properties']['labelPoint']
        if not point_in_geometry(x, y, feature['geometry']):
            raise SystemExit(f"标识点落在面外：{feature['properties']['name']['zh']} {x},{y}")

    features.sort(
        key=lambda f: (
            f['properties']['startDate'],
            f['properties']['entityId'],
            f['properties']['name']['zh'],
        )
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({'type': 'FeatureCollection', 'features': features}, ensure_ascii=False, separators=(',', ':')) + '\n',
        encoding='utf-8',
    )
    print(f'✅ 郑和专题：{len(features)} 个疆域面 → {OUT}')


if __name__ == '__main__':
    main()
