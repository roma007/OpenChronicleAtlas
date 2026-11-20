#!/usr/bin/env python3
"""Improve county label points with GeoNames county seats.

Usage:
  curl -L -o CN.zip https://download.geonames.org/export/dump/CN.zip
  unzip CN.zip
  python3 scripts/import-county-seats.py CN.txt

Source: GeoNames, https://www.geonames.org/ (CC BY 4.0).
Only counties whose current pointSource is not `county-seat-place` are updated.
A candidate must have an exact Chinese name match and lie within 60 km of the
current point; PPLA* administrative seats are preferred, then nearest.
"""

from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGIONS = ROOT / "data/atlases/anti-japanese-war/regions.json"
MAX_KM = 60.0


def distance_km(a, b):
    mid = math.radians((a[1] + b[1]) / 2)
    dx = (a[0] - b[0]) * 111.32 * math.cos(mid)
    dy = (a[1] - b[1]) * 110.57
    return math.hypot(dx, dy)


def base_name(name: str) -> str:
    return re.sub(r"(县|市|区|旗|州)$", "", name)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    source = Path(sys.argv[1])
    regions = json.loads(REGIONS.read_text())
    counties = [
        region
        for region in regions["regions"]
        if region["level"] == "county" and region.get("point")
    ]

    places = []
    with source.open(encoding="utf-8") as handle:
        for line in handle:
            cols = line.rstrip("\n").split("\t")
            if len(cols) < 15 or cols[8] != "CN":
                continue
            places.append(
                {
                    "id": cols[0],
                    "names": {cols[1], *cols[3].split(",")},
                    "lat": float(cols[4]),
                    "lng": float(cols[5]),
                    "code": cols[7],
                    "population": int(cols[14] or 0),
                }
            )

    updated = 0
    skipped = 0
    unmatched = []
    for county in counties:
        if county.get("extensions", {}).get("pointSource") == "county-seat-place":
            skipped += 1
            continue
        base = base_name(county["name"]["zh"])
        candidates = []
        for place in places:
            if base not in place["names"] and county["name"]["zh"] not in place["names"]:
                continue
            distance = distance_km(county["point"], [place["lng"], place["lat"]])
            if distance <= MAX_KM:
                candidates.append((distance, place))
        if not candidates:
            unmatched.append(county["name"]["zh"])
            continue
        candidates.sort(
            key=lambda item: (
                0 if item[1]["code"].startswith("PPLA") else 1,
                item[0],
                -item[1]["population"],
            )
        )
        distance, place = candidates[0]
        county["point"] = [round(place["lng"], 4), round(place["lat"], 4)]
        county.setdefault("extensions", {}).update(
            {
                "pointSource": "geonames",
                "pointPrecision": "county-seat",
                "pointConfidence": "high" if distance <= 20 else "medium",
                "geonameId": place["id"],
            }
        )
        updated += 1

    REGIONS.write_text(json.dumps(regions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"counties={len(counties)} updated={updated} kept-seat-place={skipped} "
        f"unmatched={len(unmatched)}"
    )
    if unmatched:
        print("unmatched:", "、".join(unmatched))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
