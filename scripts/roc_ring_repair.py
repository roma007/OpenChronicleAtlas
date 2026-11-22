#!/usr/bin/env python3
# DEPRECATED (M257): 省界已改由 ENP-China CC0 数据生成，见 scripts/import-roc-provinces-enp.py；本脚本仅存档。
"""修复民国省界环里的「跨省直线」。

源数据（江山时序 `region` 图层）把一些边界碎段接在了环的末尾或中间，
再用手绘直线连回主轮廓。渲染出来就是横跨全省的长直线（海南岛是三角形，
陕西、甘肃、湖北等是一条或几条斜线）。

这里的做法不针对某个省，而是对所有环通用：

1. 按 50km 切开环，得到若干「真正的边界碎段」；
2. 用最近端点贪心，把碎段重新串成一个闭环；
3. 若某个碎段让接缝总长多出 150km 以上（典型是重复的海岸弧），丢弃它。

真实的长直边界（如川康界、新疆界）在切分后会被原样接回，不会被删。
"""

from __future__ import annotations

import math

# 超过这个长度就认为是「被接错的碎段端点」，先切开。
SPLIT_KM = 50.0
# 丢弃一段后如果接缝缩短超过这个值，说明这一段是多余的重复弧。
DROP_GAIN_KM = 150.0


def distance_km(a, b) -> float:
    mid = math.radians((a[1] + b[1]) / 2)
    return math.hypot(
        (b[0] - a[0]) * 111.32 * math.cos(mid),
        (b[1] - a[1]) * 110.57,
    )


def ring_area(points) -> float:
    if len(points) < 3:
        return 0.0
    closed = list(points) + [points[0]]
    return abs(
        sum(
            closed[i][0] * closed[i + 1][1] - closed[i + 1][0] * closed[i][1]
            for i in range(len(closed) - 1)
        )
    ) / 2


def split_at_jumps(points):
    if len(points) < 2:
        return [list(points)] if points else []
    subpaths = []
    current = [points[0]]
    for a, b in zip(points, points[1:]):
        if distance_km(a, b) > SPLIT_KM:
            subpaths.append(current)
            current = [b]
        else:
            current.append(b)
    subpaths.append(current)
    return subpaths


def _greedy_order(subpaths):
    """从最大碎段出发，每次接上端点最近的未用碎段。"""
    count = len(subpaths)
    start = max(range(count), key=lambda i: (len(subpaths[i]), ring_area(subpaths[i])))
    used = {start}
    order = [start]
    current = start
    while len(used) < count:
        _, nxt = min(
            (distance_km(subpaths[current][-1], subpaths[i][0]), i)
            for i in range(count)
            if i not in used
        )
        used.add(nxt)
        order.append(nxt)
        current = nxt
    return order


def _drop_duplicate_subpaths(subpaths, order):
    """去掉接上后反而绕远的碎段（重复海岸弧 / 被接错的残片）。"""
    order = list(order)
    changed = True
    while changed and len(order) > 1:
        changed = False
        count = len(order)
        for index in range(count):
            previous = subpaths[order[(index - 1) % count]]
            current = subpaths[order[index]]
            following = subpaths[order[(index + 1) % count]]
            with_current = distance_km(previous[-1], current[0]) + distance_km(
                current[-1], following[0]
            )
            without_current = distance_km(previous[-1], following[0])
            if with_current - without_current > DROP_GAIN_KM:
                order.pop(index)
                changed = True
                break
    return order


def _canonical_start(ring):
    """固定起点，保证重复运行不再产生 diff。"""
    if len(ring) < 2:
        return ring
    points = ring[:-1]
    start = min(
        range(len(points)),
        key=lambda i: (round(points[i][0], 6), round(points[i][1], 6)),
    )
    rotated = points[start:] + points[:start]
    return rotated + [rotated[0]]


def stitch_ring(ring):
    """把一个环里的碎段重新串好，返回闭合环。"""
    if len(ring) < 4:
        return ring
    points = ring[:-1] if ring[0] == ring[-1] else list(ring)
    if len(points) < 3:
        return ring

    subpaths = split_at_jumps(points)
    if len(subpaths) <= 1:
        return ring

    order = _drop_duplicate_subpaths(subpaths, _greedy_order(subpaths))
    stitched = [point for index in order for point in subpaths[index]]
    if len(stitched) < 3:
        return ring
    stitched.append(stitched[0])
    return _canonical_start(stitched)


def repair_geometry(geometry):
    """对所有环应用 stitch_ring；返回修复后的 geometry。"""
    if geometry["type"] == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": [stitch_ring(ring) for ring in geometry["coordinates"]],
        }
    if geometry["type"] == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [stitch_ring(ring) for ring in part] for part in geometry["coordinates"]
            ],
        }
    return geometry
