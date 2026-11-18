# 岸线数据（QA 用）

`ne_50m_land.geojson` 由 **Natural Earth** 的 `ne_50m_land` 图层转存，用于
`pnpm check:land` 判断航线是否穿越陆地。

- 来源：<https://github.com/nvkelso/natural-earth-vector>
- 许可：public domain（Natural Earth 官方声明，无归属要求）
- 坐标：WGS84 经纬度，1:50m 精度，文件约 1.6MB
- 不要在运行时从网络抓取：离线可重复，才能进 CI。

## 判据与阈值

`scripts/check-route-land.ts` 沿每个航段每 2km 采一点，统计**连续落在陆地上的里程**，
超过 `--threshold`（默认 25km）才报错。

为什么不取更小的阈值：50m 岸线在三角洲、海峡、珊瑚礁、沙洲处只有几公里精度，
取 2–5km 会把正常的贴岸航行整片报错，反而淹没有效信号；25km 仍能拦住任何真正的
跨陆直线（跨半岛、跨大陆通常是数百公里）。

## 例外登记

确属内河航段（长江口、穆西河）或岸线概化无法表达的窄水道，写到该专题目录下的
`land-legs.allow.json`，逐条写 `reason`：

```json
[
  {
    "entityId": "voyage-1",
    "from": [121.1, 31.45],
    "to": [121.45, 31.5],
    "reason": "刘家港出长江口为内河航段……"
  }
]
```

`from` / `to` 与航段端点按 0.02° 容差匹配。禁止调大阈值来绕过问题。
