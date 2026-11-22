#!/usr/bin/env python3
# DEPRECATED (M257): 省界已改由 ENP-China CC0 数据生成，见 scripts/import-roc-provinces-enp.py；本脚本仅存档。
"""Repair the imported ROC province outlines.

The Jiangshan `region` layer splices some border fragments into the end or
middle of a ring and joins them back with long straight chords. Rendered on
the map, those chords look like straight lines across a province (Hainan was
a triangle; Shaanxi, Gansu, Hubei and others had one or more long diagonals).

`roc_ring_repair.stitch_ring` splits every ring at long jumps, reconnects the
fragments by nearest endpoints and drops duplicated arcs.

Usage:
  python3 scripts/repair-roc-provinces.py
"""

from __future__ import annotations

import json
from pathlib import Path

import roc_ring_repair

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "data/atlases/anti-japanese-war/territories/roc-provinces.geojson"


def main() -> int:
    data = json.loads(PATH.read_text())
    repaired = 0
    for feature in data["features"]:
        props = feature["properties"]
        if props.get("extensions", {}).get("kind") != "admin-boundary":
            continue
        before = json.dumps(feature["geometry"], sort_keys=True)
        feature["geometry"] = roc_ring_repair.repair_geometry(feature["geometry"])
        if json.dumps(feature["geometry"], sort_keys=True) != before:
            repaired += 1

    PATH.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"repaired {repaired} province feature(s) in {PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
