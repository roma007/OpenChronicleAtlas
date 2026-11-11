#!/usr/bin/env python3
"""把 Seshat Cliopatria 疆域面导入本项目的 territories.geojson。

用法：
  python3 scripts/import-cliopatria-territories.py /path/to/cliopatria_polities_only_v021.geojson

数据来源：Seshat Cliopatria (CC BY 4.0)
https://github.com/Seshat-Global-History-Databank/cliopatria
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATLASES = ROOT / 'data' / 'atlases'
SOURCE = 'Seshat Cliopatria (CC BY 4.0)'

# (atlas, Cliopatria Name, FromYear, ToYear, entityId, startDate, endDate, labelZh, labelEn)
RULES = [
    # 三国
    ('three-kingdoms', 'Cao Wei', 224, 237, 'cao-wei', '0220-01-01', '0237-12-31', '魏', 'Wei'),
    ('three-kingdoms', 'Cao Wei', 238, 262, 'cao-wei', '0238-01-01', '0262-12-31', '魏', 'Wei'),
    ('three-kingdoms', 'Cao Wei', 263, 264, 'cao-wei', '0263-11-01', '0266-01-31', '魏', 'Wei'),
    ('three-kingdoms', 'Shu Han', 224, 237, 'shu-han', '0221-04-01', '0237-12-31', '汉', 'Han'),
    ('three-kingdoms', 'Shu Han', 238, 260, 'shu-han', '0238-01-01', '0260-12-31', '汉', 'Han'),
    ('three-kingdoms', 'Shu Han', 261, 262, 'shu-han', '0261-01-01', '0263-10-31', '汉', 'Han'),
    ('three-kingdoms', 'Eastern Wu', 207, 237, 'wu', '0229-04-01', '0237-12-31', '吴', 'Wu'),
    ('three-kingdoms', 'Eastern Wu', 238, 262, 'wu', '0238-01-01', '0262-12-31', '吴', 'Wu'),
    ('three-kingdoms', 'Eastern Wu', 263, 269, 'wu', '0263-01-01', '0269-12-31', '吴', 'Wu'),
    ('three-kingdoms', 'Eastern Wu', 270, 282, 'wu', '0270-01-01', '0280-03-31', '吴', 'Wu'),
    ('three-kingdoms', 'Western Jin', 265, 282, 'jin', '0266-02-01', '0280-03-31', '晋', 'Jin'),
    # 隋唐
    ('sui-tang', 'Sui Dynasty', 587, 591, 'sui', '0581-02-01', '0591-12-31', '隋', 'Sui'),
    ('sui-tang', 'Sui Dynasty', 592, 601, 'sui', '0592-01-01', '0601-12-31', '隋', 'Sui'),
    ('sui-tang', 'Sui Dynasty', 602, 611, 'sui', '0602-01-01', '0611-12-31', '隋', 'Sui'),
    ('sui-tang', 'Sui Dynasty', 612, 616, 'sui', '0612-01-01', '0616-12-31', '隋', 'Sui'),
    ('sui-tang', 'Sui Dynasty', 617, 622, 'sui', '0617-01-01', '0618-05-31', '隋', 'Sui'),
    ('sui-tang', 'Tang Dynasty', 623, 625, 'tang', '0618-06-01', '0625-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 626, 626, 'tang', '0626-01-01', '0626-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 627, 627, 'tang', '0627-01-01', '0627-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 628, 629, 'tang', '0628-01-01', '0629-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 630, 632, 'tang', '0630-01-01', '0632-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 633, 637, 'tang', '0633-01-01', '0637-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 638, 640, 'tang', '0638-01-01', '0640-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 641, 646, 'tang', '0641-01-01', '0646-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 647, 655, 'tang', '0647-01-01', '0655-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 656, 660, 'tang', '0656-01-01', '0660-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 661, 665, 'tang', '0661-01-01', '0665-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 666, 673, 'tang', '0666-01-01', '0673-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 674, 681, 'tang', '0674-01-01', '0681-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 682, 691, 'tang', '0682-01-01', '0691-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 692, 704, 'tang', '0692-01-01', '0704-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 705, 749, 'tang', '0705-01-01', '0749-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 750, 750, 'tang', '0750-01-01', '0750-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 751, 754, 'tang', '0751-01-01', '0754-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 755, 756, 'tang', '0755-01-01', '0756-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 757, 762, 'tang', '0757-01-01', '0762-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 763, 767, 'tang', '0763-01-01', '0767-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 768, 829, 'tang', '0768-01-01', '0829-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 830, 849, 'tang', '0830-01-01', '0849-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 850, 859, 'tang', '0850-01-01', '0859-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 860, 865, 'tang', '0860-01-01', '0865-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 866, 874, 'tang', '0866-01-01', '0874-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 875, 877, 'tang', '0875-01-01', '0877-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 878, 879, 'tang', '0878-01-01', '0879-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 880, 881, 'tang', '0880-01-01', '0881-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 882, 883, 'tang', '0882-01-01', '0883-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 884, 899, 'tang', '0884-01-01', '0899-12-31', '唐', 'Tang'),
    ('sui-tang', 'Tang Dynasty', 900, 910, 'tang', '0900-01-01', '0907-04-30', '唐', 'Tang'),
    ('sui-tang', 'Tibetan Empire', 623, 626, 'tubo', '0620-01-01', '0626-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 627, 627, 'tubo', '0627-01-01', '0627-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 628, 633, 'tubo', '0628-01-01', '0633-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 634, 637, 'tubo', '0634-01-01', '0637-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 638, 640, 'tubo', '0638-01-01', '0640-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 641, 655, 'tubo', '0641-01-01', '0655-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 656, 660, 'tubo', '0656-01-01', '0660-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 661, 665, 'tubo', '0661-01-01', '0665-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 666, 673, 'tubo', '0666-01-01', '0673-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 674, 681, 'tubo', '0674-01-01', '0681-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 682, 691, 'tubo', '0682-01-01', '0691-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 692, 704, 'tubo', '0692-01-01', '0704-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 705, 717, 'tubo', '0705-01-01', '0717-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 718, 731, 'tubo', '0718-01-01', '0731-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 732, 749, 'tubo', '0732-01-01', '0749-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 750, 750, 'tubo', '0750-01-01', '0750-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 751, 756, 'tubo', '0751-01-01', '0756-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 757, 762, 'tubo', '0757-01-01', '0762-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 763, 767, 'tubo', '0763-01-01', '0767-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 768, 771, 'tubo', '0768-01-01', '0771-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 772, 782, 'tubo', '0772-01-01', '0782-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 783, 792, 'tubo', '0783-01-01', '0792-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 793, 829, 'tubo', '0793-01-01', '0829-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 830, 839, 'tubo', '0830-01-01', '0839-12-31', '吐蕃', 'Tubo'),
    ('sui-tang', 'Tibetan Empire', 840, 849, 'tubo', '0840-01-01', '0850-12-31', '吐蕃', 'Tubo'),
    # 宋元
    ('song-yuan', 'Northern Song', 961, 969, 'northern-song', '0960-02-01', '0969-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 970, 979, 'northern-song', '0970-01-01', '0979-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 980, 989, 'northern-song', '0980-01-01', '0989-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 990, 1039, 'northern-song', '0990-01-01', '1039-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 1040, 1055, 'northern-song', '1040-01-01', '1055-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 1056, 1125, 'northern-song', '1056-01-01', '1125-12-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Northern Song', 1126, 1138, 'northern-song', '1126-01-01', '1127-03-31', '北宋', 'Northern Song'),
    ('song-yuan', 'Liao Dynasty', 960, 979, 'liao', '0960-02-01', '0979-12-31', '辽', 'Liao'),
    ('song-yuan', 'Liao Dynasty', 980, 989, 'liao', '0980-01-01', '0989-12-31', '辽', 'Liao'),
    ('song-yuan', 'Liao Dynasty', 990, 1039, 'liao', '0990-01-01', '1039-12-31', '辽', 'Liao'),
    ('song-yuan', 'Liao Dynasty', 1040, 1110, 'liao', '1040-01-01', '1110-12-31', '辽', 'Liao'),
    ('song-yuan', 'Liao Dynasty', 1111, 1125, 'liao', '1111-01-01', '1125-03-31', '辽', 'Liao'),
    ('song-yuan', 'Great Jin', 1126, 1138, 'jin', '1126-01-01', '1138-12-31', '金', 'Jin'),
    ('song-yuan', 'Great Jin', 1139, 1205, 'jin', '1139-01-01', '1205-12-31', '金', 'Jin'),
    ('song-yuan', 'Great Jin', 1206, 1215, 'jin', '1206-01-01', '1215-12-31', '金', 'Jin'),
    ('song-yuan', 'Great Jin', 1216, 1226, 'jin', '1216-01-01', '1226-12-31', '金', 'Jin'),
    ('song-yuan', 'Great Jin', 1227, 1235, 'jin', '1227-01-01', '1234-02-28', '金', 'Jin'),
    ('song-yuan', 'Southern Song', 1139, 1240, 'southern-song', '1127-06-01', '1240-12-31', '南宋', 'Southern Song'),
    ('song-yuan', 'Southern Song', 1241, 1249, 'southern-song', '1241-01-01', '1249-12-31', '南宋', 'Southern Song'),
    ('song-yuan', 'Southern Song', 1250, 1259, 'southern-song', '1250-01-01', '1259-12-31', '南宋', 'Southern Song'),
    ('song-yuan', 'Southern Song', 1260, 1271, 'southern-song', '1260-01-01', '1271-12-31', '南宋', 'Southern Song'),
    ('song-yuan', 'Southern Song', 1272, 1278, 'southern-song', '1272-01-01', '1279-03-31', '南宋', 'Southern Song'),
    ('song-yuan', 'Western Xia', 1040, 1125, 'western-xia', '1038-10-01', '1125-12-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Western Xia', 1126, 1138, 'western-xia', '1126-01-01', '1138-12-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Western Xia', 1139, 1205, 'western-xia', '1139-01-01', '1205-12-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Western Xia', 1206, 1215, 'western-xia', '1206-01-01', '1215-12-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Western Xia', 1216, 1219, 'western-xia', '1216-01-01', '1219-12-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Western Xia', 1220, 1226, 'western-xia', '1220-01-01', '1227-07-31', '西夏', 'Western Xia'),
    ('song-yuan', 'Mongol Empire', 1206, 1209, 'mongol-yuan', '1206-01-01', '1209-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1210, 1215, 'mongol-yuan', '1210-01-01', '1215-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1216, 1219, 'mongol-yuan', '1216-01-01', '1219-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1220, 1226, 'mongol-yuan', '1220-01-01', '1226-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1227, 1235, 'mongol-yuan', '1227-08-01', '1235-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1236, 1240, 'mongol-yuan', '1236-01-01', '1240-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1241, 1249, 'mongol-yuan', '1241-01-01', '1249-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1250, 1259, 'mongol-yuan', '1250-01-01', '1259-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1260, 1271, 'mongol-yuan', '1260-01-01', '1271-12-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Mongol Empire', 1272, 1278, 'mongol-yuan', '1272-01-01', '1279-03-31', '蒙古', 'Mongols'),
    ('song-yuan', 'Kingdom of Dali', 947, 969, 'dali', '0960-02-01', '0969-12-31', '大理', 'Dali'),
    ('song-yuan', 'Kingdom of Dali', 970, 1055, 'dali', '0970-01-01', '1055-12-31', '大理', 'Dali'),
    ('song-yuan', 'Kingdom of Dali', 1056, 1249, 'dali', '1056-01-01', '1249-12-31', '大理', 'Dali'),
    ('song-yuan', 'Kingdom of Dali', 1250, 1259, 'dali', '1250-01-01', '1253-12-31', '大理', 'Dali'),
]


def ring_area(ring):
    area = 0.0
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % len(ring)]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2


def label_point(geometry):
    parts = (
        [geometry['coordinates']]
        if geometry['type'] == 'Polygon'
        else geometry['coordinates']
    )
    best = max((part[0] for part in parts), key=ring_area)
    lng = sum(p[0] for p in best) / len(best)
    lat = sum(p[1] for p in best) / len(best)
    return [round(lng, 2), round(lat, 2)]


def main():
    if len(sys.argv) != 2:
        raise SystemExit('用法：python3 scripts/import-cliopatria-territories.py <cliopatria.geojson>')
    source_path = Path(sys.argv[1])
    data = json.loads(source_path.read_text(encoding='utf-8'))

    lookup = {}
    for feature in data['features']:
        p = feature['properties']
        lookup[(p['Name'], p['FromYear'], p['ToYear'])] = feature

    by_atlas = {}
    for rule in RULES:
        atlas, name, from_year, to_year, entity, start, end, label_zh, label_en = rule
        feature = lookup.get((name, from_year, to_year))
        if feature is None:
            print(f'⚠️ 缺少 {name} {from_year}-{to_year}')
            continue
        geometry = feature['geometry']
        # 保证闭合
        def close_ring(ring):
            if ring[0] != ring[-1]:
                return ring + [ring[0]]
            return ring

        if geometry['type'] == 'Polygon':
            coords = [close_ring(r) for r in geometry['coordinates']]
            geom = {'type': 'Polygon', 'coordinates': coords}
        else:
            coords = [[close_ring(r) for r in poly] for poly in geometry['coordinates']]
            geom = {'type': 'MultiPolygon', 'coordinates': coords}

        out = {
            'type': 'Feature',
            'geometry': geom,
            'properties': {
                'entityId': entity,
                'startDate': start,
                'endDate': end,
                'name': {'zh': f'{label_zh}疆域（{from_year}—{to_year}）', 'en': f'{label_en} territory ({from_year}–{to_year})'},
                'description': {
                    'zh': 'Seshat Cliopatria 疆域面，按本项目时间范围裁剪与映射；边界为学术估算，非精确国界。',
                    'en': 'Seshat Cliopatria territory polygon, clipped and mapped to this atlas; boundaries are scholarly estimates, not precise state borders.',
                },
                'label': {'zh': label_zh, 'en': label_en},
                'labelPoint': label_point(geom),
                'opacity': 0.15,
                'extensions': {
                    'precision': 'dataset',
                    'source': SOURCE,
                    'sourceFeature': {
                        'name': name,
                        'fromYear': from_year,
                        'toYear': to_year,
                        'wikidata': feature['properties'].get('Wikidata', ''),
                    },
                },
            },
        }
        by_atlas.setdefault(atlas, []).append(out)

    # 保留隋唐的安史控制区（Cliopatria 无对应政权面）
    sui_tang_path = ATLASES / 'sui-tang' / 'territories' / 'territories.geojson'
    if sui_tang_path.exists():
        existing = json.loads(sui_tang_path.read_text(encoding='utf-8'))
        for feature in existing['features']:
            if '安史' in feature['properties'].get('name', {}).get('zh', ''):
                feature['properties']['extensions'] = {
                    **feature['properties'].get('extensions', {}),
                    'precision': 'schematic',
                    'source': '本项目示意数据',
                }
                by_atlas.setdefault('sui-tang', []).append(feature)

    for atlas, features in by_atlas.items():
        features.sort(key=lambda f: (f['properties']['startDate'], f['properties']['entityId']))
        out = {'type': 'FeatureCollection', 'features': features}
        path = ATLASES / atlas / 'territories' / 'territories.geojson'
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        print(f'✅ {atlas}: {len(features)} 个疆域面 → {path}')


if __name__ == '__main__':
    main()
