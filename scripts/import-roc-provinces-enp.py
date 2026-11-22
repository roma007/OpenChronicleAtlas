#!/usr/bin/env python3
"""Import ROC provincial boundaries (1928–1946) from the ENP-China dataset.

Source: Christian Henriot, "Provinces in Republican China (boundaries)",
Virtual Shanghai / ENP-China (ERC grant 788476), CC0 1.0 Universal.
https://www.virtualshanghai.net/Data/Tables?ID=198

The shapefiles are in WGS_1984_Web_Mercator_Auxiliary_Sphere; this script
reprojects to WGS84 degrees, simplifies with RDP, and writes the atlas
territory file used by the "历史省界" layer.

Usage:
  python3 scripts/import-roc-provinces-enp.py /tmp/prov/x

Expected inputs:
  <src>/Prov_1928_1945/1928_1945.shp
  <src>/Prov_1945_1946/1945_1946.shp
"""

from __future__ import annotations

import json
import math
import sys
import zipfile
from pathlib import Path

import shapefile  # pyshp

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data/atlases/anti-japanese-war/territories/roc-provinces.geojson"

R = 6378137.0
TOLERANCE = 0.008  # degrees, ~0.9 km
MIN_RING_AREA = 0.002  # deg^2, ~20 km^2

# traditional name in source -> (regionId, 简体省名, 标签, 今地说明)
PROVINCES = {
    "江蘇": ("jiangsu", "江苏省", "江苏", "今江苏省"),
    "浙江": ("zhejiang", "浙江省", "浙江", "今浙江省"),
    "安徽": ("anhui", "安徽省", "安徽", "今安徽省"),
    "江西": ("jiangxi", "江西省", "江西", "今江西省"),
    "湖北": ("hubei", "湖北省", "湖北", "今湖北省"),
    "湖南": ("hunan", "湖南省", "湖南", "今湖南省"),
    "四川": ("sichuan", "四川省", "四川", "今四川省与重庆市"),
    "西康": ("xikang", "西康省", "西康", "今四川西部、西藏东部"),
    "福建": ("fujian", "福建省", "福建", "今福建省"),
    "廣東": ("guangdong", "广东省", "广东", "今广东省、海南省、香港、澳门"),
    "廣西": ("guangxi", "广西省", "广西", "今广西壮族自治区"),
    "雲南": ("yunnan", "云南省", "云南", "今云南省"),
    "貴州": ("guizhou", "贵州省", "贵州", "今贵州省"),
    "河北": ("hebei", "河北省", "河北", "今河北省、北京市、天津市"),
    "山東": ("shandong", "山东省", "山东", "今山东省"),
    "河南": ("henan", "河南省", "河南", "今河南省"),
    "山西": ("shanxi", "山西省", "山西", "今山西省"),
    "陝西": ("shaanxi", "陕西省", "陕西", "今陕西省"),
    "甘肅": ("gansu", "甘肃省", "甘肃", "今甘肃省、宁夏回族自治区"),
    "寧夏": ("ningxia", "宁夏省", "宁夏", "今宁夏回族自治区"),
    "青海": ("qinghai", "青海省", "青海", "今青海省"),
    "綏遠": ("suiyuan", "绥远省", "绥远", "今内蒙古自治区中部"),
    "察哈爾": ("chahar", "察哈尔省", "察哈尔", "今河北北部、内蒙古锡林郭勒"),
    "熱河": ("rehe", "热河省", "热河", "今河北东北部、内蒙古赤峰、辽宁西部"),
    "遼寧": ("liaoning", "辽宁省", "辽宁", "今辽宁省"),
    "吉林": ("jilin", "吉林省", "吉林", "今吉林省"),
    "黑龍江": ("heilongjiang", "黑龙江省", "黑龙江", "今黑龙江省"),
    "新疆": ("xinjiang", "新疆省", "新疆", "今新疆维吾尔自治区"),
    "西藏": ("tibet", "西藏地方", "西藏", "今西藏自治区"),
    "台灣": ("taiwan", "台湾省", "台湾", "今台湾省"),
}

# 源图层里台湾的中文名为空，按拼音兜底
PINYIN_FALLBACK = {"Taiwan": "台灣"}

SOURCE = "ENP-China, Provinces in Republican China (boundaries), CC0 1.0"
SOURCE_URL = "https://www.virtualshanghai.net/Data/Tables?ID=198"


def merc_to_lonlat(x: float, y: float) -> tuple[float, float]:
    lon = math.degrees(x / R)
    lat = math.degrees(2 * math.atan(math.exp(y / R)) - math.pi / 2)
    return (round(lon, 5), round(lat, 5))


def ring_area(ring: list[tuple[float, float]]) -> float:
    s = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def rdp(points: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    if len(points) < 3:
        return points
    dmax, index = 0.0, 0
    x1, y1 = points[0]
    x2, y2 = points[-1]
    dx, dy = x2 - x1, y2 - y1
    den = dx * dx + dy * dy
    for i in range(1, len(points) - 1):
        px, py = points[i]
        if den == 0:
            d = math.hypot(px - x1, py - y1)
        else:
            t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / den))
            d = math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
        if d > dmax:
            dmax, index = d, i
    if dmax > eps:
        left = rdp(points[: index + 1], eps)
        right = rdp(points[index:], eps)
        return left[:-1] + right
    return [points[0], points[-1]]


