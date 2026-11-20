#!/usr/bin/env python3
"""Import ROC provincial outlines from a jiangshan-map GeoJSON export.

Usage:
  node scripts/export_geojson.js /tmp/jsmap-out
  python3 scripts/import-roc-provinces.py /tmp/jsmap-out

Source: https://github.com/DeanChensj/jiangshan-map (GPL-3.0, region layer only).
The CHGIS-derived prefecture layer is intentionally NOT used.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data/atlases/anti-japanese-war/territories/roc-provinces.geojson"

PROVINCES = {
    "江苏": ("jiangsu", "江苏省", "江苏", "今江苏省"),
    "浙江": ("zhejiang", "浙江省", "浙江", "今浙江省"),
    "安徽": ("anhui", "安徽省", "安徽", "今安徽省"),
    "江西": ("jiangxi", "江西省", "江西", "今江西省"),
    "湖北": ("hubei", "湖北省", "湖北", "今湖北省"),
    "湖南": ("hunan", "湖南省", "湖南", "今湖南省"),
    "四川": ("sichuan", "四川省", "四川", "今四川省与重庆市"),
    "西康": ("xikang", "西康省", "西康", "今四川西部、西藏东部"),
    "福建": ("fujian", "福建省", "福建", "今福建省"),
    "广东": ("guangdong", "广东省", "广东", "今广东省、海南省、香港、澳门"),
    "广西": ("guangxi", "广西省", "广西", "今广西壮族自治区"),
    "云南": ("yunnan", "云南省", "云南", "今云南省"),
    "贵州": ("guizhou", "贵州省", "贵州", "今贵州省"),
    "河北": ("hebei", "河北省", "河北", "今河北省、北京市、天津市"),
    "山东": ("shandong", "山东省", "山东", "今山东省"),
    "河南": ("henan", "河南省", "河南", "今河南省"),
    "山西": ("shanxi", "山西省", "山西", "今山西省"),
    "陕西": ("shaanxi", "陕西省", "陕西", "今陕西省"),
    "甘肃": ("gansu", "甘肃省", "甘肃", "今甘肃省、宁夏回族自治区"),
    "宁夏": ("ningxia", "宁夏省", "宁夏", "今宁夏回族自治区"),
    "青海": ("qinghai", "青海省", "青海", "今青海省"),
    "绥远": ("suiyuan", "绥远省", "绥远", "今内蒙古自治区中部"),
    "察哈尔": ("chahar", "察哈尔省", "察哈尔", "今河北北部、内蒙古锡林郭勒"),
    "热河": ("rehe", "热河省", "热河", "今河北东北部、内蒙古赤峰、辽宁西部"),
    "辽宁": ("liaoning", "辽宁省", "辽宁", "今辽宁省"),
    "吉林": ("jilin", "吉林省", "吉林", "今吉林省"),
    "黑龙江": ("heilongjiang", "黑龙江省", "黑龙江", "今黑龙江省"),
    "新疆": ("xinjiang", "新疆省", "新疆", "今新疆维吾尔自治区"),
    "西藏": ("tibet", "西藏地方", "西藏", "今西藏自治区"),
    "台湾": ("taiwan", "台湾省", "台湾", "今台湾省"),
}

PERIODS = [
    ("1931-09-18", "1931-12-31", "s_roc_b0", "1931 省界示意", "1931 boundaries"),
    ("1932-01-01", "1937-12-31", "s_roc", "1937 省界示意", "1937 boundaries"),
    ("1938-01-01", "1944-12-31", "s_roc_1938", "抗战相持阶段省界示意", "wartime boundaries"),
    ("1945-01-01", "1945-12-31", "s_roc_c", "1945 省界示意", "1945 boundaries"),
]

TOLERANCE = 0.01  # ~1 km
MIN_RING_POINTS = 4


def sq_seg_dist(p, a, b):
    x, y = p
    x1, y1 = a
    x2, y2 = b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return (x - x1) ** 2 + (y - y1) ** 2
    t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    px, py = x1 + t * dx, y1 + t * dy
    return (x - px) ** 2 + (y - py) ** 2


def rdp(points, tolerance):
    if len(points) <= 2:
        return points
    tol2 = tolerance * tolerance
    first, last = points[0], points[-1]
    index, max_dist = 0, tol2
    for i in range(1, len(points) - 1):
        d = sq_seg_dist(points[i], first, last)
        if d > max_dist:
            index, max_dist = i, d
    if index == 0:
        return [first, last]
    left = rdp(points[: index + 1], tolerance)
    right = rdp(points[index:], tolerance)
    return left[:-1] + right


def simplify_ring(ring, tolerance):
    if not ring:
        return ring
    closed = ring[0] == ring[-1]
    points = ring[:-1] if closed else ring[:]
    if len(points) < 3:
        return ring
    # 以最长两点为基线，避免闭合环首尾同点导致 RDP 失效
    best = (0, 1)
    best_d = -1.0
    for i in range(len(points)):
        for j in (0, len(points) // 2 or 1):
            d = (points[i][0] - points[j][0]) ** 2 + (points[i][1] - points[j][1]) ** 2
            if d > best_d:
                best_d, best = d, (i, j)
    i, j = best
    if i > j:
        i, j = j, i
    rotated = points[i:j] + points[:i] + points[j:]
    simplified = rdp(rotated, tolerance)
    if len(simplified) < 3:
        simplified = points[:: max(1, len(points) // 4)]
    if closed:
        simplified = simplified + [simplified[0]]
    if len(simplified) < MIN_RING_POINTS:
        return ring
    return simplified


def ring_area(ring):
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2


def largest_ring_center(geometry_type, coordinates):
    rings = coordinates if geometry_type == "Polygon" else [r for poly in coordinates for r in poly]
    if not rings:
        return None
    ring = max(rings, key=ring_area)
    if not ring:
        return None
    lng = sum(p[0] for p in ring) / len(ring)
    lat = sum(p[1] for p in ring) / len(ring)
    return [round(lng, 4), round(lat, 4)]


def simplify_geometry(geom):
    if geom["type"] == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": [simplify_ring(r, TOLERANCE) for r in geom["coordinates"]],
        }
    if geom["type"] == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [simplify_ring(r, TOLERANCE) for r in poly] for poly in geom["coordinates"]
            ],
        }
    return geom


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    src = Path(sys.argv[1]) / "snapshots"
    features = []
    for start, end, snapshot, period_label, period_label_en in PERIODS:
        path = src / f"{snapshot}.geojson"
        data = json.loads(path.read_text())
        for feature in data["features"]:
            props = feature["properties"]
            if props.get("layer") != "region":
                continue
            title = props.get("title")
            if title not in PROVINCES:
                continue
            region_id, full_name, short_name, modern_name = PROVINCES[title]
            geom = simplify_geometry(feature["geometry"])
            label_point = largest_ring_center(geom["type"], geom["coordinates"])
            features.append(
                {
                    "type": "Feature",
                    "geometry": geom,
                    "properties": {
                        "entityId": "roc-admin",
                        "startDate": start,
                        "endDate": end,
                        "order": len(features),
                        "name": {
                            "zh": f"{full_name}（{period_label}）",
                            "en": f"{props.get('title_en') or region_id.title()} ({period_label_en})",
                        },
                        "label": {"zh": short_name, "en": props.get("title_en") or region_id.title()},
                        "labelPoint": label_point or props.get("anchor"),
                        "opacity": 0,
                        "extensions": {
                            "kind": "admin-boundary",
                            "level": "province",
                            "regionId": region_id,
                            "precision": "schematic",
                            "period": period_label,
                            "source": "江山时序 Jiangshan Atlas (GPL-3.0), region layer, hand-drawn",
                        },
                    },
                }
            )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False, separators=(",", ":"))
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(features)} province features to {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
