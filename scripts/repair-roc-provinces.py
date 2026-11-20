#!/usr/bin/env python3
"""Repair the Hainan ring in the imported ROC province outlines.

The Jiangshan `region` layer represents Guangdong's Hainan part as one ring
that contains a duplicate north-coast arc. After simplification it shows up as
two long diagonal segments across the island, forming a visible triangle.

This script only touches rings whose points all fall inside the Hainan bbox.
It splits the ring at long jumps and keeps the largest closed sub-ring, which
is the actual Hainan coastline.

Usage:
  python3 scripts/repair-roc-provinces.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "data/atlases/anti-japanese-war/territories/roc-provinces.geojson"
HAINAN_BBOX = (108.0, 17.8, 111.5, 20.5)
LONG_JUMP_DEG = 1.0  # ~100 km；Hainan 北岸有约 96km 的直线段，不能切


def inside_hainan(point) -> bool:
    lng, lat = point
    return (
        HAINAN_BBOX[0] <= lng <= HAINAN_BBOX[2]
        and HAINAN_BBOX[1] <= lat <= HAINAN_BBOX[3]
    )


def segment_deg(a, b) -> float:
    mid = math.radians((a[1] + b[1]) / 2)
    dx = (b[0] - a[0]) * math.cos(mid)
    dy = b[1] - a[1]
    return math.hypot(dx, dy)


def ring_area(ring) -> float:
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2


def repair_ring(ring):
    if len(ring) < 4 or not all(inside_hainan(point) for point in ring[:-1]):
        return ring, False

    closed = ring[0] == ring[-1]
    points = ring[:-1] if closed else ring[:]
    if len(points) < 3:
        return ring, False

    # 在长跳跃处切开，得到若干开放子路径
    subpaths = []
    current = [points[0]]
    for a, b in zip(points, points[1:]):
        if segment_deg(a, b) > LONG_JUMP_DEG:
            subpaths.append(current)
            current = [b]
        else:
            current.append(b)
    subpaths.append(current)

    if len(subpaths) <= 1:
        return ring, False

    best = None
    best_area = 0.0
    for subpath in subpaths:
        if len(subpath) < 3:
            continue
        closed_subpath = subpath + [subpath[0]]
        area = ring_area(closed_subpath)
        if area > best_area:
            best_area = area
            best = closed_subpath

    if best is None or len(best) < 4:
        return ring, False
    return best, True


def repair_geometry(geometry):
    repaired = 0
    if geometry["type"] == "Polygon":
        rings = [geometry["coordinates"]]
    else:
        rings = geometry["coordinates"]

    for part in rings:
        for index, ring in enumerate(part):
            new_ring, changed = repair_ring(ring)
            if changed:
                part[index] = new_ring
                repaired += 1
    return repaired


def main() -> int:
    data = json.loads(PATH.read_text())
    total = 0
    for feature in data["features"]:
        props = feature["properties"]
        if props.get("extensions", {}).get("regionId") != "guangdong":
            continue
        total += repair_geometry(feature["geometry"])

    PATH.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"repaired {total} Hainan ring(s) in {PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