def load_layer(shp: Path, name_field: str) -> dict[str, list[list[list[float]]]]:
    reader = shapefile.Reader(str(shp))
    fields = [f[0] for f in reader.fields[1:]]
    name_idx = fields.index(name_field)
    pinyin_idx = fields.index(name_field.replace("_nz", "_na"))
    out: dict[str, list[list[list[float]]]] = {}
    for shp_obj, rec in zip(reader.shapes(), reader.records()):
        raw = rec[name_idx] or PINYIN_FALLBACK.get((rec[pinyin_idx] or "").strip(), "")
        if not raw:
            continue
        parts = list(shp_obj.parts) + [len(shp_obj.points)]
        rings: list[list[list[float]]] = []
        for a, b in zip(parts[:-1], parts[1:]):
            pts = [merc_to_lonlat(x, y) for x, y in shp_obj.points[a:b]]
            if len(pts) < 4:
                continue
            if pts[0] != pts[-1]:
                pts.append(pts[0])
            if ring_area(pts) < MIN_RING_AREA:
                continue
            simplified = rdp(pts, TOLERANCE)
            if len(simplified) < 4:
                continue
            if simplified[0] != simplified[-1]:
                simplified.append(simplified[0])
            rings.append([[round(x, 5), round(y, 5)] for x, y in simplified])
        if rings:
            out[raw] = rings
    return out


def centroid(ring: list[list[float]]) -> tuple[float, float]:
    a = cx = cy = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        f = x1 * y2 - x2 * y1
        a += f
        cx += (x1 + x2) * f
        cy += (y1 + y2) * f
    if a == 0:
        return (ring[0][0], ring[0][1])
    a *= 0.5
    return (round(cx / (6 * a), 4), round(cy / (6 * a), 4))


# 帧定义：(start, end, 中文标签, 英文标签, 源图层)
FRAMES = [
    ("1931-09-18", "1931-12-31", "1931 省界", "1931 boundaries", "1928"),
    ("1932-01-01", "1937-12-31", "1937 省界", "1937 boundaries", "1928"),
    ("1938-01-01", "1938-12-31", "1938 省界", "1938 boundaries", "1928"),
    ("1939-01-01", "1944-12-31", "抗战相持阶段省界", "wartime boundaries", "1928"),
    ("1945-01-01", "1945-12-31", "1945 省界", "1945 boundaries", "1945"),
]


def main() -> None:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/prov/x")
    layers = {
        "1928": load_layer(src / "Prov_1928_1945" / "1928_1945.shp", "p_28_45_nz"),
        "1945": load_layer(src / "Prov_1945_1946" / "1945_1946.shp", "p_45_46_nz"),
    }
    for key, layer in layers.items():
        print(f"{key}: {len(layer)} provinces")

    features = []
    order = 0
    missing = set()
    for start, end, period_zh, period_en, key in FRAMES:
        layer = layers[key]
        for trad, rings in layer.items():
            meta = PROVINCES.get(trad)
            if not meta:
                missing.add(trad)
                continue
            region_id, province_zh, label_zh, today = meta
            # 西康 1939-01-01 建省；此前称「西康特别行政区」
            if region_id == "xikang" and end < "1939-01-01":
                display_zh = "西康特别行政区"
                status_zh = "1939-01-01 建省前，时为西康特别行政区"
            else:
                display_zh = province_zh
                status_zh = "西康省 1939-01-01 建省" if region_id == "xikang" else ""
            biggest = max(rings, key=ring_area)
            props = {
                "entityId": "roc-admin",
                "startDate": start,
                "endDate": end,
                "order": order,
                "name": {
                    "zh": f"{display_zh}（{period_zh}）",
                    "en": f"{label_zh} ({period_en})",
                },
                "label": {"zh": label_zh, "en": label_zh},
                "labelPoint": list(centroid(biggest)),
                "opacity": 0,
                "extensions": {
                    "kind": "admin-boundary",
                    "level": "province",
                    "regionId": region_id,
                    "precision": "sourced",
                    "period": period_zh,
                    "source": SOURCE,
                    "sourceUrl": SOURCE_URL,
                    "license": "CC0-1.0",
                    "today": today,
                },
            }
            if status_zh:
                props["description"] = {"zh": status_zh + "。", "en": (
                    "Xikang was a special administrative district until it became a province on 1 January 1939."
                    if end >= "1939-01-01"
                    else "Before 1 January 1939 this area was the Xikang special administrative district, not yet a province."
                )}
            features.append(
                {
                    "type": "Feature",
                    "geometry": {"type": "MultiPolygon", "coordinates": [[r] for r in rings]},
                    "properties": props,
                }
            )
            order += 1

    if missing:
        print("未映射的源名称:", sorted(missing))
    OUT.write_text(json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"wrote {OUT} features={len(features)} size={OUT.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    main()
