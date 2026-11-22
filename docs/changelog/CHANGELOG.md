# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 结构与 [语义化版本](https://semver.org/lang/zh-CN/)。
版本号与里程碑 tag 对应：`v0.1.0-m1`、`v0.2.0-m2` ……

## [v1.0.233] - 2026-11-22

### Added
- **抗日战争 · 河南遂平/正阳补录（M251）**：新增 2 个事件、2 段路线。
  - 遂平 1944-05-09（第二次沦陷，第一次为 1941-01-28）、正阳 1944-05-13。
  - 路线（2 段，#387—#388）：西平—遂平、信阳—确山—正阳。
  - 专题：1023 → **1025** 事件、562 → **564** 段路线；日军层：775 → **777** 事件、
    383 → **385** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-suiping-zhengyang.md`、
  计划 `docs/plans/2026-11-22-M251-河南遂平正阳补录-plan.md`。

### Changed
- `regions.json` / `region-index.json`：地区 859 → **861**（新增遂平县、正阳县），
  1025 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 汝南（无确切日期）、确山 1944-05-04（单一来源）、嵩县、偃师、太康、陈留、武陟继续待考。

---

## [v1.0.232] - 2026-11-22

### Added
- **抗日战争 · 河南襄城/宝丰补录（M250）**：新增 2 个事件、2 段路线。
  - 襄城 1944-05-04（05-03 已破城并发生六王冢屠杀）、宝丰 1944-05-06。
  - 路线（2 段，#385—#386）：许昌—颍桥—襄城、郏县—宝丰。
  - 专题：1021 → **1023** 事件、560 → **562** 段路线；日军层：773 → **775** 事件、
    381 → **383** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-xiangcheng-baofeng.md`、
  计划 `docs/plans/2026-11-22-M250-河南襄城宝丰补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：沿用襄城、宝丰既有映射。
- `regions.json` / `region-index.json`：地区 857 → **859**，1023 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 遂平、正阳、汝南（月份级）、嵩县（县城陷落日未定）、偃师、太康、陈留、武陟继续待考。

---

## [v1.0.231] - 2026-11-22

### Added
- **抗日战争 · 河南灵宝/阌乡补录（M249）**：新增 2 个事件、1 段路线。
  - 灵宝 1944-06-10（06-15 收复）、阌乡 1944-06-11（06-13 收复）。
  - 路线（1 段，#384）：渑池—陕县—灵宝—阌乡。
  - 专题：1019 → **1021** 事件、559 → **560** 段路线；日军层：771 → **773** 事件、
    380 → **381** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-lingbao-wenxiang.md`、
  计划 `docs/plans/2026-11-22-M249-河南灵宝阌乡补录-plan.md`。

### Changed
- `regions.json` / `region-index.json`：地区 855 → **857**（新增灵宝县、阌乡县），
  1021 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点，初稿自陕县起报 17.5km
  线头，已前推至渑池）、`pnpm typecheck`、`pnpm lint`、`pnpm test`、
  `pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 襄城、遂平、正阳、汝南、宝丰、嵩县、偃师、太康、陈留、武陟继续待考；
  陕县 05-18 仅一条来源，只作路线节点。

---

## [v1.0.230] - 2026-11-22

### Added
- **抗日战争 · 热河滦平/兴隆补录（M248）**：新增 2 个事件、2 段路线。
  - 滦平 1933-03-05（上午 11 时，同日青石梁阻击战打响）、
    兴隆 1933-04-21（04-27 克复）。
  - 路线（2 段，#382—#383）：承德—滦平（趋古北口）、承德—兴隆。
  - 专题：1017 → **1019** 事件、557 → **559** 段路线；日军层：769 → **771** 事件、
    378 → **380** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-rehe-luanping-xinglong.md`、
  计划 `docs/plans/2026-11-22-M248-热河滦平兴隆补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加滦平、兴隆映射。
- `regions.json` / `region-index.json`：地区 853 → **855**，1019 个事件全部有省 + 县归属。
- 兴隆 1933 年属河北省，伪满 07-01 划归热河省承德县；事件正文已注明，避免归属错乱。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 青龙（三说冲突）、丰宁（03-27 与 04-02 冲突）继续待考。

---

## [v1.0.229] - 2026-11-22

### Added
- **抗日战争 · 湖南醴陵/安仁/茶陵补录（M247）**：新增 3 个事件、3 段路线。
  - 醴陵 1944-06-18（07-08 克复、07-10 再陷）、安仁 1944-06-27、
    茶陵 1944-07-14（城郊争夺 20 天）。
  - 路线（3 段，#379—#381）：浏阳—醴陵、攸县—安仁、攸县—茶陵。
  - 专题：1014 → **1017** 事件、554 → **557** 段路线；日军层：766 → **769** 事件、
    375 → **378** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hunan-liling-anren-chaling.md`、
  计划 `docs/plans/2026-11-22-M247-湖南醴陵安仁茶陵补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加醴陵、安仁、茶陵映射。
- `regions.json` / `region-index.json`：地区 850 → **853**，1017 个事件全部有省 + 县归属。
- M224 湖南待考项（醴陵、茶陵、安仁）全部清空。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。

---

## [v1.0.228] - 2026-11-22

### Added
- **抗日战争 · 山西永济/平陆补录（M246）**：新增 2 个事件、2 段路线。
  - 永济 1938-08-17（永济保卫战；1938-03-06 首次占领作背景）、
    平陆 1939-06-08（六六战役，06-11 恢复）。
  - 路线（2 段，#377—#378）：运城—永济、运城—张店—平陆。
  - 专题：1012 → **1014** 事件、552 → **554** 段路线；日军层：764 → **766** 事件、
    373 → **375** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-shanxi-yongji-pinglu.md`、
  计划 `docs/plans/2026-11-22-M246-山西永济平陆补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加永济（含蒲州）映射。
- `regions.json` / `region-index.json`：地区 849 → **850**，1014 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 芮城、风陵渡（渡口而非县城）、盂县 12-16 首次侵入继续待考。

---

## [v1.0.227] - 2026-11-22

### Added
- **抗日战争 · 河南密县/郾城补录（M245）**：新增 2 个事件、2 段路线。
  - 密县 1944-04-24（异说 04-23）、郾城 1944-05-05（与漯河同日）。
  - 路线（2 段，#375—#376）：新郑—观音堂—密县、临颍—郾城。
  - 专题：1010 → **1012** 事件、550 → **552** 段路线；日军层：762 → **764** 事件、
    371 → **373** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-mixin-yancheng.md`、
  计划 `docs/plans/2026-11-22-M245-河南密县郾城补录-plan.md`。

### Changed
- `regions.json` / `region-index.json`：地区 848 → **849**（新增密县），
  1012 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 襄城（05-03 与 05-04 冲突）、遂平/正阳/汝南（月份级）、宝丰/嵩县（得失反复）、
  偃师/灵宝/阌乡/太康/陈留/武陟继续待考。

---

## [v1.0.226] - 2026-11-22

### Added
- **抗日战争 · 广西柳城/象县/迁江补录（M244）**：新增 3 个事件、3 段路线。
  - 柳城 1944-11-09（11-07 日军入境）、象县 1944-11-05（异说 11-06）、
    迁江 1944-11-11（异说 11-12）。
  - 路线（3 段，#372—#374）：柳城—宜山（宜山以北受阻）、象县—穿山—柳州、迁江—忻城。
  - 专题：1007 → **1010** 事件、547 → **550** 段路线；日军层：759 → **762** 事件、
    368 → **371** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-guangxi-liucheng-xiangxian-qianjiang.md`、
  计划 `docs/plans/2026-11-22-M244-广西柳城象县迁江补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加柳城、象县（含象州）、迁江映射。
- `regions.json` / `region-index.json`：地区 845 → **848**，1010 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 融县长安镇（11-17 与 11-19 冲突）、罗城/天河、思恩/宜北（月份级）、
  来宾县城（11-08 与 11-09 冲突）继续待考。

---

## [v1.0.225] - 2026-11-22

### Added
- **抗日战争 · 湖南汉寿/临澧/宁乡/湘乡补录（M243）**：新增 4 个事件、5 段路线。
  - 汉寿 1943-11-22（异说 11-21，11-25 被第197师克复）、临澧 1943-11-18、
    宁乡 1944-07-29（异说 08-02）、湘乡 1944-06-21。
  - 路线（5 段，#367—#371）：安乡—汉寿、澧县—临澧、益阳—宁乡、宁乡—湘乡、
    湘潭—石潭—湘乡。
  - 专题：1003 → **1007** 事件、542 → **547** 段路线；日军层：755 → **759** 事件、
    363 → **368** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hunan-hanshou-linli-ningxiang-xiangxiang.md`、
  计划 `docs/plans/2026-11-22-M243-湖南汉寿临澧宁乡湘乡补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加汉寿、临澧、宁乡、湘乡映射。
- `regions.json` / `region-index.json`：地区 841 → **845**，1007 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 醴陵、茶陵、安仁因多次易手、日期异说未清，继续待考。

---

## [v1.0.224] - 2026-11-22

### Added
- **抗日战争 · 湖北京山/钟祥补录（M242）**：新增 2 个事件、2 段路线。
  - 京山 1939-01-16（异说 01-18）、钟祥 1939-03-05（异说 03-06）。
  - 路线（2 段，#365—#366）：应城—皂市—宋河—京山、京山—钟祥。
  - 专题：1001 → **1003** 事件、540 → **542** 段路线；日军层：753 → **755** 事件、
    361 → **363** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hubei-jingshan.md`、计划
  `docs/plans/2026-11-22-M242-湖北京山钟祥补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加京山、宋河（并入京山县）、钟祥映射。
- `regions.json` / `region-index.json`：地区 839 → **841**，1003 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 天门（01-27 与 02-20 冲突）、远安（06-09 与 06-10 冲突）继续待考；
  沙市并入已有 `jingzhou-fall-1940-06`。

---

## [v1.0.223] - 2026-11-22

### Added
- **抗日战争 · 湖北鄂南嘉鱼/蒲圻/通山/通城补录（M241）**：新增 4 个事件、4 段路线。
  - 嘉鱼 1938-11-03（异说 11-04）、蒲圻 1938-11-04（赤壁市史志办记 11-05 入城）、
    通山 1938-11-04（10-31 发起进攻）、通城 1938-11-08。
  - 路线（4 段，#361—#364）：咸宁—蒲圻（沿粤汉线）、咸宁—嘉鱼、
    阳新—慈口—大畈—通山、崇阳—大沙坪—通城。
  - 专题：997 → **1001** 事件、536 → **540** 段路线；日军层：749 → **753** 事件、
    357 → **361** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hubei-enan.md`、计划
  `docs/plans/2026-11-22-M241-湖北鄂南嘉鱼蒲圻通山通城补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加嘉鱼、蒲圻（含赤壁、羊楼洞）、通山、通城、
  大沙坪映射。
- `regions.json` / `region-index.json`：地区 835 → **839**，1001 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 县名用 1938 年旧名，蒲圻不写赤壁；钟祥、京山、沙市等仍待考。

---

## [v1.0.222] - 2026-11-22

### Added
- **抗日战争 · 山西盂县/忻县/徐沟补录（M240）**：新增 3 个事件、3 段路线。
  - 盂县 1938-01-09（第二次占领，12-26 曾短暂侵入后退回）、
    忻县 1937-11-03（异说 11-04）、徐沟 1937-11-22（异说 11-08）。
  - 路线（3 段，#358—#360）：阳泉—盂县、忻口—忻县、榆次—徐沟。
  - 专题：994 → **997** 事件、533 → **536** 段路线；日军层：746 → **749** 事件、
    354 → **357** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-shanxi-deferred2.md`、计划
  `docs/plans/2026-11-22-M240-山西盂县忻县徐沟补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加盂县、忻县、徐沟县映射。
- `regions.json` / `region-index.json`：地区 833 → **835**，997 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 盂县 12-16 首次侵入因 12-16/12-26 冲突未单独成事件；武陟仍待考。

---

## [v1.0.221] - 2026-11-22

### Added
- **抗日战争 · 河北房山/良乡/琉璃河与河南温县补录（M239）**：新增 4 个事件、3 段路线。
  - 房山 1937-09-16、良乡 1937-09-16、琉璃河 1937-09-17、温县 1938-03-05。
  - 路线（3 段，#355—#357）：良乡—房山、良乡—琉璃河、孟县—温县。
  - 专题：990 → **994** 事件、530 → **533** 段路线；日军层：742 → **746** 事件、
    351 → **354** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hebei-henan-final.md`、计划
  `docs/plans/2026-11-22-M239-河北房山良乡琉璃河与河南温县补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加房山、良乡、琉璃河、温县映射。
- `regions.json` / `region-index.json`：地区 829 → **833**，994 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 武陟仍只给 2-18—3-5 区间，继续待考；房山、良乡按 1937 年旧县名归属。

---

## [v1.0.220] - 2026-11-22

### Added
- **抗日战争 · 河南延津/原武/阳武补录（M238 / M221b 第二批）**：新增 3 个事件、2 段路线。
  - 延津 1938-02-16、原武 1938-02-16、阳武 1938-02-16。
  - 路线（2 段，#353—#354）：新乡—延津、延津—阳武—原武。
  - 专题：987 → **990** 事件、528 → **530** 段路线；日军层：739 → **742** 事件、
    349 → **351** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-deferred2.md`、计划
  `docs/plans/2026-11-22-M238-河南延津原武阳武补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加延津、原武、阳武映射。
- `regions.json` / `region-index.json`：地区 826 → **829**，990 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 武陟、温县仍只给 2-20—3-5 区间，继续待考。

---

## [v1.0.219] - 2026-11-22

### Added
- **抗日战争 · 河南待考补录（M237 / M221b 第一批）**：新增 5 个事件、1 段路线。
  - 修武 1938-02-18（异说 02-19）、博爱 1938-02-20、沁阳 1938-02-22、
    孟县 1938-02-22、辉县 1938-02-17（异说 02-16）。
  - 路线：#352 新乡—辉县；修武、博爱、沁阳、孟县由已有 #237 覆盖，不重复。
  - 专题：982 → **987** 事件、527 → **528** 段路线；日军层：734 → **739** 事件、
    348 → **349** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan-deferred.md`、计划
  `docs/plans/2026-11-22-M237-河南待考补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加修武、博爱、沁阳、孟县、辉县映射。
- `regions.json` / `region-index.json`：地区 822 → **826**，987 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 延津、原武、阳武 2-16 仅一条确切来源；武陟、温县只给区间，继续待考。

---

## [v1.0.218] - 2026-11-22

### Added
- **抗日战争 · 山西待考补录（M236 / M220b 第一批）**：新增 10 个事件、6 段路线。
  - 雁北（4）：浑源 1937-09-16、山阴 1937-09-18、应县 1937-09-20、右玉 1937-09-20。
  - 晋东（2）：昔阳 1937-11-02、榆次 1937-11-04（异说 11-06）。
  - 晋中（2）：太谷 1937-11-07、祁县 1937-11-09（异说 11-10）。
  - 晋西（2）：清源 1937-11-08、交城 1937-11-13。
  - 路线（6 段，#346—#351）：大同—浑源、大同—应县、大同—山阴—右玉、
    井陉—昔阳、榆次—太谷—祁县—平遥、太原—清源—交城。
  - 专题：972 → **982** 事件、521 → **527** 段路线；日军层：724 → **734** 事件、
    342 → **348** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-shanxi-deferred.md`、计划
  `docs/plans/2026-11-22-M236-山西待考补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加浑源、应县、山阴、右玉、昔阳、太谷、祁县、
  清源、交城映射（榆次已有）。
- `regions.json` / `region-index.json`：地区 813 → **822**，982 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 盂县 12-16、忻县 11-04、徐沟 11-22 仍缺第二来源或日期冲突，继续待考；
  灵丘、平遥、太原已有事件不重复。

---

## [v1.0.217] - 2026-11-22

### Changed
- **抗日战争 · 来源字段规范化与待考总表（M235）**：
  - M232 审计列出 211 条来源缺 `author`。本批按“标题内含作者拆分 / 纯书名补通行编者 /
    官方文件补颁发方”规范化 208 条，仍缺作者仅 3 条
    （《马占山与江桥抗战》1 条、《豫中会战经过》2 条）。
  - 不改任何事件日期、地点、主体与正文；补出的作者来自标题自带信息或通行版本，
    未逐页核对版权页，后续页码级核对时校正。
  - 新增 `docs/research/units/anti-japanese-war-source-audit.md`，把 M213—M234
    遗留的河北、山西、河南、湖北、湖南、广西、云南、川渝、辽宁、吉林/黑龙江、热河
    待考县城集中成表，逐条写明原因。
  - 事件 972、路线 521、地区 813 均不变。
- `docs/research/units/anti-japanese-war-audit-2026-11-22.md` 第 3.2 节同步更新为
  “211 → 3 条，M235 已处理”。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 每事件来源数仍全部 ≥ 2。

---

## [v1.0.216] - 2026-11-22

### Added
- **抗日战争 · 河北待考补录（M234 / M219b 第一批）**：新增 5 个事件、4 段路线。
  - 永清 1937-09-15、固安 1937-09-15（城陷另有 09-17 说）、涿州 1937-09-18、
    正定 1937-10-08、井陉煤矿 1937-10-11。
  - 路线（4 段，#342—#345）：北平—良乡—涿州、永清—固安—涿州、
    正定—石家庄、石家庄—井陉。
  - 专题：967 → **972** 事件、517 → **521** 段路线；日军层：719 → **724** 事件、
    338 → **342** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hebei-deferred.md`、计划
  `docs/plans/2026-11-22-M234-河北待考补录-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加永清→永清县、固安→固安县、涿州→涿县、
  正定→正定县、井陉→井陉县。
- `regions.json` / `region-index.json`：地区 807 → **813**，972 个事件全部有省 + 县归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 唐山、秦皇岛 1935 年后已在日军控制下，不按 1937 年新占领处理；
  良乡、琉璃河、房山仍缺两条独立来源或确切日期，继续待考。

---

## [v1.0.215] - 2026-11-22

### Changed
- **抗日战争 · 地区索引与文档收口（M233）**：
  - 967 / 967 个事件都有省 + 县/市归属，329 个另有地点层；
    0 个只挂省、0 个缺省、0 个悬空父级。
  - 地区 807 个：39 个一级（省/院辖市/香港/海外）、516 个县市、252 个地点。
  - 517 段路线全部有 `regionIds` 与 `endpointRegionIds`，0 个空归属。
  - README 增加“历史省籍口径”：按 1931—1937 年省籍归属，不按今行政区改写；
    时间覆盖改为 1931-09-18 → 1945-12-27。
  - 新增地区审计笔记 `docs/research/units/anti-japanese-war-region-audit.md`。
  - 总体计划 M213—M233 全部收口。
- `scripts/build-region-data.py` 无需再改；`regions.json` / `region-index.json` 重新生成并校验。
- 事件 967、路线 517、日军事件 719、日军路线 338、地区 807 均不变。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 遗留：211 条来源缺 `author`、25 条示意边界差异、7 条月级日期，已在审计表标注。

---

## [v1.0.214] - 2026-11-22

### Fixed
- **抗日战争 · 全量复核（M232）**：对 967 个事件、338 段日军路线做全量结构审计。
  - `manifest.timeRange.end` 由 `1945-10-25` 修正为 `1945-12-27`，
    覆盖山东受降 `shandong-surrender-1945-12`。
  - 删除 3 段重复路线：#51 龙陵—腾冲（与 #306 反向同线）、
    #193 宁波—镇海（与 #75 反向同线）、#195 瑞安—温州（与 #76 完全同线）。
    日军路线 341 → **338**，专题路线 520 → **517**。
  - 台湾光复、马鞍山保卫战、镇海沦陷与收复、东山保卫战、武冈保卫战 5 条
    补挂中国一方实体（`kmt-forces` / `eighth-route-army`），并标 `routeEvent:false`。
  - 清理 5 条同一事件内重复标题的第三来源；桂柳 4 条事件的同名来源加注作者区分。
- 审计表 `docs/research/units/anti-japanese-war-audit-2026-11-22.md`、计划
  `docs/plans/2026-11-22-M232-全量日期与主体复核-plan.md`。

### Changed
- **待考标注，不硬改**：7 条月级日期；211 条来源缺 `author`；25 条历史省籍与
  1931 年手绘边界不一致；31 处路线 order 年份回跳；121 处端点附近异时事件。
- 事件总数 967 不变，日军事件 719 不变，地区 807 不变，`routeEvent:false` 203 条。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。

---

## [v1.0.213] - 2026-11-22

### Added
- **抗日战争 · 战略层（M231）**：新增 20 个事件，全部 `routeEvent:false`，不绘路线。
  - 细菌战 / 化学战（3）：鲁西细菌战 1943-08-27、农安细菌战 1940-06-04、
    宜昌毒气战 1941-10-06。
  - 慰安所 / 劳工（3）：上海杨家宅慰安所 1938-01-13、南京慰安所 1937-12-22、
    花冈惨案 1945-06-30。
  - 战略轰炸（9）：武汉 1938-08-11、广州 1938-05-28、西安 1937-11-13、
    兰州 1939-02-23、昆明 1938-09-28、延安 1938-11-20、永安 1943-11-04、
    桂林 1937-10-15 与 1938-12-02。
  - 封锁（2）：日本迫使法国封闭滇越铁路 1940-06-20、
    日本胁迫英国封闭滇缅公路 1940-07-18。
  - 受降（3）：上海 1945-09-11、河内 1945-09-28、香港 1945-09-16。
  - 专题：947 → **967** 事件、520 段路线不变；日军层：699 → **719** 事件、341 段路线不变。
- 研究笔记 `docs/research/units/anti-japanese-war-strategic.md`、计划
  `docs/plans/2026-11-22-M231-战略层细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加/修正农安→农安县、兰州→皋兰县、
  永安→永安县（原误挂长沙县）；花冈、河内归海外，香港归香港（英属）。
- `regions.json` / `region-index.json`：地区由 800 → **807** 个，967 个事件全部有归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 鲁西细菌战死亡数、花冈惨案死亡数、兰州轰炸机数、昆明/永安/桂林伤亡均存在异说，
  正文写通行说法并注明。
- 滇越、滇缅封锁直接执行者为英法殖民当局，标题写“日本迫使/胁迫”，不把英法写成侵略主体；
  受降方与投降方分列。

---

## [v1.0.212] - 2026-11-22

### Added
- **抗日战争 · 热河日军战线（M230）**：新增 11 个事件、6 段路线。
  - 东路（5）：北票 2-23、朝阳 2-25、叶柏寿 3-1、凌源 3-2、平泉 3-3。
  - 北路（5）：开鲁 2-23、下洼 2-27、赤峰 3-2、林西 3-6、围场 3-8。
  - 南路（1）：凌南（今建昌）2-28。
  - 路线（6 段，#336—#341）：锦州—北票—朝阳、开鲁—下洼—赤峰、凌南—凌源、
    朝阳—叶柏寿—凌源—平泉—承德、赤峰—围场、赤峰—林西。
  - 专题：936 → **947** 事件、514 → **520** 段路线；日军层：688 → **699** 事件、
    335 → **341** 段路线；热河日军事件 2 → **13**。
- 研究笔记 `docs/research/units/anti-japanese-war-rehe.md`、计划
  `docs/plans/2026-11-22-M230-热河日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加热河 1933 年县名映射（北票→朝阳县、开鲁→开鲁县、
  凌南/建昌→凌南县、叶柏寿/建平→建平县、赤峰→赤峰县、凌源→凌源县、平泉→平泉县、
  林西→林西县、围场→围场县；下洼因县属待考暂挂省下）。
- `regions.json` / `region-index.json`：地区由 789 → **800** 个，947 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 开鲁、凌南、林西、围场四条例存在日期异说，正文写通行说法并注明“另有异说”；
  滦平、青龙、兴隆、丰宁仅见一条来源，本批不硬录。
- 热河省按 1937 年行政区划归属，赤峰、林西、围场、开鲁等今属内蒙古、河北、辽宁，
  一律写“热河”，不按今行政区改写。

---

## [v1.0.211] - 2026-11-22

### Added
- **抗日战争 · 吉林 / 黑龙江日军战线（M229）**：新增 24 个事件、13 段路线。
  - 吉林 1931—1932（12）：四平街、双城堡、海林、延吉、龙井、牡丹江、依兰、佳木斯、
    海伦、辑安、临江、通化。
  - 吉林 1933（6）：绥芬河、绥阳、东宁、梨树镇/鸡西街、密山、宝清。
  - 黑龙江 1931—1932（6）：洮南、扎兰屯、牙克石、博克图、海拉尔、满洲里。
  - 路线（13 段，#323—#335）：四平—长春、延吉—龙井、双城堡—哈尔滨、
    哈尔滨—海林—牡丹江、哈尔滨—依兰、依兰—佳木斯、哈尔滨—绥化—海伦、
    牡丹江—磨刀石—绥芬河、磨刀石—东宁、牡丹江—林口—梨树镇—密山、
    佳木斯—宝清、四平—洮南、齐齐哈尔—扎兰屯—牙克石—博克图—海拉尔—满洲里。
  - 专题：912 → **936** 事件、501 → **514** 段路线；日军层：664 → **688** 事件、
    322 → **335** 段路线；吉林日军事件 5 → **20**，黑龙江 2 → **8**；
    辽宁（辑安、临江、通化）24 → **27**。
- 研究笔记 `docs/research/units/anti-japanese-war-jilin-heilongjiang.md`、计划
  `docs/plans/2026-11-22-M229-吉林黑龙江日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加吉林、黑龙江 1931—1933 年县名映射
  （四平→梨树县、双城→双城县、海林/牡丹江→宁安县、延吉/龙井→延吉县、
  依兰→依兰县、佳木斯→桦川县、海伦→海伦县、通化→通化县、辑安→辑安县、
  临江→临江县、绥芬河/绥阳/东宁→东宁县、密山→密山县、宝清→宝清县、
  洮南→洮南县、海拉尔→呼伦县、满洲里→胪滨县）。
- `regions.json` / `region-index.json`：地区由 760 → **789** 个，936 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 辑安、临江、通化因日军自朝鲜越江或三路合击、路线无史料支撑，标 `routeEvent:false`，不画直线；
  海拉尔、满洲里按 1932 年黑龙江省辖境归黑龙江省；大连、旅顺、金州为关东州租借地，不属 1931 年新占领。
- 蛟河、舒兰、敦化、桦甸、磐石、宁安、富锦、穆棱、绥化因单一来源、仅见月份或日期异说，
  本批不硬录，详见研究笔记第 4 节。

---

## [v1.0.210] - 2026-11-22

### Added
- **抗日战争 · 辽宁日军战线（M228）**：辽宁日军事件由 4 条增至 24 条。
  - 1931-09-19 南满、安奉沿线（12）：营口、安东、抚顺、辽阳、鞍山、铁岭、本溪、
    海城、盖平、复县、凤城、开原。
  - 辽西 1931—1932（7）：新民、兴城、绥中、葫芦岛、义县、北镇、锦西。
  - 辽东 1932（1）：岫岩。
  - 路线（10 段，#313—#322）：沈阳—营口—海城—盖平—复县、沈阳—辽阳—鞍山—海城、
    沈阳—铁岭—开原、沈阳—本溪—凤城—安东、沈阳—抚顺、沈阳—新民、
    锦州—兴城—绥中—葫芦岛、锦州—义县—北镇、锦州—锦西、海城—岫岩。
  - 专题：892 → **912** 事件、491 → **501** 段路线；日军层：644 → **664** 事件、312 → **322** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-liaoning.md`、计划
  `docs/plans/2026-11-22-M228-辽宁日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加辽宁 1931 年县名映射（营口县、安东县、辽阳县、
  鞍山并入辽阳县、铁岭县、本溪县、海城县、盖平县、复县、凤城县、开原县、新民县、
  锦西县、兴城县、绥中县、葫芦岛并入锦西县、义县、北镇县、岫岩县）。
- `regions.json` / `region-index.json`：地区由 741 → **760** 个，912 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 沈阳 1931-09-18、锦州 1932-01-03、平顶山惨案 1932-09-16 等已有事件不重复；
  四平、公主岭、长春、吉林留 M229；朝阳、北票、凌源、建平留 M230；
  大连、旅顺、金州为日本关东州租借地，不属 1931 年新占领，本批不列。

---

## [v1.0.209] - 2026-11-22

### Added
- **抗日战争 · 贵州、四川、重庆日军战线（M227）**：川渝黔日军事件由 3 条增至 20 条。
  - 重庆大轰炸（5）：五三、五四、八一九、八二〇、六五隧道惨案。
  - 成都与四川其他城市（6）：成都七二四、成都七二七、万县二四、乐山八一九、
    自贡八一二、泸县九一一。
  - 贵州（6）：贵阳二四、黎明关战斗、荔波、三都、丹寨、都匀牛场。
  - 路线（4 段，#309—#312）：南丹—麻尾—独山、黎明关—荔波、三都—丹寨—都匀、
    独山—都匀（日军撤退方向）。
  - 专题：875 → **892** 事件、487 → **491** 段路线；日军层：627 → **644** 事件、308 → **312** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-guizhou-sichuan.md`、计划
  `docs/plans/2026-11-22-M227-贵州四川重庆日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加四川、贵州 1937 年县名映射（万县、乐山县、自贡市、
  宜宾县、泸县、荔波县、三都县、丹寨县、都匀县等），黎明关并入荔波县、八寨并入丹寨县。
- `regions.json` / `region-index.json`：地区由 732 → **741** 个，892 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 重庆 1938-02-18、成都 1939-06-11、独山 1944-12-02 等已有事件不重复；
  重庆 1940-08-09/08-18、奉节、巫山、涪陵、合江、隆昌、南川、阆中、松潘、宜宾等
  空袭未逐条硬录，留待后续空袭专题。

---

## [v1.0.208] - 2026-11-21

### Added
- **抗日战争 · 云南日军战线（M226）**：云南日军事件由 8 条增至 20 条。
  - 1942 年滇西入侵（8）：遮放、芒市、腾冲、瑞丽、陇川、盈江、梁河、保山大轰炸。
  - 1943 年边境窜扰（2）：孟定、沧源。
  - 1944 年日军守备（2）：平戛、象达。
  - 路线（9 段，#300—#308）：畹町—遮放—芒市—龙陵—惠通桥、龙陵—腾冲、芒市—瑞丽、
    芒市—陇川—盈江—梁河、松山—惠通桥、松山—龙陵、腾冲—龙陵、龙陵—平戛、龙陵—象达。
  - 专题：863 → **875** 事件、478 → **487** 段路线；日军层：615 → **627** 事件、299 → **308** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-yunnan.md`、计划
  `docs/plans/2026-11-21-M226-云南日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加云南 1937 年设治局/县名映射（潞西设治局、瑞丽设治局、
  陇川设治局、盈江设治局、梁河设治局、镇康县、沧源设治局、龙陵县等），
  遮放/芒市并入潞西设治局、平戛/象达/惠通桥并入龙陵县。
- `regions.json` / `region-index.json`：地区由 715 → **732** 个，875 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 畹町 1942、龙陵 1942、惠通桥 1942、松山/龙陵/腾冲 1944 等已有事件不重复；
  南伞 1942-08 仅见月份，未硬录；芒市/遮放/畹町 1944—1945 收复为中国军队行动，不挂日军层。

---

## [v1.0.207] - 2026-11-21

### Added
- **抗日战争 · 广西日军战线（M225）**：广西日军事件由 8 条增至 33 条。
  - 桂南会战（10）：钦州湾登陆、防城、钦县、小董、高峰隘、昆仑关、龙州、
    宾阳（1940）、武鸣（1940）、上林（1940）。
  - 桂柳会战（15）：黄沙河、全州、梧州、兴安、平南、桂平、灵川、宜山、忻城、
    河池、南丹、凭祥、龙州（1944）、宾阳（1944）、武鸣（1944）。
  - 路线（11 段，#289—#299）：钦州湾—防城—钦县—小董—南宁、南宁—高峰隘—昆仑关、
    南宁—龙州、南宁—宾阳—武鸣（1940）、宾阳—上林、黄沙河—全州—兴安—灵川—桂林、
    梧州—平南—桂平、桂林—柳州—宜山—河池—南丹、柳州—忻城—宜山、
    南宁—宾阳—武鸣（1944）、南宁—凭祥—龙州（1944）。
  - 专题：838 → **863** 事件、467 → **478** 段路线；日军层：590 → **615** 事件、288 → **299** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-guangxi.md`、计划
  `docs/plans/2026-11-21-M225-广西日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加广西 1937 年县名映射（防城、钦县、小董、高峰隘、
  昆仑关、龙州、武鸣、上林、黄沙河、兴安、灵川、梧州、平南、桂平、宜山、忻城、
  河池、南丹、凭祥），并按 1937 年框架将钦州、防城、钦县、小董归入广东省。
- `regions.json` / `region-index.json`：地区由 697 → **715** 个，863 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 南宁 1939/1944、桂林 1944、柳州 1944、昆仑关 1939-12-18 反攻、宾阳 1940-01-28 进攻等
  已有事件不重复；迁江、柳城、融县、罗城等追击线小县城因多据单一来源，本批不硬录。

---

## [v1.0.206] - 2026-11-21

### Added
- **抗日战争 · 湖南日军战线（M224）**：湖南日军事件由 15 条增至 50 条。
  - 第一次长沙会战（5）：新墙河、营田、汨罗江、平江、永安。
  - 第二次长沙会战（5）：大云山、新墙河、汨罗江、长沙、株洲。
  - 第三次长沙会战（3）：新墙河、汨罗江、长沙（1942-01-01 攻城未克）。
  - 常德会战（7）：南县、安乡、石门、澧县、慈利、桃源、常德。
  - 长衡会战（10）：新墙河、平江、沅江、湘阴、益阳、浏阳、株洲、湘潭、攸县、耒阳。
  - 湘西会战（4）：新宁、洞口、武冈、武阳。
  - 受降（1）：长沙受降（1945-09-15，`routeEvent:false`）。
  - 路线（16 段，#273—#288）：新墙河—汨罗江、营田—永安、平江—永安、
    大云山—新墙河—汨罗江—长沙、长沙—株洲、新墙河—汨罗江—长沙（1941 年 12 月）、
    南县—安乡—常德、石门—澧县—常德、慈利—桃源—常德、
    新墙河—汨罗江—湘阴—长沙（1944）、平江—浏阳—株洲、长沙—湘潭—衡阳、
    株洲—攸县—耒阳、新宁—武冈—洞口、洞口—武阳、沅江—益阳。
  - 专题：803 → **838** 事件、451 → **467** 段路线；日军层：555 → **590** 事件、272 → **288** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hunan.md`、计划
  `docs/plans/2026-11-21-M224-湖南日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加湖南 1937 年县名映射（营田/汨罗并入湘阴县、
  永安并入长沙县、大云山并入岳阳县、株洲并入湘潭县、安乡、石门、澧县、慈利、桃源、
  沅江、益阳、湘阴、浏阳、攸县、耒阳、新宁、洞口/武冈并入武冈县、武阳/绥宁并入绥宁县）。
- `regions.json` / `region-index.json`：地区由 675 → **697** 个，838 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 汉寿、临澧、宁乡、湘乡、醴陵、茶陵、安仁等因屡次易手、日期异说多，本批只取主线节点，
  其余待后续批次；长沙 1944、衡阳 1944、常德 1943 等已有事件不重复。

---

## [v1.0.205] - 2026-11-21

### Added
- **抗日战争 · 湖北日军战线（M223）**：湖北日军事件由 15 条增至 51 条。
  - 武汉会战（21）：小池口、黄梅、广济、武穴、富池口、田家镇、半壁山、蕲春、浠水、
    阳新、大冶、鄂城、黄石港、黄冈、团风、黄陂、麻城、黄安、应城、咸宁、崇阳。
  - 随枣、枣宜（8）：随县、枣阳、襄阳、南漳、宜城、荆门、荆州、当阳。
  - 鄂西会战（4）：公安、松滋、宜都、长阳。
  - 豫西鄂北（2）：樊城、谷城。
  - 受降（1）：武汉受降（1945-09-18，`routeEvent:false`）。
  - 路线（14 段，#259—#272）：小池口—黄梅—广济—武穴、武穴—田家镇、富池口—半壁山、
    田家镇—蕲春—浠水—黄冈—团风—黄陂、半壁山—阳新—大冶—鄂城—黄石港、黄陂—武汉、
    麻城—黄安—应城、黄石港—咸宁—崇阳、随县—枣阳、襄阳—南漳—宜城、
    宜城—荆门—荆州—当阳、荆州—公安—松滋—宜都—长阳、荆门—宜城—襄阳—樊城、樊城—谷城。
  - 专题：767 → **803** 事件、437 → **451** 段路线；日军层：519 → **555** 事件、258 → **272** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hubei.md`、计划
  `docs/plans/2026-11-21-M223-湖北日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加湖北 1937 年县名映射（黄梅、广济、蕲春、浠水、大冶、
  鄂城、黄冈、黄陂、麻城、黄安、应城、咸宁、南漳、荆门、江陵、松滋、宜都、长阳、谷城等），
  小池口并入黄梅县、武穴/田家镇并入广济县、富池口/半壁山并入阳新县、黄石港并入大冶县、
  团风并入黄冈县、樊城并入襄阳县。
- `regions.json` / `region-index.json`：地区由 649 → **675** 个，803 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 嘉鱼、蒲圻、通山、通城、钟祥、京山、沙市、远安、渔洋关、都镇湾等因与本批主线重复或
  缺少两条独立来源，本批不硬录或在正文合并，列入研究笔记待考。

---

## [v1.0.204] - 2026-11-21

### Added
- **抗日战争 · 绥远、察哈尔日军战线（M222）**：绥远/察哈尔日军事件由 13 条增至 28 条。
  - 察哈尔（9）：察哈尔派遣兵团设司令部于多伦（08-17，`routeEvent:false`）、张北战斗、
    万全、独石口、怀来、延庆、赤城、宣化、柴沟堡。
  - 察南、绥东（6）：蔚县、丰镇、兴和、集宁、凉城、萨拉齐。
  - 路线（7 段，#252—#258）：沽源—张北—万全—张家口、沽源—独石口—赤城—宣化、
    张家口—宣化—怀来—延庆、集宁—凉城—归绥、集宁—武川—归绥、宣化—蔚县、兴和—凉城。
  - 细化已有 #89「大同—归绥—包头」：改为经丰镇—集宁—卓资—归绥—萨拉齐—包头，
    端点与日期不变，使 1937 年日军西进主线真正经过所记县城。
  - 专题：752 → **767** 事件、430 → **437** 段路线；日军层：504 → **519** 事件、251 → **258** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-suiyuan-chahar.md`、计划
  `docs/plans/2026-11-21-M222-绥远察哈尔日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加察哈尔、绥远 1937 年县名映射（万全、怀来、延庆、赤城、
  宣化、蔚县、丰镇、兴和、集宁、凉城、萨拉齐等），独石口并入赤城县、柴沟堡并入怀安县、
  平地泉并入集宁县、宁远并入凉城县。
- `regions.json` / `region-index.json`：地区由 636 → **649** 个，767 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 察北八县 1935-12、陶林/百灵庙 1937-09、怀安、阳原、龙关、托克托、固阳、清水河、
  和林格尔、武川等因缺少两条独立来源或日期冲突，本批不硬录，列入研究笔记待考。

---

## [v1.0.203] - 2026-11-21

### Fixed
- 更正河南长垣沦陷条目：原正文把 1938-02-23 日军首次占领长垣与 03-25 黉学惨案混为一谈。
  现明确 02-14 沦陷（另有 02-13、02-23/24 异说），03-25 日军攻入县城制造黉学惨案、
  屠杀民众 1700 余人；补《中华民族抗日编年（1938年2月）》《长垣浩劫和浚县大屠杀》
  两条来源。
- 汲县沦陷条目补《河南省志·军事志》02-14 异说，与 02-15 并列。

---

## [v1.0.202] - 2026-11-21

### Added
- **抗日战争 · 河南日军战线（M221）**：河南日军事件由 17 条增至 63 条，涉及河南的日军路线大幅补齐。
  - 豫北（13）：安阳（1937-11-05）、南乐、清丰、濮阳、汤阴、淇县、长垣、封丘、汲县、
    新乡、获嘉、焦作、济源。
  - 豫东（6）：永城、商丘、杞县、通许、尉氏、中牟（1938-06）。
  - 豫南 1938（5）：固始、潢川、光山、罗山、信阳。
  - 豫南 1941（3）：确山、驻马店、泌阳。
  - 豫中、豫西 1944（14）：中牟、新郑、长葛、临颍、漯河、西平、禹县、郏县、临汝、
    登封、鲁山、巩县、渑池、新安。
  - 豫西南 1945（3）：南阳、西峡口、淅川。
  - 受降（2）：郑州受降（09-22）、漯河受降（09-20），均 `routeEvent:false`。
  - 路线（18 段，#234—#251）：磁县—安阳、安阳—汤阴—淇县—汲县—新乡、
    大名—南乐—清丰—濮阳—长垣—封丘—新乡、新乡—获嘉—修武—焦作—博爱—沁阳—孟县—济源、
    蒙城—永城、砀山—商丘、商丘—杞县—通许—尉氏—中牟、六安—固始、
    固始—潢川—光山—罗山—信阳、信阳—确山—驻马店—泌阳、中牟—郑州、
    郑州—新郑—长葛—许昌、许昌—临颍—漯河—西平、许昌—禹县—郏县—临汝、
    临汝—登封—巩县、临汝—宝丰—鲁山、垣曲—渑池—新安、南阳—西峡—淅川。
  - 专题：706 → **752** 事件、412 → **430** 段路线；日军层：458 → **504** 事件、233 → **251** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-henan.md`、计划
  `docs/plans/2026-11-21-M221-河南日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加河南 1937 年县名映射（南乐、清丰、濮阳、汤阴、淇县、
  长垣、封丘、汲县、新乡、获嘉、修武、济源、永城、商丘、杞县、通许、尉氏、中牟、固始、
  潢川、光山、罗山、确山、泌阳、新郑、长葛、临颍、郾城、西平、禹县、郏县、临汝、登封、
  鲁山、巩县、渑池、新安、内乡、淅川等），焦作并入修武县、驻马店并入确山县、
  漯河并入郾城县、西峡口并入内乡县。
- `regions.json` / `region-index.json`：地区由 593 → **636** 个，752 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 辉县、修武、博爱、沁阳、孟县、太康、陈留、正阳、汝南、密县、偃师、郾城、遂平、襄城、
  宝丰、灵宝、阌乡、嵩县等因缺少两条独立来源或日期冲突，本批不硬录，列入研究笔记待考。

---

## [v1.0.201] - 2026-11-21

### Added
- **抗日战争 · 山西日军战线（M220）**：山西日军事件由 10 条增至 31 条，涉及山西的日军路线 8 → 20 段。
  - 雁北、晋北（11）：阳高、天镇、怀仁、广灵、左云、朔县（含朔县屠城）、繁峙、代县、
    宁武、崞县、原平。
  - 晋东、晋中（4）：平定、阳泉、寿阳、平遥。
  - 晋南（4）：长治、晋城、临汾、运城。
  - 中条山（1）：垣曲。
  - 受降（1）：太原受降（1945-09-13，`routeEvent:false`）。
  - 路线（12 段，#222—#233）：天镇—阳高—大同、大同—怀仁—左云、大同—朔县—宁武、
    广灵—灵丘、繁峙—代县—崞县—原平、娘子关—平定—阳泉—寿阳—榆次—太原、
    太原—平遥、邯郸—东阳关—黎城—潞城—长治、长治—高平—晋城、
    太原—介休—霍县—洪洞—临汾、临汾—侯马—闻喜—运城、垣曲—平陆。
  - 专题：685 → **706** 事件、400 → **412** 段路线；日军层：437 → **458** 事件、221 → **233** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-shanxi.md`、计划
  `docs/plans/2026-11-21-M220-山西日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加山西 1937 年县名映射（阳高、天镇、怀仁、广灵、左云、
  朔县、繁峙、宁武、崞县、平定、寿阳、平遥、长治、晋城、临汾、安邑、垣曲），
  原平镇并入崞县、阳泉镇并入平定县。
- `regions.json` / `region-index.json`：地区由 574 → **593** 个，706 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 长治方向按史实画“邯郸—东阳关—长治”，未画成“太原—长治”；浑源、应县、榆次、太谷、
  祁县、交城、永济、芮城、风陵渡、平陆等因缺少两条独立来源或日期冲突，本批不硬录，
  列入研究笔记待考。

---

## [v1.0.200] - 2026-11-21

### Added
- **抗日战争 · 河北日军战线（M219）**：河北相关日军事件（含北平、天津院辖市）由 17 条增至 27 条。
  - 平津（2）：廊坊、通州。
  - 津浦线（1）：沧州。
  - 平汉线（4）：定县、邢台、邯郸、磁县。
  - 冀南（1）：大名。
  - 受降（2）：天津受降（10/6）、北平受降（10/10）。
  - 路线（6 段，#216—#221）：北平—廊坊—天津、北平—通州、天津—沧州、
    北平—保定—定县—石家庄、石家庄—邢台—邯郸—磁县、邯郸—大名。
  - 专题：675 → **685** 事件、394 → **400** 段路线；日军层：427 → **437** 事件、215 → **221** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-hebei.md`、计划
  `docs/plans/2026-11-21-M219-河北日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加河北 1937 年县名映射（安次、通县、沧县、定县、邢台、
  邯郸、磁县、大名等），并补县治落点。
- `regions.json` / `region-index.json`：地区由 567 → **574** 个，685 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- **本批未达计划 30 事件 / 12 路线的目标**：唐山、秦皇岛、涿州、良乡、固安、正定、井陉等
  县城沦陷日期缺少两条独立来源，按「宁可少一条，不可错一条」原则不硬录，列入研究笔记待考；
  后续以 M219b 复核后补。

---

## [v1.0.199] - 2026-11-21

### Added
- **抗日战争 · 江西日军战线（M218）**：江西日军事件由 11 条增至 21 条，涉及江西的日军路线 15 段。
  - 长江南岸（6）：马当要塞失守、彭泽、湖口、星子、瑞昌、德安。
  - 南昌会战外围（3）：永修、高安、奉新。
  - 赣南（1）：南康。
  - 路线（9 段，#207—#215）：彭泽—湖口、湖口—九江、九江—瑞昌、九江—星子、星子—德安、
    永修—南昌、南昌—高安、南昌—奉新、赣州—南康。
  - 专题：665 → **675** 事件、385 → **394** 段路线；日军层：417 → **427** 事件、206 → **215** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-jiangxi.md`、计划
  `docs/plans/2026-11-21-M218-江西日军战线细化-plan.md`。
- **第一期华东六省收口**：江苏、安徽、山东、浙江、福建、江西六省均按「登陆/渡江 → 县城 →
  进攻路线 → 暴行/资源/统治 → 受降」完成一轮细化。

### Changed
- `scripts/build-region-data.py`：增加江西 1937 年县名映射（彭泽、湖口、星子、瑞昌、德安、
  永修、高安、奉新、南康等），并补县治落点。
- `regions.json` / `region-index.json`：地区由 561 → **567** 个，675 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 九江、南昌、上饶、赣州、大余、遂川机场等已有事件不重复；只作路线端点锚点。
- 马当、彭泽、湖口、星子、瑞昌、德安、永修、高安、奉新、南康日期为通行说法，正文标「待页码级核对」。

---

## [v1.0.198] - 2026-11-21

### Added
- **抗日战争 · 福建日军战线（M217）**：福建日军事件由 6 条增至 17 条，涉及福建的日军路线 8 段。
  - 金门（2）：料罗湾登陆、金门沦陷（1937-10-26）。
  - 厦门（2）：厦门炮战（1937-09-03）、厦门受降（1945-09-28）。
  - 闽江口（2）：长乐沦陷、连江沦陷（1941-04-21）。
  - 东山（3）：东山港登陆、东山保卫战（1939-07-11/16）、日伪军再犯东山（1939-08-23）。
  - 沿海暴行（2）：永宁惨案、崇武惨案（1940-07-16）。
  - 路线（5 段，#202—#206）：料罗湾—金门城、闽江口—长乐—福州、闽江口—连江—福州、
    永宁—崇武、东山港—东山城。
  - 专题：654 → **665** 事件、380 → **385** 段路线；日军层：406 → **417** 事件、201 → **206** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-fujian.md`、计划
  `docs/plans/2026-11-21-M217-福建日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加福建 1937 年县名映射（金门、厦门、长乐、连江、东山、
  晋江、惠安等），并补县治落点。
- `regions.json` / `region-index.json`：地区由 548 → **561** 个，665 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 厦门登陆/沦陷、闽江口两次登陆、福州两次沦陷已有事件不重复；厦门炮战、东山第二次进犯、
  厦门受降标 `routeEvent:false`。
- 诏安、海澄港尾为伪军进攻，主体不是日军，本批不录；鼓浪屿 1941-12 日期待考，不录。

---

## [v1.0.197] - 2026-11-21

### Added
- **抗日战争 · 浙江日军战线（M216）**：浙江日军事件由 14 条增至 39 条，涉及浙江的日军路线 23 段。
  - 1937 嘉湖（3）：嘉兴、湖州、长兴。
  - 1938 惨案与伪政权（4）：乔司惨案、富阳午朝庙惨案、龙溪惨案、伪浙江省政府。
  - 1940 钱塘江与镇海（2）：萧山、镇海沦陷与收复。
  - 1941 宁绍（5）：慈溪、奉化、余姚、大皎惨案、象山茅洋砩矿。
  - 1942 浙赣战役（8）：诸暨、东阳、义乌、金华、兰溪、丽水、嵊县、新昌。
  - 1944—1945（3）：丽水第二次沦陷、富阳宋殿洽降、杭州日军缴械。
  - 路线（16 段，#186—#201）：金山卫—嘉兴、嘉兴—湖州—长兴、湖州—杭州、嘉兴—杭州、
    杭州—萧山、萧山—绍兴、绍兴—宁波、宁波—镇海、宁波—奉化、瑞安—温州、
    诸暨—东阳—义乌—金华、金华—兰溪、金华—衢州、金华—丽水、丽水—温州、嵊县—新昌。
  - 专题：629 → **654** 事件、364 → **380** 段路线；日军层：381 → **406** 事件、185 → **201** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-zhejiang.md`、计划
  `docs/plans/2026-11-21-M216-浙江日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加浙江 1937 年县名映射（嘉兴、吴兴、长兴、杭县、富阳、
  德清、萧山、慈溪、奉化、余姚、象山、诸暨、东阳、义乌、兰溪、丽水、嵊县、新昌等）；
  `COUNTY_RE` 支持两字县名（杭县、鄞县、嵊县、衢县），乔司、大皎、龙溪等地点正确落到县。
- `regions.json` / `region-index.json`：地区由 523 → **548** 个，654 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 杭州沦陷、宁波细菌战、绍兴、1941 镇海、瑞安、温州两次沦陷、宁波、浙赣战役、衢州等
  已有事件不重复；「嵊县、新昌」拆为两条；慈溪、余姚日期超出原路线区间，路线 #192 终点延至 4/23。
- 乔司、午朝庙、龙溪、大皎、细菌战、象山砩矿、浙赣战役、伪省府、两次受降标 `routeEvent:false`。

---

## [v1.0.196] - 2026-11-21

### Added
- **抗日战争 · 山东日军战线（M215）**：山东日军事件由 6 条增至 36 条（青岛院辖市另 1 条），
  涉及山东的日军路线增至 25 段。
  - 津浦路北段（7）：德州、临清、高唐、周村、淄川、济南（已有）、泰安。
  - 胶济路与胶东（9）：青岛、潍县、即墨、烟台、黄县、威海卫、兖州、曲阜、邹县。
  - 鲁南（10）：济宁、泗水、汶上、滕县、临城、峄县、枣庄、临沂、郓城、金乡。
  - 鲁西与后期（5）：聊城、伪山东省公署、荣成、沂蒙山「铁壁合围」、马鞍山保卫战。
  - 受降（1）：1945-12-27 济南、青岛、德州地区受降。
  - 路线（18 段，#168—#185）：德州—济南、济南—泰安、泰安—兖州—曲阜—邹县、邹县—济宁—汶上、
    周村—淄川、青岛—即墨、青岛—烟台、烟台—威海卫、兖州—滕县—临城—峄县、峄县—枣庄、
    潍县—临沂、郓城—菏泽、济南—聊城、德州—临清、临清—高唐、曲阜—泗水、烟台—黄县、济宁—金乡。
  - 专题：598 → **629** 事件、346 → **364** 段路线；日军层：350 → **381** 事件、167 → **185** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-shandong.md`、计划
  `docs/plans/2026-11-21-M215-山东日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加山东 1937 年县名映射（德县、临清、高唐、长山、淄川、泰安、
  潍县、滋阳、曲阜、邹县、济宁、泗水、汶上、即墨、福山、黄县、威海卫行政区、滕县、峄县、
  临沂、郓城、金乡、聊城、荣成、沂水等），并补县治落点。
- `regions.json` / `region-index.json`：地区由 494 → **523** 个，629 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 济南、菏泽已有事件不重复添加；青岛按院辖市单列；枣庄与峄县同日，单列事件。
- 荣成 1940-02-22 为山东 107 县全部沦陷标志，但无连续路线，标 `routeEvent:false`。

---

## [v1.0.195] - 2026-11-21

### Added
- **抗日战争 · 安徽日军战线（M214）**：安徽日军事件由 5 条增至 43 条，涉及安徽的日军路线增至 22 段。
  - 1937 太湖南岸—芜湖（9）：广德、郎溪、宣城、芜湖、当涂、巴纳号事件、全椒、马鞍山矿区、滁县。
  - 1938 津浦路南段—淮河（8）：明光、池河、临淮关、定远、凤阳、蚌埠、凤阳山马村惨案、怀远。
  - 1938 徐州会战—皖北（7）：蒙城、萧县、宿县、砀山、涡阳、亳县。
  - 1938 合肥—安庆—大别山（7）：合肥、潜山、太湖、宿松、六安、霍山。
  - 1938—1945 皖江与统治（7）：东流、贵池、铜陵、淮南煤矿、伪安徽省政府、皖南扫荡、巢无扫荡、灵五惨案、蚌埠受降。
  - 路线（18 段，#150—#167）：广德—郎溪—宣城、宣城—芜湖、芜湖—当涂、当涂—马鞍山、全椒—滁县、
    明光—临淮关—蚌埠、池河—定远、蚌埠—凤阳、蚌埠—怀远、蚌埠—蒙城、宿县—萧县、萧县—砀山、
    蒙城—涡阳—亳县、合肥—安庆、安庆—潜山—太湖—宿松、合肥—六安、六安—霍山、安庆—东流—贵池—铜陵。
  - 专题：560 → **598** 事件、328 → **346** 段路线；日军层：312 → **350** 事件、149 → **167** 段路线。
- 研究笔记 `docs/research/units/anti-japanese-war-anhui.md`、计划
  `docs/plans/2026-11-21-M214-安徽日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加安徽 1937 年县名映射（广德、郎溪、宣城、当涂、全椒、滁县、
  嘉山、定远、凤阳、怀远、蒙城、涡阳、亳县、萧县、宿县、砀山、合肥、潜山、太湖、宿松、霍山、
  东流、贵池、和县、泾县、桐城、巢县、灵璧等），并补县治落点。
- `regions.json` / `region-index.json`：地区由 459 → **494** 个，598 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 未采用 A1「5/14 屯溪沦陷」条（与屯溪实际未长期沦陷矛盾）；淮南煤矿只知月份，
  标 `datePrecision: month` 且不画线。

---

## [v1.0.194] - 2026-11-21

### Fixed
- 发布脚本构建副产物回滚不完整：`scripts/deploy.sh` 只还原 `data/atlases/search-index.json`，
  没有还原 `data/atlases/index.json`，导致发布后工作区残留一个 dataVersion 与搜索索引不一致的
  `index.json`（M213 发布时出现 `efa51ad8` vs `f188b7e2`）。现在两个文件一起还原成提交里的版本，
  发布后工作区保持干净。

### Verify
- `git status` 在 `pnpm release` 后无残留改动；`data/atlases/index.json` 与
  `data/atlases/search-index.json` 的 `dataVersion` 一致。

---

## [v1.0.193] - 2026-11-21

### Added
- **抗日战争 · 江苏日军战线（M213）**：江苏日军事件由 2 条增至 33 条，路线由 6 段（含跨省）增至 26 段。
  - 苏南（17 事件）：日机首炸苏州、白茆口/浒浦登陆、昆山、常熟、苏州、无锡、宜兴、常州、
    江阴要塞、丹阳、金坛、溧阳、溧水、句容、镇江、扬州、万福桥惨案。
  - 苏北（14 事件）：南通姚港登陆、如皋、海门、东台、盐城、阜宁、宿迁、连云港、海州/新浦、
    淮阴、高邮、泰州、苏中四分区「清乡」。
  - 路线（20 段，#130—#149）：白茆口—常熟、昆山—苏州、常熟—苏州、苏州—无锡、无锡—常州、
    常州—丹阳—镇江、宜兴—溧阳—溧水—句容、常州—金坛—溧水、无锡—江阴、镇江—扬州、
    姚港—南通、南通—如皋、南通—海门、如皋—东台、东台—盐城—阜宁、连云港—海州、
    徐州—宿迁、宿迁—淮阴、扬州—高邮、扬州—泰州。
  - 专题：529 → **560** 事件、308 → **328** 段路线；日军层：281 → **312** 事件、129 → **149** 段路线。
- **史料考证铁律**：`AGENTS.md` 第 4 节新增第 11 条，要求任何事件/路线先用可核查史料考证、
  核对行为主体、至少两条独立来源，考证不实宁可不加；每批提交前写研究笔记并跑全套校验。
- 研究笔记 `docs/research/units/anti-japanese-war-jiangsu.md`：逐条列出事件、日期、来源、
  主体、异说与未纳入项（兴化、宝应、启东、泰兴/靖江等）。
- 总体分期计划 `docs/plans/2026-11-21-M213-日军进攻分省补全总体计划.md`（M213—M233）
  与 `docs/plans/2026-11-21-M213-江苏日军战线细化-plan.md`。

### Changed
- `scripts/build-region-data.py`：增加江苏 1937 年县名映射（吴县、无锡县、武进县、镇江县、
  江都县、南通县、如皋县、海门县、东台县、阜宁县、宿迁县、灌云县、东海县、淮阴县、泰县、
  高邮县、宜兴县、丹阳县、金坛县、溧阳县、溧水县、句容县、昆山县、常熟县、太仓县、吴江县），
  并把 `generatedAt` 更新为 2026-11-21。
- `regions.json` / `region-index.json`：地区由 426 → **459** 个，560 个事件全部有省 + 县/地点归属。

### Verify
- `pnpm validate:data`、`pnpm check:routes --atlas anti-japanese-war`（0 问题）、
  `pnpm check:heads --atlas anti-japanese-war`（0 个无来由端点）、`pnpm typecheck`、
  `pnpm lint`、`pnpm test`、`pnpm build:search-index`、`pnpm build:mobile-data --check` 全部通过。
- 无锡 11/25 与 11/27、泰州 2/13 与 2/16、宿迁 11/22 与「11 月下旬」等异说在正文并列；
  苏州空袭、许巷惨案、万福桥惨案、苏中「清乡」标 `routeEvent:false`。

---

## [v1.0.192] - 2026-11-20

### Changed
- Web 左侧栏改为四个 TAB：**图层 / 地区 / 筛选 / 说明**，避免一个长面板反复滚动。
  - 图层：时代疆域、历史省界、地区标注开关与各实体显隐；
  - 地区：地区筛选、本区事件 / 本区路线、复制链接 / 定位 / 搜本区；
  - 筛选：事件分类、起止日期、重置；
  - 说明：路线样式图例与专题备注。
- TAB 栏使用 `role="tablist"` / `role="tab"` / `role="tabpanel"`，`aria-selected`、`aria-controls` 完整；切换时自动回到面板顶部。
- 已选地区或分类/日期筛选生效时，对应 TAB 显示小红点提示。
- `RegionFilter` 增加 `embedded` 参数，嵌入 TAB 时去掉多余的分隔线。

### Verify
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- 本地 5180 页面与 `Legend.tsx` 模块加载正常。

---

## [v1.0.191] - 2026-11-20

### Changed
- 移除跨省路线的“起 XXX / 终 XXX”端点标签（`routeEndpointLabels()`）：
  - 标签由路线名拆分而来，114 段跨省路线中 13 段无起终点、30 段带出“第74军：”等番号前缀，口径不一致；
  - 端点标签会遮挡地图，对理解路线走向帮助有限。
- Web 与移动端同步移除端点标记、标签解析与相关样式（`.atlas-route-endpoint`）。
- 跨省路线本身仍整条保留，不裁剪、不产生假线头。

### Verify
- 选中湖北并放大到 7 级：跨省路线正常显示，页面中 `.atlas-route-endpoint` 节点为 0。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.190] - 2026-11-20

### Fixed
- 历史省界多条「横跨全省的直线」：源 `region` 图层把部分边界碎段接在环的末尾或中间，再用长直线连回主轮廓。察哈尔、甘肃、河北、河南、湖北、吉林、辽宁、陕西、浙江、宁夏、青海等省均受影响（海南岛此前是三角形）。
- 新增 `scripts/roc_ring_repair.py`：按 50km 切开环，用最近端点把碎段重新串成闭环；若某段让接缝多绕 150km 以上（重复海岸弧），丢弃该段。真实长直边界（川康界、新疆界等）会被原样接回。
- `repair-roc-provinces.py` 改为对全部省界环生效，并固定环起点，重复运行不再产生 diff。
- `import-roc-provinces.py` 用同一套缝合逻辑，重新导入时不会复发。
- `check-region-index.ts` 的海南专项检查升级为通用回归检查：>170km 的省界线段，或中点两侧 20km 都在省内，即判为横跨省域的直线。

### Verify
- 四张省界快照全部修复；`pnpm check:regions` 通过（旧数据会报 29 处横跨直线，新数据 0 处）。
- 剩余 >80km 线段均为真实长直边界（川康 102°E、察哈尔—热河、辽宁—热河、新疆界、海南北岸等）。
- `pnpm validate:data`、`check:heads`、`check:land`、`typecheck`、`lint`、`test`、`build` 通过。
- 地图截图核对湖北、河南、陕西、甘肃、河北、察哈尔、辽宁、吉林、浙江，均无跨省直线。

---

## [v1.0.189] - 2026-11-20

### Fixed
- 历史省界/地区标注偶发整层消失：`useI18n()` 每次渲染返回新的 `t`，地图重建 effect 以 `t` 为依赖，任何无关重渲染（悬停省名、选中事件等）都会重建图层并停在隐藏状态，必须缩放才恢复。
- `useI18n()` 的 `t` 改为 `useCallback`，按 `locale` 固定引用。
- `MapCanvas` 抽出 `applyTerritoryVisibility` / `applyRegionLabelVisibility`，疆域与地区标注重建后立即同步可见性，不再依赖另一个 effect 的执行时机。

### Verify
- 旧代码复现：悬停省名后 125 个多边形 `visible=0`；修复后同一操作保持 31，无重建。
- 语言切换、时间轴切换、省界开关：可见数量符合预期（关 0 / 开 31）。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.188] - 2026-11-20

### Fixed
- 修复海南岛省界三角形：源 `region` 图层中广东的海南岛环多出一段北岸重复弧，简化后形成两条跨岛斜线。现按 >100km 跳跃切开，保留面积最大的闭合子环，四张省界快照均修复。
- `scripts/import-roc-provinces.py` 增加同样的海南环修复，避免重新导入时复发。
- `scripts/check-region-index.ts` 增加海南岛省界回归检查：广东海南环内出现 >150km 直线即报错。

### Verify
- 海南岛轮廓闭合，68 个点，面积 3.069°，最长边为北岸约 96km 直线，无跨岛三角形。
- `pnpm check:regions`、`pnpm validate:data`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- 地图截图确认海南岛只保留海岸线边界。

---

## [v1.0.187] - 2026-11-20

### Changed
- Web 本地开发端口从 5173 改为 **5180**，避免与本机其他 Vite 项目冲突；`strictPort` 保持开启，端口被占用时直接报错。
- 支持 `VITE_DEV_PORT=5181 pnpm dev` 临时换端口。
- README 与 AGENTS 的本地开发说明同步更新，并注明本机 8081 可能是其他项目、Atlas 线上预览是 `quizgo-ecs:8081`。

### Verify
- `pnpm dev` 输出 `http://127.0.0.1:5180/`，`curl` 返回 200；5173 不再监听。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.186] - 2026-11-20

### Docs
- M209 plan 完成 as-built 对账：DoD 全部勾选，地区数量更新为 425（30 省 + 8 院辖市 + 海外 + 188 县 + 198 地点），补第 10 节“计划内 / 计划外 / 仍不做”。
- M209 design 更新为 Schema v1.2.0，补 `county-seats.json`、`regions.ts`、台湾省与第 11 节 as-built/后续扩展。
- 新增 `M210-地区标注与定位-design.md`，补齐 M210 技术方案。
- 新增 `M211-地区浏览增量-plan/design.md`，把地区树、本区事件/路线、搜索页仅搜本区、路线详情、分享状态、省级标签等增量正式收编；明确搜索页地区筛选是**已接受的范围扩展**，并冻结追加清单。
- 明确仍不做：民国县界、伪政权/根据地独立区划、地级市层级、1945 后区划、页码级史料校订。

### Verify
- 文档与实现数量核对一致：425 地区 / 529 事件 / 308 路线。
- `pnpm check:land --atlas anti-japanese-war`：0 条航线，0 段穿越陆地。
- 无代码变更；版本由钩子自增。

---

## [v1.0.185] - 2026-11-20

### Added
- 省级边界标签支持点击筛选与悬停说明：显示省名、今地名与“历史省界（示意）”。
- 移动端新增省级标签：从省界要素的 `labelPoint` 生成，缩放 4.5 级以上显示，点击可筛选该省。

### Changed
- 地图标签点击改为直接监听标签 DOM 的 `click`，避免 AMap.Text 的 `click` 事件在部分环境不触发；县/地点标签同步修复。

### Verify
- Web 悬停“河北”显示“省 · 今河北省、北京市、天津市 · 历史省界（示意）”。
- 点击“河北”后 `filters.regionIds` 变为 `["hebei"]`。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.184] - 2026-11-20

### Added
- 分享链接记录图层开关：地区标注 `labels`、历史省界 `boundaries`、时代疆域 `territories`，打开后恢复相同的显示状态。
- 三项开关使用 `1/0` 编码，缺省仍为显示。

### Verify
- 关闭地区标注后复制链接得到 `labels=0`；打开后 `showRegionLabels` 恢复为 `false`。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.183] - 2026-11-20

### Added
- 分享链接新增 `route` 参数：记录当前高亮路线的 `entityId:order`，打开链接后自动恢复路线高亮与详情。
- 复制链接同时携带地区、图层、分类、时间范围、选中事件与高亮路线。

### Verify
- 选中“北平—南京”后复制得到 `route=japanese-invasion:3`。
- 打开该链接后 `selectedRoute` 恢复为 `{ entityId: japanese-invasion, order: 3 }`。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.182] - 2026-11-20

### Changed
- “复制链接”现在同时携带当前图层（entities）、分类（categories）、时间范围（from/to）与选中事件（event），分享后可完整复现筛选状态。
- Web 与移动端共用同一分享状态编码。

### Verify
- 河北 + 1938-10-25 生成的链接包含 `t`、`entities`、`regions` 参数。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.181] - 2026-11-20

### Added
- 地区筛选新增“复制链接”：生成包含当前地区、时间与地图视野的分享链接，Web 直接复制，移动端调用系统分享。
- 剪贴板不可用时显示只读链接输入框，提示手动复制，不再依赖 `window.prompt`。

### Verify
- 选中河北后复制链接得到 `/atlas/anti-japanese-war?t=1938-10-25&regions=hebei`。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.180] - 2026-11-20

### Changed
- 关于页与移动端“关于”新增“地区与边界口径”：说明名义省区、省界示意、GeoNames 点位、县界暂不绘制，并链接 ATTRIBUTION。
- 数据契约版本统一显示为 **v1.2.0**：关于页、专题首页、空状态文档链接、根 README 与文档索引同步更新。

### Verify
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- 关于页可看到“地区与边界口径”与来源链接。

---

## [v1.0.179] - 2026-11-20

### Added
- Web 地区标注支持悬停浮签：显示县/地点名称、级别（县/市、地点）、今地名与点位来源（GeoNames / 县治同名地点 / 事件点即县治 / 手工校订）。
- 地区筛选树中的县名统一加 `◎` 前缀；若为事件平均点则显示 `≈`，与地图标注一致。

### Verify
- 悬停“◎ 迁安县”显示“县/市 · GeoNames 县治”。
- 移动端 `npx expo export --platform ios` 成功打包（1192 modules，9.8MB Hermes bundle）。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.178] - 2026-11-20

### Changed
- 剩余 12 个 `≈` 县全部人工确认：锦县、通县、辽县、兰封县、立煌县、随县、钦县、归绥县、衢县、畹町镇、定县、花县的事件坐标与今县治重合，已登记为 `event-seat`。
- 至此 188 个县标注点全部有来源：142 个 GeoNames、29 个县治同名地点、12 个事件点即县治、5 个手工校订；地图上不再出现 `≈` 近似标注。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线；425 个地区，归属完整。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.177] - 2026-11-20

### Added
- 地区标注按类型区分：`◎` 县治、`·` 地点、`≈` 事件平均点；Web 与移动端使用不同底色/边框，图例增加说明。
- 手工校订 5 个县治点位：陶林县（今察右中旗科布尔镇）、忻县（今忻州）、峄县（今枣庄峄城）、邳县（今邳州）、崖县（今三亚崖城）。

### Changed
- 事件平均点的县标注使用虚线边框与赭色文字，避免被误读为精确县治。
- `county-seats.json` 支持 `manual` 来源与 `note` 字段。

### Verify
- 县治/地点/近似点在地图上显示不同前缀与样式。
- `pnpm validate:data`、`pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.176] - 2026-11-20

### Changed
- 县标注点位大幅校订：142 个县改用 **GeoNames** 中国 populated places 坐标（CC BY 4.0），29 个县保留“县治同名地点”坐标，5 个县手工校订，12 个县仍用事件平均点。
- 新增 `county-seats.json` 记录县治点位来源；`scripts/build-region-data.py` 构建时优先应用，避免重建时丢失。
- 典型修正：迁安县从喜峰口附近移到迁安城，密云县从古北口移到密云城，遵化县从罗文峪移到遵化城，昌平县从南口移到昌平城。

### Docs
- `data/atlases/ATTRIBUTION.md` 增加 GeoNames 许可与引用；标注点位只作示意，不表示精确县治或县界。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线；425 个地区，归属完整。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.175] - 2026-11-20

### Added
- 路线详情新增“经过地区”：按省/院辖市/县列出该路线经过的地区，最多显示 14 个。
- 点击“经过地区”中的省或县，会切换到该地区筛选并缩放到该地区，同时关闭路线详情。
- Web 右侧路线面板与移动端路线弹层同步。

### Verify
- “北平—南京”经过地区：安徽省、河北省、江苏省、山东省、北平市、南京市、天津市、铜山县、峄县。
- 点“安徽省”后地区筛选变为 `anhui`，路线选中清除。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.174] - 2026-11-20

### Added
- 路线详情新增“起点附近事件”“终点附近事件”：按 20km 范围、最多各 3 条，按距离排序并去重。
- 点击附近事件会跳到该事件日期、打开事件详情，并自动取消路线选中。
- 新增共享工具 `eventsNearPoint` / `distanceKm` 与单元测试。

### Verify
- “北平—南京”起点附近：卢沟桥事变、第29军与卢沟桥抗战、河北事件；终点附近：第三战区成立、南京沦陷、南京大屠杀。
- 点“卢沟桥事变”后跳到 1937-07-07，事件选中，路线选中清除。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.173] - 2026-11-20

### Added
- 选中路线后显示路线详情：名称、分段类型、起止日期、主体、描述，以及“定位路线 / 关闭详情”。
- Web 端为右侧面板，移动端为底部弹层；点击地图上的路线或“本区路线”中的条目都会打开。
- 路线与事件选中改为互斥：选中路线会清除事件选中，选中事件会清除路线高亮，避免两个详情面板重叠。

### Verify
- 选择“北平—南京”：右侧显示路线详情，时间 1937-07-07 — 1937-12-13，主体“日军进攻”。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.172] - 2026-11-20

### Added
- 选中路线时叠加高亮：浅色光晕 + 朱砂色粗线，Web 端随当前时间进度截断，移动端显示整条路线。
- 直接点击地图上的路线也会选中并高亮；点击地图空白处同时清除事件与路线选中。
- “本区路线”点击后同时完成：跳到结束日、缩放到路线、选中高亮。

### Verify
- 河北选区点“北平—南京”：时间跳到 1937-12-13，地图新增 2 条高亮覆盖物。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.171] - 2026-11-20

### Added
- 地区筛选新增“本区路线”列表：按开始日期列出当前选区内经过的路线，显示时间范围、实体颜色、路线名与分段类型。
- 点击路线会把时间轴跳到路线结束日，并缩放到该路线范围；Web 与移动端同步。
- 默认显示前 12 条，可展开全部；移动端点击后关闭筛选面板。

### Changed
- 路线时间范围显示为 `37-07-07 → 12-13` 形式，跨年时显示两端年份。

### Verify
- 河北选区显示 30 条路线；点“北平—南京”可定位到整条路线。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.170] - 2026-11-20

### Added
- 移动端地区筛选新增“搜本区”：带着当前选区跳到移动端搜索页，只搜该地区内的事件。
- 移动端搜索页支持 `atlasId`、`regions`、`regionLabel` 参数，显示地区限制标签，可一键清除。
- 从受限搜索结果打开事件时，会把 `regions` 带回专题页，保持地区筛选。

### Changed
- 移动端 `Search` 路由参数扩展为可选的 `atlasId / regions / regionLabel`。

### Verify
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- Web 端“搜本区”流程已在 v1.0.169 验证；移动端复用同一 `SearchOptions.regionIds` 逻辑。

---

## [v1.0.169] - 2026-11-20

### Added
- 地区筛选新增“搜本区”按钮：带着当前选区跳到搜索页，只搜该省/县/地点内的事件。
- 搜索页支持 `atlas`、`regions`、`regionLabel` 参数，并显示“仅搜：河北省”地区限制标签，可一键清除。
- 从受限搜索结果打开事件时，会把 `regions` 一并带回专题页，保持地区筛选。

### Changed
- `SearchOptions` 新增 `regionIds`，搜索索引利用事件已有的 `location.regionIds` 做地区过滤，无需重复建索引。
- 新增搜索地区过滤单元测试。

### Verify
- 搜索“保定”并限制河北：返回 2 条（保定沦陷、第一战区成立）。
- 打开“保定沦陷”后专题 URL 仍带 `regions=hebei`。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。

---

## [v1.0.168] - 2026-11-20

### Added
- 地区筛选新增“本区事件”列表：按日期列出当前选区内的事件，显示事件名与实体颜色；点击事件会把时间轴跳到该事件日期并打开详情。
- 默认显示前 12 条，可展开全部；移动端点击事件后自动关闭筛选面板。

### Verify
- `pnpm typecheck`、`pnpm lint`、`pnpm build` 通过。
- 手工验收：选河北后“本区事件”25 条；点“保定沦陷”跳转到 1937-09-24 并选中该事件。

---

## [v1.0.167] - 2026-11-20

### Changed
- 地区筛选改为真正的“省 → 县 → 地点”折叠树：县默认收起，点箭头展开；选中县或地点时自动展开所属县；搜索时自动展开匹配路径。
- Web 与移动端同步；直接挂在省下的地点仍单独列出。
- 县/地点行显示事件数，县级同时显示经过该县的路线数。

### Verify
- `pnpm typecheck`、`pnpm lint`、`pnpm build` 通过。
- 手工验收：河北下 18 个县默认收起；展开清苑县可见“保定”；搜索“保定”自动展开清苑县。

---

## [v1.0.166] - 2026-11-20

### Added
- 历史省界开关下显示当前时间对应的年份：“当前显示 1931 / 1937 / 1938—1944 / 1945 年省界示意”。
- 地区筛选说明明确写出“县界暂不绘制，县名落点为示意位置”。

### Changed
- 县标注落点改进：30 个县优先使用“县治同名地点”的坐标（如清苑县→保定、临榆县→山海关、杭县→杭州），其余仍用事件坐标平均；`regions.json` 用 `extensions.pointSource` 标记来源。
- 县/地点标注仍只作示意，不声称精确县治坐标。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线；425 个地区，归属完整。
- `pnpm typecheck`、`pnpm lint`、`pnpm build` 通过。
- 手工验收：1938 年时间轴显示“1938—1944 年省界示意”；清苑县标注落在保定附近。

---

## [v1.0.165] - 2026-11-20

### Added
- 地图新增“地区标注”：院辖市、县、地点按缩放级别显示当时名称；缩放 7 级以上显示县名，9 级以上显示地点名，选中地区始终显示。Web 与移动端同步。
- 地区筛选新增“定位”按钮：按选区内的点、事件、路线与省界计算范围，一键缩放到所选省/县/地点。
- 事件详情新增“地区”一行，显示省/县/地点路径，例如“河北省 · 清苑县 · 保定”。

### Changed
- `regions.json` 为全部 188 个县与地点补 `point`；其中 30 个县优先使用“县治同名地点”的坐标，其余由事件坐标平均生成，仅用于标注落点，不声称是精确县治坐标。
- 移动端地区标注最多显示 80 个，优先选中地区及其子地区，低缩放不显示。

### Fixed
- `湖北武汉` 不再强行归入武昌县，改为湖北省下的“武汉”地点；`浙江衢州、金华、玉山一带` 的地点名去掉前导顿号。

### Docs
- 新增 M210 计划与对话档案；M209 地区索引口径不变，Schema 仍为 1.2.0。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线；425 个地区，归属完整。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm build` 通过。
- 手工验收：河北缩放 7 级可见县名；选中河北点“定位”缩放到河北；事件详情显示地区路径。

---

## [v1.0.164] - 2026-11-20

### Added
- 抗日战争专题支持按地区浏览：省 / 院辖市 → 县市 / 地点，Web 图例与移动端筛选面板均可多选、搜索、清除。
- 新增 1931、1932—1937、1938—1944、1945 四张历史省界示意面（只描边、不填充）；选中省高亮，选中县/地点时高亮其所属省；低缩放隐藏省名，减少与高德底图标签重叠。
- 新增 `regions.json`（425 个地区：30 省 + 8 院辖市 + 海外 + 188 县 + 198 地点）与 `region-index.json`（529 事件 / 308 路线归属），由 `scripts/build-region-data.py` 构建。
- 跨省路线不裁剪，整条保留；放大到 6 级后按屏幕空间避让显示起点、终点标签。
- 分享链接新增 `regions` 参数，可复现地区筛选。
- 新增 `pnpm validate:data` 中的地区索引检查：事件/路线归属完整、所有 id 存在、父子关系有效。

### Changed
- Schema 升至 **1.2.0**：新增可选 `manifest.regions`、`manifest.regionIndex`、`event.location.regionIds`、`route.properties.regionIds`、`route.properties.endpointRegionIds`；旧客户端忽略后仍可加载。
- 选区语义改为“最具体者优先”：同时选中省和县时，只保留县，避免按县筛选退化为按省筛选。
- 省界数据来自江山时序 `region` 图层（GPL-3.0，手工绘制示意）；未使用 CHGIS 的 `prefecture` 图层，不绘制县界。

### Docs
- 新增 M209 design/plan、ADR-0011、Schema v1.2.0、`data/atlases/ATTRIBUTION.md` 抗日战争专节。
- 说明县级地界缺失的原因与“地点”层级口径；历史省界为示意，不是精确勘界。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线段；地区索引 425 个地区（39 个一级），归属完整；全库 1323 / 791。
- `pnpm check:regions`（并入 `validate:data`）：通过。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。
- 手工验收：选河北、清苑县、上海、海外，事件数分别正确；跨省路线整条保留；省界可开关。

---

## [v1.0.163] - 2026-11-20

### Fixed
- 用户指出 `retreat` 是现成路线样式（虚线，图例“撤退 / 突围”），M208 只画进攻、省略 1940-01 与 1940-06 撤退线是不对的。补 5 段撤退线：
  - #125 新丰—梅坑—永汉—增城（1940-01-01～01-16）；
  - #126 新江—翁源—良口—从化—广州（1940-01-01～01-16）；
  - #127 英德—银盏坳—花县—广州（1940-01-01～01-16）；
  - #128 良口—街口—广州（1940-06-01～06-12）；
  - #129 花县—广州（1940-06-01～06-12）。
- 5 段全部 `segmentType: retreat`，按虚线渲染，与 `advance` 实线区分；端点由同实体事件锚定，`check:heads` 0 个无来由端点。

### Changed
- 日军层路线 124 → **129**；专题路线 303 → **308**；全库路线 786 → **791**。事件数不变（281 / 529 / 1323）。

### Docs
- 更新 M208 计划、实体审计 12.5、路线审计 12.1、日期核对清单 11.5.1。

### Verify
- `pnpm validate:data`：529 事件 / 308 路线段；全库 1323 / 791。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.162] - 2026-11-20

### Added
- 继续补广东，细化两次粤北会战，新增 14 个事件、5 段路线。
  - 第一次粤北会战：小楼/正果（1939-12-17）、永汉（12-19）、从化（12-20）、良口（12-22）、梅坑/吕田（12-25）、新丰（12-28）、翁源（12-30）、英德（12-30）、新江（12-31）。
  - 第二次粤北会战：花县（1940-05-16）、街口（05-17）、鸡笼冈（05-18）、良口（05-20）、石榴花顶（05-22）。
  - 路线：#120 广州—花县—银盏坳—源潭—英德、#121 增城—小楼—正果—永汉—左潭—梅坑—新丰、#122 从化—鸡笼冈—良口—吕田—翁源—新江、#123 广州—街口—鸡笼冈—良口、#124 良口—石榴花顶。

### Changed
- 日军层 267 → **281** 事件、119 → **124** 段路线；专题 515 → **529** 事件、298 → **303** 段路线；全库 1309 → **1323** 事件、781 → **786** 段路线。
- 花县 1940-05-16 不在 #123 路线上，标 `routeEvent:false`；其余节点由路线覆盖。
- 只画日军进攻阶段，不画 1940-01 与 1940-06 的撤退/追击线。

### Docs
- 新增 `docs/plans/2026-11-20-M208-粤北会战节点补全-plan.md`。
- 同步专题 README、实体审计第 12 节、路线审计第 12 节、日期核对清单第 11.5 节。

### Verify
- `pnpm validate:data`：529 事件 / 303 路线段；全库 1323 / 786。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.161] - 2026-11-20

### Added
- 回答「广东的线路和事件要细致到像海南那样」：补 27 个事件、15 段路线，把广东从几个孤立节点补成珠三角、粤东、东江、受降四条线。
  - 三灶岛：1937-12-04 首次占领、1938-02-16 莲塘湾登陆并建海军第六航空基地、1938-04-12 起大屠杀。
  - 大亚湾：平海/稔山（104 师团）、盐灶背（及川支队）、澳头/霞涌（18 师团）三路登陆；淡水 10/13、惠州 10/15、博罗 10/16、增城 10/20、广州 10/21、从化/虎门 10/23、三水 10/25、佛山 10/26。
  - 珠三角：顺德、番禺 10/26；江门 1939-03-30、新会 1939-04-02；中山 1940-03-07、唐家/香洲 1940-03-06。
  - 东江：宝安（深圳）1938-11-26 第一次、1940-06-22 第三次（1939-08-15 第二次已有）。
  - 粤东：南澳 1938-06-21 钱澳登陆、06-23 全岛；澄海 1939-06-29。
  - 受降：广州 1945-09-16、汕头 1945-09-28。
- 补 15 段路线（#105—#119）：平海—稔山—惠州、盐灶背—平山—惠州、澳头—淡水—惠州、惠州—博罗—增城—广州、广州—从化、广州—虎门、虎门—三水—佛山、广州—顺德、广州—番禺、广州—江门—新会、顺德—石岐、唐家—石岐、潮州—澄海、钱澳—隆澳、广州—深圳。

### Changed
- 日军层 240 → **267** 事件、104 → **119** 段路线；专题 488 → **515** 事件、283 → **298** 段路线；全库 1282 → **1309** 事件、766 → **781** 段路线。
- 三灶岛、1940 年宝安第三次、广州/汕头受降标 `routeEvent:false`；其余城市事件由路线覆盖。
- 大亚湾登陆点按《广州战役》与惠州地方史；三灶岛数字据珠海地方志；南澳/汕头/澄海据汕头市档案馆；受降据中国受降档案。异说在正文注明“待页码级核对”。

### Docs
- 新增 `docs/plans/2026-11-20-M207-广东日军战线细化-plan.md`。
- 同步专题 README、实体审计第 11 节、路线审计第 11 节、日期核对清单第 11.4 节。

### Verify
- `pnpm validate:data`：515 事件 / 298 路线段；全库 1309 / 781。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.160] - 2026-11-20

### Added
- 回答「海南沿海占领点有具体登陆点吗？内陆点从哪里过来」：补 5 个登陆点事件、13 段进攻路线，把“某县城沦陷”补成“从哪个港口登陆 / 从哪个据点出发”。
  - 登陆点：澄迈湾/老城（1939-02-10～12）、崖州湾头灶港/大旦港/马岭干溪（02-14）、白马井（04-16）、清澜港（02-23，可能为陆路进入）、八所/北黎（07-18）。
  - 路线：#92 老城—金江、#93 白马井—新英—新州、#94 头灶港—崖城、#95 海口—定安、#96 海口—文昌—清澜、#97 三亚—藤桥—陵水、#98 文昌—嘉积、#99 金江—临高、#100 嘉积—万宁、#101 陵水—保亭、#102 崖城—乐东、#103 八所—石碌、#104 八所—墩头—新街。
- 明确待考项：屯昌（可能自定安/嘉积）、感恩（可能自崖县沿海或感恩河口登陆）、嘉积具体出发地（文昌/定安）、临高 9/25 新盈港登陆说；均未硬连线。

### Changed
- 日军层 235 → **240** 事件、91 → **104** 段路线；专题 483 → **488** 事件、270 → **283** 段路线；全库 1277 → **1282** 事件、753 → **766** 段路线。
- 所有新路线均为 `advance` + `schematic`，端点由同实体事件锚定；描述写“自 X 方向”，不写成精确行军轨迹。

### Docs
- 新增 `docs/plans/2026-11-20-M206-海南登陆点与出发地-plan.md`。
- 同步专题 README、实体审计第 10 节、路线审计第 10 节、日期核对清单第 11.3 节。

### Verify
- `pnpm validate:data`：488 事件 / 283 路线段；全库 1282 / 766。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.159] - 2026-11-20

### Added
- 回答「日本在海南只去到海口、琼海、昌江、东方、三亚这些地方吗」：不是。现有图层只标五个关键点，容易被读窄。日军占领的是环岛沿海县城、港口和交通线，至 1940-03 占 14 县县城和大部分市镇，设 360 多个据点、195 个维持会；白沙县城和五指山周围山区未被长期占领，是琼崖抗日根据地。
- 补 15 个事件（均 `routeEvent:false`，不新增路线）：
  - 1939-02-15 崖县（崖城）沦陷；
  - 1939-02-20 定安沦陷；
  - 1939-02-22 文昌沦陷；
  - 1939-04-14 澄迈（金江）沦陷；
  - 1939-04-15 嘉积沦陷；
  - 1939-04-18 临高沦陷；
  - 1939-04-18 儋县（新州）沦陷；
  - 1939-04-28 陵水沦陷；
  - 1939-05-11 屯昌沦陷；
  - 1939-06-27 感恩沦陷；
  - 1939-07-18 昌江（新街/墩头）沦陷；
  - 1939-08-13 万宁沦陷；
  - 1940-03-15 保亭沦陷；
  - 1940-03-15 乐东沦陷；
  - 1940-03-15「日军占领海南环岛县城与据点」总览。
- 明确范围：日军占领 14 县县城和大部分市镇，但**没有长期占领白沙县城和五指山周围山区**；日军仍不断对根据地“蚕食”“扫荡”。

### Changed
- 日军层 220 → **235** 事件、91 段路线不变；专题 468 → **483** 事件、270 段路线不变；全库 1262 → **1277** 事件、753 段路线不变。
- 定安（2/20 与 2/22）、文昌（2/21 与 2/22）、临高（4/18 与 9/25）、陵水（4/21 与 4/28）、保亭（1940-03-15 与 07-16）等异说均在正文注明。
- 360 多个据点、195 个维持会、14 县等数字标“据海南史志网/待页码级核对”。

### Docs
- 新增 `docs/plans/2026-11-20-M205-海南占领范围补全-plan.md`。
- 同步专题 README、实体审计第 9 节、日期核对清单第 11.2 节。

### Verify
- `pnpm validate:data`：483 事件 / 270 路线段；全库 1277 / 753。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.158] - 2026-11-20

### Added
- 回答「日本在海南的行动有没有需要补齐的」：复核后确认有，立 M204 补 7 个事件、2 段供应线。此前日军侧只有天尾港登陆、海口/府城失守、三亚/榆林登陆、石碌铁矿、海南警备府，缺田独铁矿、石八铁路、榆林—北黎铁路、田独万人坑、首轮占领、1942 年“扫荡”与 1945 年受降。
  - 1939-07「田独铁矿开采」：1939-07 发现，1940-06-11 首次出矿；田独—榆林约 10km 轻便铁路、榆林港矿石码头；据日方资料约开采 269 万吨、掠运 268 万吨。
  - 1942-03-23「石八铁路通车」：石碌—八所约 52km，03-23 第一列矿石车到八所。
  - 1943-03「榆林—北黎铁路建成」：约 187.9km，1943-03 基本完工，在北黎与石八线接轨。
  - 1945-08-15「田独万人坑」：劳工死亡万余人，1945-08 仅存 1713 人；`routeEvent:false`。
  - 1939-04-30「日军完成海南首轮占领」：控制文昌、定安、嘉积、儋县新州等；`routeEvent:false`。
  - 1942-05-01「日军‘扫荡’琼崖根据地」：海口、嘉积、那大等据点出兵，琼崖独立总队反“扫荡”；`routeEvent:false`。
  - 1945-10-01「海南受降」：第 46 军渡海，10 月初成立前进指挥所，10 月中旬起分批接收；`routeEvent:false`。
- 补 2 段供应线：#90 田独—榆林（铁矿外运）、#91 榆林—北黎（榆林—北黎铁路）。

### Changed
- 日军层 213 → **220** 事件、89 → **91** 段路线；专题 461 → **468** 事件、268 → **270** 段；全库 1255 → **1262** 事件、751 → **753** 段。
- 田独/石碌产量、掠运量、劳工死亡数均标“据日方资料/待页码级核对”；海南受降取 1945-10-01 为阶段节点，精确仪式日期待核；1939 年首轮占领、1942 年“扫荡”同样注明各城/各次战斗日期待核。
- 田独万人坑、首轮占领、1942 年“扫荡”、受降均标 `routeEvent:false`，不强行画线。

### Docs
- 新增 `docs/plans/2026-11-20-M204-海南日军行动补全-plan.md`。
- 同步专题 README、实体审计第 8 节、路线审计第 9 节、日期核对清单第 11.1 节。

### Verify
- `pnpm validate:data`：468 事件 / 270 路线段；全库 1262 / 753。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test`、`build:search-index`、`build:mobile-data` 全部通过。

---

## [v1.0.157] - 2026-11-20

### Added
- 按「行为主体」全面审计日军层，补 84 个事件、25 段路线，并把中国战区受降仪式改挂 `japanese-invasion`。日军层 128 → 213 事件、64 → 89 段路线；专题 377 → 461 事件、243 → 268 段；全库 1255 事件 / 751 段。
- **东北（1931—1932）**：长春沦陷、吉林沦陷、齐齐哈尔沦陷（江桥作战）、《日满议定书》、平顶山惨案；补长春—吉林、长春—洮南—齐齐哈尔两段。
- **华北（1935—1937）**：广田三原则、北平沦陷、天津沦陷、张家口沦陷、保定沦陷、石家庄沦陷、娘子关失守、归绥沦陷、包头沦陷、日本海军封锁中国海岸、金山卫登陆、上海沦陷、伪中华民国临时政府、杭州沦陷、济南沦陷、陶德曼调停；补南口—张家口—大同、北平—保定—石家庄、石家庄—娘子关—太原、大同—归绥—包头、金山卫—嘉兴—杭州、济南—青岛六段。
- **华东与华中（1938—1941）**：伪中华民国维新政府、兴亚院、厦门登陆与沦陷、徐州沦陷、安庆沦陷、九江沦陷、南昌沦陷、宜昌沦陷；补五通—厦门一段。
- **华南沿海（1939—1941）**：宝安（深圳）沦陷、汕头登陆/沦陷、潮州沦陷、南宁沦陷、香港沦陷、日军进入上海公共租界；补广州—虎门—深圳、妈屿—汕头、汕头—潮州三段。
- **雷州半岛（1943）**：日军独立混成第 23 旅团在通明、下岚登陆，占领海康、遂溪与广州湾；补雷州半岛登陆、雷州半岛沦陷、广州湾沦陷三个事件与通明—海康—遂溪—广州湾一段。
- **宁绍与福州（1941）**：绍兴、镇海、瑞安、温州、宁波沦陷，福州第一次沦陷；补杭州—绍兴、镇海—宁波、瑞安—温州、闽江口—福州四段。
- **战略层**：华北/华中开发会社、两次近卫声明、宁波细菌战、常德细菌战、浙赣细菌战、成都大轰炸、潘家峪惨案、北疃惨案、厂窖惨案。
- **1942—1945**：冀中五一大扫荡、日军侵入滇西（畹町/龙陵/惠通桥）、衢州沦陷、上饶沦陷、温州第二/第三次沦陷、郑州/许昌/洛阳/长沙/衡阳/桂林/柳州/独山沦陷、第二次福州沦陷、湘粤赣边区韶关/南雄/大余/赣州/遂川机场、老河口沦陷、台湾光复；补畹町—龙陵—惠通桥、闽江口—福州（1944）、柳州—河池—独山、金华—丽水—青田—温州（1942、1944 两段）、韶关—南雄—大余—赣州、遂川—赣州共七段（雷州半岛一段另列）。

### Changed
- 金山卫登陆事件补上后，#67「金山卫—嘉兴—杭州」起点有了 0km 事件锚点，删除原先的 `route-endpoints.allow.json` 豁免；其余 24 段均在 10km 内找到事件或既有权路线锚点，没有新增豁免。
- 郑州沦陷日期取「至 4 月 23 日相继攻陷郑州」，正文注明 4-19、4-20、4-23 诸说；汕头按 6-21 登陆、6-22 市区沦陷分列；福州两次沦陷分设登陆事件。
- 细菌战与惨案事件标 `routeEvent: false`，不绘路线；所有新增日期、兵力、伤亡、产量数字均标「通行说法，待页码级核对」。

### Docs
- 新增 `docs/plans/2026-11-20-M203-日军战线补全-plan.md`。
- 同步专题 README、实体审计第 7 节、路线审计第 8 节、日期核对清单第 12 节。

### Verify
- `pnpm validate:data`：461 事件 / 268 路线段；全库 1255 / 751。
- `pnpm check:routes --atlas anti-japanese-war`：0 问题。
- `pnpm check:heads --atlas anti-japanese-war`：0 个无来由端点。
- `pnpm typecheck`、`pnpm lint`、`pnpm test` 全部通过。
- `pnpm build:search-index`、`pnpm build:mobile-data` 已重新生成。

---

## [v1.0.156] - 2026-11-20

### Added
- 回答「日本没有在海南登陆吗」：此前专题只有琼崖纵队一侧的事件，缺日军登陆海南的记录。补录 6 个事件：
  - 1939-02-10「日军登陆海南岛」：台湾混成旅团在琼山天尾港登陆，当日攻占海口、府城；
  - 1939-02-10「海口、府城失守」：守军保安第5旅等约 3900 人抵抗后撤往定安山区；
  - 1939-02-14「日军占领三亚、榆林」：日本海军陆战队在三亚湾登陆，占领三亚、榆林、崖城；
  - 1939-02-10「潭口阻击战」：琼崖抗日独立队在潭口渡口阻击东进日军；
  - 1940-03-15「日军占领石碌铁矿」：随后修石碌—八所铁路、八所港，掠夺铁矿资源；
  - 1941-04-10「海南警备府成立」：日本海军把海南岛根据地队升格为海南警备府，作为封锁华南与南进基地。
- 补 4 段路线：日军天尾港—海口、三亚湾—榆林、石碌—八所港（铁矿外运，supply），以及琼崖独立队潭口渡口防御线（defense）。
- 事件补录说明日军占领后的军事统治、机场与据点、资源掠夺、殖民统治与「扫荡」，数字均标「通行说法，待页码级核对」。
- 事件 371 → 377；路线 239 → 243（日军 61 → 64、华南游击队 22 → 23）；全库 1165/721 → 1171/726。
- 新增海南岛日期核对清单（`docs/research/units/anti-japanese-war-date-audit.md` 第 11 节）。

---

## [v1.0.155] - 2026-11-20

### Fixed
- 回答「延安—湘粤支队（南下支队）走到哪里结束」：原路线把终点画在湘粤边（约汝城、仁化一带），
  结束日写 1945-09-02（日本投降签字日），与史实不符。
  - 史实：1944-11-09 由延安出发；1945-01-27 在湖北大悟山与新四军第五师会师；2 月渡长江；
    3 月进入湘鄂赣边；7 月主力继续南下；8-26 进抵广东南雄西北百顺地区，拟与东江纵队会合；
    因国民党军重兵堵截会师未成，8-29 北返；10 月上旬回到鄂豫边大悟山，随后恢复第359旅番号、
    编入中原军区。
  - 路线拆为两段：「延安—南雄（南下）」1944-11-09～1945-08-26，与「南雄—大悟（北返）」
    1945-08-29～1945-10-10，补上北返终点；终点不再用日本投降签字日。
  - 事件「八路军南下支队挺进湘粤」补别名「国民革命军第十八集团军独立第一游击支队」、
    完整时间线、会师未成与北返终点；来源增《近代史研究》2021 年第 5 期黄正林文。
- 八路军 27 → 28 段；抗日战争专题 238 → 239 段；全库 721 → 722 段；事件数不变。

---

## [v1.0.154] - 2026-11-20

### Fixed
- 回答「其他连线有没有类似『辽县—沂水』的情况」：对全库 11 个专题、723 段路线做统一审计，
  按「纯 A—B 名称 + 套话描述 + 跨 >90 天 + 两端异质事件」判据命中 145 段，逐条核对后处理：
  - **删除 3 段抗日假连线**：华南游击队「琼山—五指山」（1938-12～1942-05，五指山根据地
    1943—1944 年才开辟，等于提前五年「到达」）；新四军「云岭—黄桥」「盐城—车桥」
    （黄桥战役由苏北指挥部自苏南渡江发起、车桥战役由第一师在苏中发起，都不是军部从驻地行军）。
  - **删除 2 段明清跨事件叙事线**：「北京—福州」（迁界禁海是北京决策，福州端无对应事件）、
    「成都—武昌」（把保路运动与辛亥革命连成一条线，方向还与史实相反）。
  - **改标活动区域 9 段**：华南 7 段、国民党军第58军/新3军 2 段，名称改为「活动区域 / 转战区域」，
    `segmentType: other`，描述写明「非单次行军路线」。
  - **13 段真实行军线补名称、收紧日期**：大岭山、美合、营救文化名人、白沙、罗浮山、五指山、
    昌感、海陆丰、临高、粤北、粤中、云雾山、高要、尖峰岭、粤赣湘边；八路军「黎城—辽县」
    补黄崖洞—十字岭说明。
- 事件口径：黄桥战役、车桥战役、琼崖抗日根据地、琼崖抗日独立队成立、迁界禁海、保路运动
  标 `extensions.routeEvent = false`；「琼崖抗日根据地」由五指山改回琼山、文昌一带，
  正文写明五指山根据地 1943—1944 年才开辟。
- 华南游击队 23 → 22 段、新四军 5 → 3 段；抗日战争专题 241 → 238 段；明清 144 → 142 段；
  全库 723 → 721 段。事件数不变（抗日 371、明清 154、全库 1165）。
- 新增 `docs/research/units/anti-japanese-war-route-audit.md` 与
  `docs/plans/2026-11-20-M202-全量路线审计-plan.md`，更新专题 README 与实体审计第 6 节。

---

## [v1.0.153] - 2026-11-20

### Fixed
- 回答「为什么从晋冀鲁豫根据地连一条线到山东、成立山东纵队」：删除两条虚构「根据地连线」。
  - 删除「辽县—沂水」（1938-04-02～12-27）：终点落在山东纵队成立点，会被读成八路军主力从太行
    走到山东、就地成立山东纵队；史实是山东纵队由山东本地起义武装（徂徕山、天福山、黑铁山、
    牛头镇等）编成，1938 年没有这样一次从辽县到沂水的行军。
  - 删除「沂水—黎城」（1938-12-28～1941-11-10）：把山东接回太行的虚构回程线。
- 「山东纵队成立」改为建制事件，标 `extensions.routeEvent = false`，不绘路线。
- 黄崖洞保卫战改由本地防御线「黄崖洞兵工厂防御」（1941-11-10，`segmentType: defense`）承接，
  避免删除回程线后事件失去锚点。
- 保留真正入鲁的「黎城—鄄城（第115师主力入鲁）」。
- 八路军层路线 28 → 27；专题路线 242 → 241。事件数不变（371）。
- 新增 `docs/plans/2026-11-20-M201-删除虚构山东连线-plan.md`，更新八路军梳理文档与实体审计第 16 项。

---

## [v1.0.152] - 2026-11-20

### Changed
- 回答「第四纵队挺进冀东后哪支部队去山东、山东纵队由谁成立」：
  - 新增「第115师主力入鲁」（1939-03-01～04），陈光、罗荣桓率师部及第686团由晋西入鲁，
    首战樊坝；说明 1943 年 3 月与山东军区合并为新的山东军区；
  - 改写「山东纵队成立」，写清它由山东本地起义武装（徂徕山、天福山、黑铁山、牛头镇等）
    编成，不是主力入鲁后组建；补主官、辖 10 个支队又 3 个团、2.45 万人，
    以及 1942-08 改称山东军区、1943-03 与第115师合并的沿革；
  - 「第四纵队挺进冀东」补 1939-02-07 改编为冀热察挺进军（萧克），第四纵队番号撤销，
    说明该部此后转战平西、平北、冀东，未进入山东。
- 新增 1 段路线「黎城—鄄城（第115师主力入鲁）」。
- 八路军层事件 33 → 34，路线 27 → 28；专题事件 370 → 371，路线 241 → 242。
- 新增 `docs/plans/2026-11-20-M200-山东纵队与115师入鲁-plan.md`。

---

## [v1.0.151] - 2026-11-20

### Changed
- 补八路军战略转变的决策节点，回答「太原失守后是否转向敌后、开展山地游击战并迅速向平原发展」：
  - 新增「洛川会议」（1937-08-22～25），说明「独立自主的山地游击战」在 1937 年 8 月已确定，
    不是太原失守后才提出；
  - 新增「石拐会议」（1937-11-11～13），太原失守后八路军总部部署三师分兵，
    120 师晋西北、115 师主力晋西南、129 师与 115 师一部晋冀豫；
  - 新增「《关于平原游击战的指示》」（1938-04-21），向平原发展在 1938 年 4 月才成为具体部署；
  - 新增「第129师挺进冀南」（1938-04-26～05-07），徐向前率路东纵队进入南宫平原。
- 补 3 段路线：延安—洛川、石拐—辽县、辽县—南宫；平原游击战指示属政治决策，标
  `extensions.routeEvent = false`。
- 八路军层事件 29 → 33，路线 24 → 27；专题事件 366 → 370，路线 238 → 241。
- 原有 5 条事件补 `relatedIds` 回链（八路军成立、晋察冀军区、晋绥、晋冀鲁豫、山东纵队）。
- 新增 `docs/plans/2026-11-20-M199-八路军战略转变节点-plan.md`。

---

## [v1.0.150] - 2026-11-20

### Changed
- 梳理八路军层：事件 11 → 29，路线 9 → 24，补上 1939、1943、1944、1945 年空白。
- 新增 18 个事件：雁门关伏击战、夜袭阳明堡、七亘村伏击战、晋察冀边区行政委员会成立、
  神头岭伏击战、响堂铺伏击战、长乐村战斗、八路军第四纵队挺进冀东、第120师挺进冀中、
  齐会战斗、黄土岭战斗、关家垴战斗、狼牙山五壮士、冀中反「五一大扫荡」、韩略村战斗、
  八路军南下支队挺进湘粤、《对日寇的最后一战》发表、八路军发动大反攻。
- 改写原有 11 条事件，补番号、主官、过程与影响；战果数字统一标「通行说法，待页码级核对」。
- 新增 15 段作战线：兴县—雁门关、辽县—阳明堡、辽县—七亘村、辽县—神头岭、
  神头岭—响堂铺、响堂铺—长乐村、阜平—冀东、兴县—河间、河间—齐会、阜平—黄土岭、
  黄土岭—狼牙山、齐会—冀中、辽县—关家垴、辽县—韩略村、延安—湘粤。
- 事件 348 → 366，路线 223 → 238；`check:routes` 0 问题，`check:heads` 0 个无来由端点。
- 新增 `docs/research/units/anti-japanese-war-eighth-route-army.md` 与
  `docs/plans/2026-11-20-M198-八路军事件梳理-plan.md`。

---

## [v1.0.149] - 2026-11-20

### Fixed
- 发布后 atlas 数据文件（`manifest.json`、`events.json`、`routes/*.geojson`）受
  `Cache-Control: max-age=3600` 影响，最多 1 小时仍可能读到旧数据；`HttpDataSource`
  改为 `fetch(..., { cache: 'no-cache' })`，每次向服务器校验，未变返回 304。
- 新增 `packages/shared/src/__tests__/source.test.ts` 断言该选项。
- 新增 `docs/plans/2026-11-20-M197-数据文件缓存校验-plan.md`。

---

## [v1.0.148] - 2026-11-19

### Changed
- 新增实体「国际组织与多边会议」（`international`，无路线），把行为主体是国联/国际会议的
  三条事件从「中国政府」层移出：国联李顿调查团赴东北、国联大会通过李顿报告书、九国公约会议。
- 补 1931-09-21「中国向国联申诉九一八事变」，说明李顿调查团的由来：中国政府是申诉方与
  当事国，但不是调查团的派遣方。
- 补 1933-02-24「国联大会通过李顿报告书」，写清国联决议、日本退出国联与进攻热河的关系。
- 李顿事件正文补顾维钧的顾问（襄助委员）身份与调查团五国组成。
- 实体 9 → 10，事件 346 → 348，路线仍 223。
- 新增 `docs/plans/2026-11-19-M196-李顿调查团改挂国际组织层-plan.md`。

---

## [v1.0.147] - 2026-11-19

### Changed
- 「察哈尔民众抗日同盟军成立」补三人身份：冯玉祥为中原大战后下野的西北军领袖
  （无军政实职，被推为总司令）；吉鸿昌为原第22路军总指挥、冯玉祥旧部，
  1932 年加入中共，任前敌总指挥兼第2军军长；方振武为原国民军将领、
  前安徽省主席，任北路前敌总司令。
- 「收复多伦」补方振武、吉鸿昌的指挥关系与吉鸿昌的党籍、职务。
- 不再把 1935 年后的「军事委员会副委员长」误安到 1933 年的冯玉祥头上。
- 新增 `docs/plans/2026-11-19-M195-察哈尔同盟军领导人身份-plan.md`。

---

## [v1.0.146] - 2026-11-19

### Changed
- 图例统一显示「X 个事件 · Y 段」（英文 `X events · Y segments`），不再只显示段数；
  有事件无路线的实体也显示「N 个事件 · 0 段」，不再是「—」。
- 计数改为第二行显示，实体名占满第一行，避免长计数截断「国民党军正面战场」等名称。
- 新增 `legend.counts` 文案；新增
  `docs/plans/2026-11-19-M194-图例统一显示事件与段数-plan.md`。

---

## [v1.0.145] - 2026-11-19

### Fixed
- 图例里「中国政府」的段数显示为「—」：该实体只有 32 条事件、0 段路线，
  而图例只统计路线段数。改为：
  - 有路线时显示「N 段」；
  - 无路线但有事件时显示「N 个事件」；
  - 两者都没有时才显示「—」。
- 新增 `common.event` 单数文案（中英文）。
- 新增 `docs/plans/2026-11-19-M193-图例段数显示修复-plan.md`。

---

## [v1.0.144] - 2026-11-19

### Changed
- 把「中国政府与民众」拆为两个实体：
  - 「中国政府」（`china-resistance`，保留 ID 以兼容旧分享链接）；
  - 「中国民众」（`china-people`，新增）。
- 9 条民众事件改挂「中国民众」：一二·九、一二·一六、七君子、中国民主政团同盟、
  南京安全区与国际救援、察哈尔民众抗日同盟军成立、收复多伦、西南联大、重庆防空与救灾。
- 冀东防共自治委员会成立改挂 `japanese-invasion`（日本扶植的傀儡政权）。
- 察哈尔同盟军路线由 `china-resistance` 改挂 `china-people`，新增
  `routes/china-people.geojson`，删除 `routes/china-resistance.geojson`。
- 实体 8 → 9；事件仍 346，路线仍 223。
- 新增 `docs/plans/2026-11-19-M192-中国政府与中国民众拆分-plan.md`。

---

## [v1.0.143] - 2026-11-19

### Fixed
- 原「南京沦陷与南京大屠杀」把军事沦陷与屠杀合成一条；拆为：
  - 「南京沦陷」（1937-12-13，`japanese-invasion` + `kmt-forces`，战役，保留原路线端点）；
  - 「南京大屠杀」（1937-12-13 → 1938-01-31，`japanese-invasion`，惨案）；
  - 「南京安全区与国际救援」（1937-11-22 → 1938-02-28，`china-resistance`，政治/人道）。
- 事件 344 → 346，路线仍 223。
- 新增 `docs/plans/2026-11-19-M191-南京沦陷与大屠杀拆分-plan.md`。

---

## [v1.0.142] - 2026-11-19

### Fixed
- 原「重庆大轰炸」把日军战略轰炸与重庆防空、疏散、救火、救济合成一条，
  主体不清；拆为：
  - 「重庆大轰炸」（1938-02-18 → 1943-08-23，`japanese-invasion`，惨案）；
  - 「重庆防空与救灾」（同日，`china-resistance`，政治/社会）。
- 事件 343 → 344，路线仍 223。
- 新增 `docs/plans/2026-11-19-M190-重庆大轰炸拆分-plan.md`。

---

## [v1.0.141] - 2026-11-19

### Fixed
- 按「单一事件按主要行为主体」原则继续拆分：
  - 「河北事件与何梅协定」→「河北事件」（1935-06-09，`japanese-invasion`）
    +「何梅协定」（1935-07-06，`japanese-invasion` + `china-resistance`）；
  - 「张北事件与秦土协定」→「张北事件」（1935-06-05，`japanese-invasion`）
    +「秦土协定」（1935-06-27，`japanese-invasion` + `china-resistance`）。
- 《塘沽协定》《淞沪停战协定》由只挂 `china-resistance` 改为
  `japanese-invasion` + `china-resistance`，体现双边协定。
- 事件 341 → 343，路线仍 223。
- 新增 `docs/plans/2026-11-19-M189-河北张北事件拆分-plan.md`。

---

## [v1.0.140] - 2026-11-19

### Fixed
- 原「察东事件与大滩口约」把 1935 年 1 月日军挑衅与 2 月中日口约合成一条，
  主体不清；拆为：
  - 「察东事件」（1935-01-15，`japanese-invasion`，军事）；
  - 「大滩口约」（1935-02-02，`japanese-invasion` + `china-resistance`，外交）。
- 事件 340 → 341，路线仍 223。
- 新增 `docs/plans/2026-11-19-M188-察东事件拆分-plan.md`。

### Changed
- 实体归属原则明确为「单一事件按主要行为主体，双边协定可同时挂双方实体」。

---

## [v1.0.139] - 2026-11-19

### Added
- 抗日战争「中国政府与民众」层补 23 条 1934—1941 年事件（18 → 41）：
  - 战前建设：新生活运动、国民经济建设运动、法币改革；
  - 战时体制：庐山谈话、国防最高会议、迁都重庆、抗战建国纲领、国民参政会、
    三民主义青年团、国民精神总动员、重庆定为陪都；
  - 经济与社会：花园口决堤、工厂西迁、西南联大、田赋征实、重庆大轰炸；
  - 政治与外交：五届五中全会、汪伪国民政府成立与重庆讨伐、中国民主政团同盟、
    美国租借法案援华、飞虎队、国联申诉、九国公约会议。
- 新增 `docs/plans/2026-11-19-M187-国民政府战时体制与外交事件补录-plan.md`。

### Changed
- 事件 317 → 340，路线仍 223（新增事件均为政治/外交/体制事件，不绘线）。
- 花园口决堤、五届五中全会、汪伪政权等争议事件如实写明后果与立场。

---

## [v1.0.138] - 2026-11-19

### Added
- 长城抗战补具体部队：
  - 「第29军与罗文峪战斗」（1933-03-16 → 03-18，暂编第2师刘汝明部）；
  - 「第32军与冷口战斗」（1933-03-09 → 04-11，商震部第139师等）。
- `kmt-forces` 新增「第29军：喜峰口—罗文峪」「第32军：冷口—迁安防线」两段。

### Changed
- 「喜峰口战斗」改名「第29军与喜峰口战斗」，「古北口战斗」改名「第17军与古北口战斗」。
- 「长城抗战」总事件补参战序列：第29军（第37、38、暂编第2师）、第17军（第2、25、83师）、
  第32军、东北军第67/53军及主官。
- 事件 315 → 317，路线 221 → 223。
- 新增 `docs/plans/2026-11-19-M186-长城抗战部队细化-plan.md`。

---

## [v1.0.137] - 2026-11-19

### Added
- 补齐三处只有日方条目的战役的中国守军事件：
  - 第4军防守长沙（1944-06-18 → 06-19，张德能部，长衡会战）；
  - 第12集团军防守广州（1938-10-12 → 10-21，余汉谋部，增城—广州外围）；
  - 第15军防守洛阳（1944-05-09 → 05-25，武庭麟部，豫中会战）。
- `kmt-group-armies` 新增「第12集团军：广州—增城防线」一段。
- 新增 `docs/plans/2026-11-19-M185-抗日战争中国守军事件补齐-plan.md`。

### Changed
- 事件 312 → 315，路线 220 → 221。
- 实体归属审计文档与日期核对清单同步补入三条事件。

---

## [v1.0.136] - 2026-11-19

### Fixed
- 全量审计抗日战争事件实体归属：藏本英明事件（日本外交官失踪）由「中国政府与民众」
  改为 `japanese-invasion`；中国军队攻克畹町补 `kmt-group-armies` 并新增
  「第11集团军：龙陵—畹町」路线。
- 第1、第6、第4战区的路线与事件从「国民党军集团军」层移到 `kmt-forces`（正面战场层），
  修正战区级内容放在集团军层的错位。
- 删除两条重复事件：「第4战区桂柳反攻」（与「桂柳反攻」同日同地）、
  「日军进攻河南」（与「日军进攻豫中」同日同地），并合并说明。

### Changed
- `kmt-forces` 的「湘潭—长沙—新墙河」与「昆明—滇西」两条长期线改名为
  「第9战区：…防线」「远征军：…防线」，明确是防线而非行军。
- 事件 314 → 312，路线 219 → 220。
- 新增 `docs/research/units/anti-japanese-war-entity-audit.md` 与
  `docs/plans/2026-11-19-M184-抗日战争实体归属全量审计-plan.md`。

---

## [v1.0.135] - 2026-11-19

### Fixed
- 天羽声明（日本外务省声明）误挂在「中国政府与民众」层，改为只属 `japanese-invasion`。
- 日本宣布无条件投降误挂「中国政府与民众」，改为只属 `japanese-invasion` + `allied-forces`；
  日本签署投降书原本已只属这两层，保持一致。

### Added
- 新增「中国战区受降仪式」（1945-09-09，南京，何应钦接受冈村宁次投降），
  归 `kmt-forces` + `china-resistance`，补上中国自身在战争结束时的政治/军事行动。
- 新增 `docs/plans/2026-11-19-M183-政治外交事件实体归属校正-plan.md`。

### Changed
- 专题时间范围结束日期由 1945-09-02 改为 1945-09-09，`manifest.json` 与
  `data/atlases/index.json` 同步；副标题「1931—1945」与封面年份不变。

---

## [v1.0.134] - 2026-11-19

### Fixed
- 时间轴范围只按路线计算，导致「中国政府与民众」层的塘沽协定（1933-05-31）被裁掉：
  该层拆分后只剩 1933-06-20 起的察哈尔同盟军路线，早于它的政治、外交事件无法显示。
  新增 `datasetDateRange()`，把当前图层的路线与事件一起纳入范围；事件即使
  `routeEvent: false` 也参与，因为事件节点仍显示在时间轴上。

### Changed
- Web 与移动端 `useAtlasStore` 改用 `datasetDateRange`，函数改名 `timelineForActiveLayers`；
  保留 `routeDateRange` 供已有调用与测试使用。
- 新增 `docs/plans/2026-11-19-M182-时间轴范围纳入事件-plan.md`。

### Added
- `timeline-core` 新增单测：事件早于首条路线时，范围起点取事件日期。

---

## [v1.0.133] - 2026-11-19

### Changed
- 部队战史线研究稿补「剩余项结论」：第74军 1944 年在常德/湘西、未守衡阳；
  第18军 1944 年在鄂西、未参加河南作战；第58军/新3军长衡会战具体阵地待核。
- 日期核对清单补「已查结论」，明确不再为上述三项新增猜测性路线。
- 纯文档变更，不新增事件或路线。

---

## [v1.0.132] - 2026-11-19

### Added
- 抗日战争新增 8 条部队事件：第74军参加第三次长沙会战、第18军第11师与石牌保卫战、
  第18军参加湘西会战、第58军成立、第58军抵赣北、新3军成立、新3军参加崇阳战斗、
  第58军参加第三次长沙会战。
- `kmt-forces` 新增 4 段战史线：第58军（昆明—贵阳—长沙—南昌；南昌—高安—长沙—平江）、
  新3军（长沙—崇阳；崇阳—长沙—高安）。
- 新增 `docs/research/units/anti-japanese-war-date-audit.md` 日期核对清单
  与 `docs/plans/2026-11-19-M181-抗日战争部队战史线第四批与日期核对-plan.md`。

### Fixed
- 原「第10军与常德会战」番号错误：常德守城的是第74军第57师（余程万），
  改为「第74军第57师与常德会战」，并更新两条引用。

### Changed
- 第18军「石牌—沅陵」补常德途经点，改名「石牌—常德—沅陵」。

---

## [v1.0.131] - 2026-11-19

### Added
- 抗日战争新增 4 条部队事件：第74军参加南昌会战、第74军驻防高安、第60军回滇、
  第60军防守滇南。
- `kmt-forces` 新增 7 段部队战史线：第74军南昌—高安、高安—长沙；第18军上海—罗店—武汉；
  第60军禹王山—武汉、武汉—靖安、靖安—昆明、昆明—蒙自—河口。
- 新增 `docs/plans/2026-11-19-M180-抗日战争部队战史线第三批-plan.md`。

### Changed
- 第74军「德安—长沙」拆为「德安—南昌」+「南昌—高安」+「高安—长沙」，
  补上 1939 年南昌会战段，再接原有「长沙—高安—上高」。
- 第18军补上 1937 年淞沪罗店至 1938 年武汉段，接原有「武汉—石牌」。
- 第60军补上禹王山突围、赣北驻防、1940 年回滇与滇南防御。

---

## [v1.0.130] - 2026-11-19

### Added
- 抗日战争新增 11 条部队事件：川军出川、川军第22集团军参加娘子关战斗、川军第20军抵淞沪、
  滕县保卫战、桂军出桂、蕴藻浜反击战、禹王山战斗、第十九路军调驻福建、福建事变、
  万家岭大捷、新22师退往印度。
- `kmt-forces` 新增 12 段部队战史线：川军第22集团军（成都—宝鸡—太原—娘子关—滕县）、
  川军第20军（重庆—宜昌—武汉—上海）、桂军第21集团军（桂林—武汉—徐州—上海；
  上海—六安）、第十九路军（上海—杭州—福州）、第74军（上海—南京—兰封—万家岭—长沙）、
  第5军新22师（同古—曼德勒—密支那—雷多）、第60军（徐州—禹王山）。
- 新增 `docs/plans/2026-11-19-M179-抗日战争部队战史线第二批-plan.md`。

### Changed
- 滇军出滇线补贵阳、长沙、武汉三个途经点，终点日期改为抵徐州（1938-04-20）。
- `kmt-group-armies` 的「徐州—滕县」改名为「第22集团军：徐州—滕县」，补滕县保卫战说明。

---

## [v1.0.129] - 2026-11-19

### Added
- 抗日战争新增 13 条事件：第74军组建、第5军组建、第5军移驻云南、第5军抵达同古、
  第200师退回滇西、第74军调防常德、第74军调防湘西、第18军调防石牌、第18军调防湘西、
  新6军空运芷江、张自忠殉国、第1战区豫中会战、第4战区桂柳反攻。
- 新增 22 段部队战史线：`kmt-forces` 15 段（第74军 4、第5军 4、第18军 2、九一八、
  一·二八、兰封、衡阳城防、新6军空运），`kmt-group-armies` 7 段（第33集团军 4、
  第1战区、第6战区、第4战区），`eighth-route-army` 1 段（第129师正太路破袭）。
- 新增 `docs/research/units/anti-japanese-war-main-forces.md` 与
  `docs/plans/2026-11-19-M178-抗日战争实体拆分-plan.md`。

### Changed
- 删除「中国抗战力量」层 10 段跨战区叙事转场线（含用户指出的「阳泉—昆明」1765 km 直线），
  不再把八路军、远征军、第9战区等不同部队串成一条线。
- `china-resistance` 收缩为「中国政府与民众」，路线 32 段 → 1 段（察哈尔民众抗日同盟军），
  只保留政治、外交、民众运动事件；35 条军事事件按参战部队改挂
  `kmt-forces`、`kmt-group-armies`、`eighth-route-army`、`allied-forces`。
- 第74军、第5军、第10军、第33集团军、第18军各自有独立战史线，可读出
  「从哪里来、到哪里去」。

### Fixed
- 第5军昆仑关路线终点与「第5军与昆仑关战役」事件坐标由 `108.2, 22.9`（南宁附近）
  改为昆仑关 `108.65, 23.05`。
- 专题 README 规模与实体说明同步为 290 事件 / 196 路线段 / 8 实体。

---

## [v1.0.128] - 2026-11-19

### Added
- 抗日战争专题补 26 条事件（251 → 277）与 12 段路线，填上「伪满洲国成立」（1932-03-01）至
  「一二·九运动」（1935-12-09）之间 1378 天的空档：
  锦州沦陷、李顿调查团、淞沪停战协定、榆关抗战、热河作战、承德失守、长城抗战、
  喜峰口与古北口战斗、察哈尔民众抗日同盟军与收复多伦、塘沽协定、溥仪称帝、天羽声明、
  藏本英明事件、察东事件与大滩口约、何梅协定、秦土协定、冀东防共自治委员会、
  一二·一六运动、华北自治与冀察政务委员会、两广事变、绥远抗战（红格尔图、百灵庙大捷）、
  七君子事件。
- 新增 `docs/plans/2026-11-19-M177-抗日战争1932-1936补录-plan.md`。

### Changed
- 日军进攻线补沈阳—锦州、锦州—山海关、热河、古北口、喜峰口与绥远六段，不再从
  `1932-02-05 哈尔滨` 直接跳到 `1937-07-07 北平`；中国军队补长城防御、察哈尔同盟军与
  晋绥军绥远反击等六段。
- 1933、1934 年事件数由 0 分别增至 9、3；伪满成立至一二·九之间相邻事件间隔均小于 250 天。
- `anti-japanese-war/manifest.json` 的 `updatedAt` 更新为 2026-11-19，`dataVersion` 随之刷新。

### Fixed
- 修正专题 README 中过时的规模描述（29 事件 / 24 路线段 / 3 实体 → 277 / 204 / 8）。

---

## [v1.0.127] - 2026-11-19

### Added
- 玄奘专题补 4 条事件（76 → 80），填上迦湿弥罗驻锡期 `631-12-01 → 633-05-01`：
  「僧称授《俱舍》」（632-02，阇耶因陀罗寺，从僧称学《俱舍论》《顺正理论》）、
  「第四次结集」（632-07，迦腻色迦王时五百罗汉造《大毗婆沙论》之地）、
  「学因明声明」（632-11，兼学因明、声明并抄经）、
  「辞别迦湿弥罗」（633-02，学成出山南下磔迦）。
- 新增 `docs/plans/2026-11-19-M176-玄奘迦湿弥罗事件补充-plan.md`。

### Changed
- 「迦湿弥罗」`endDate` 0633-02-28 → 0633-01-31，与二月初辞行自洽；
  该段最长间隔 517 天 → 137 天。
- 修正该事件英文描述：僧称原写作 `Sanghasena`，与中文不符，改为 `Sengcheng`。
- `xuanzang/manifest.json` 的 `updatedAt` 更新为 2026-11-19，`dataVersion` 随之刷新。

---

## [v1.0.126] - 2026-11-18

### Fixed
- 本地 dev server 打不开（`http://localhost:5173/` 时而可用、`http://127.0.0.1:5173/` 始终不通）：
  `apps/web/vite.config.ts` 的 `server` 只写了 `port`，Vite 默认绑定 `localhost`，
  在 macOS 上解析为 `::1`，因此 IPv4 回环访问必然失败；而端口被占用时又没有
  `strictPort`，会静默换到 5174，造成「服务在跑、5173 却打不开」。
  改为 `host: '127.0.0.1'` + `strictPort: true`，端口冲突时直接报错而不是漂移。
- 说明：本次不是代码回归，而是 `pnpm dev` 进程已退出（后台进程随上一会话结束），
  叠加上述地址解析问题，表现为「又访问不了了」。

---

## [v1.0.125] - 2026-11-18

### Added
- 玄奘专题补 16 条事件（60 → 76），把时间轴上两段最长的空白填上：
  - **那烂陀五年**（634-02 → 639-02）七条：「戒贤开讲」（634-03，戒贤年逾百岁重开讲席）、
    「研习瑜伽」（634-11）、「通习诸论」（635-07）、「听《顺正理论》」（636-04）、
    「造《会宗论》」（637-02，破师子光）、「论破外道」（637-09，顺世外道悬义四十条）、
    「辞别戒贤」（638-06）。全部 `routeEvent: false`（驻寺不移动）。
  - **五印度巡礼**（639-10 → 642-06）九条：「伊烂拏钵伐多」（640-01）、「耽摩栗底」（640-05）、
    「羯陵伽」（640-08）、「驮那羯磔迦」（640-12）、「建志城」（641-03）、「秣罗矩吒」（641-06）、
    「摩诃剌佗」（641-10）、「伐腊毗」（642-01）、「还归那烂陀」（642-04）。
- 新增 `docs/plans/2026-11-18-M175-玄奘五印度巡礼事件补充-plan.md`。

### Changed
- 18 号「那烂陀—五印度巡礼—那烂陀」环线在憍赏弥之后补 10 个节点（东海岸 → 达罗毗荼 →
  西海岸 → 摩腊婆 → 北归），**起点终点不变，段数仍 24**；因此 M172 划定的
  「南印度巡礼不做」边界作废——前提是「每次巡礼要独立成段」，而环线加节点不增段。
- 「那烂陀求学」`endDate` 0638-12-31 → 0638-05-31，与六年六月辞行自洽。
- 「那烂陀著论」改为以《制恶见论》为主，《会宗论》前移到 637-02 独立成条。
- 重算 76 条事件的 `relatedIds`，串起「求学 → 辞行 → 巡礼 → 北归 → 著论」的因果。

---

## [v1.0.124] - 2026-11-18

### Added
- 玄奘归国一路补 6 条事件（54 → 60），把 643—645 的四段空白填上：
  「迦毕试抄经」（643-09，失经后停五十余日，遣人往乌仗那抄补）、
  「波谜罗川」（644-01，葱岭大龙池，《西域记》卷十二）、
  「斫句迦」（644-02，今叶城，疏勒—于阗之间）、
  「太宗敕迎」（644-06，太宗答敕「可即速来，与朕相见」，专题第 2 条外交事件）、
  「尼壤」（644-07，大泽中的南道要站）、「河西归途」（644-12，州县承敕供给）。
- 新增 `docs/plans/2026-11-18-M174-玄奘归国路线事件补充-plan.md`。

### Changed
- 路线 22/23/24 补节点并同步名称：活国—葱岭—朅盘陀—疏勒—**斫句迦**—于阗、
  于阗—**尼壤**—若羌—敦煌、敦煌—**凉州**—兰州—长安；段数仍 24。
- 于阗停留 `endDate` 0644-08-31 → 0644-06-30，与七月初经尼壤东行自洽。
- 重算 `relatedIds`，串起「失经 → 抄经 → 活国 → 葱岭 → … → 敦煌 → 河西 → 长安」。

---

## [v1.0.123] - 2026-11-18

### Added
- 玄奘专题补 2 条事件（52 → 54），填上 `639-10-10` 到 `643-02-01` 之间的叙事空档：
  「那烂陀著论」（642-06，著《会宗论》破师子光、《制恶见论》破般若毱多，
  戒日王读后遣使迎请）、「迦摩缕波」（643-01，鸠摩罗王迎请，二王会于恒河，同赴曲女城）。
- 新增 `docs/plans/2026-11-18-M173-玄奘时间线空档补充-plan.md`。

### Changed
- 19 号路线由「那烂陀—曲女城」改为「那烂陀—迦摩缕波—曲女城」
  （0642-12-10 → 0643-02-01），补上东行折返；路线总数仍 24 段。
- 重算 54 条事件的 `relatedIds`，串起「求学 → 著论 → 迦摩缕波 → 曲女城大会」的因果。
- 空档说明：剩下的 `639-10 ～ 642-06` 是巡礼五印度的后半段（南印度、东印度、僧伽罗），
  仍按 M172 的边界留作后续专题深化，不在本轮补。

---

## [v1.0.122] - 2026-11-18

### Fixed
- `data/atlases/index.json` 的玄奘专题标签与 `manifest.json` 不同步：上一步只更新了专题说明
  与标签，但首页专题卡读的是 `index.json`（`build:search-index` 只回写 `dataVersion`，
  不重建元数据）。补上「中亚」「印度」「求法」。

---

## [v1.0.121] - 2026-11-18

### Added
- 新增事件分类「求法」（Pilgrimage），玄奘专题 52 条重分为 行军 27 / 求法 24 / 外交 1，
  筛选器不再被单一「行军」占满。

### Changed
- 28 条缺别名的事件补齐「古名 + 今地 + 英文」（如秣兔罗 / 摩偷罗 / 马图拉、
  波罗奈 / 婆罗痆斯 / 瓦拉纳西 / 鹿野苑），52 条全部有 `aliases`；
- 52 条全部补 `relatedIds`（行程前后 + 高昌↔活国、那烂陀↔求学、曲女城大会↔无遮大会等
  关键因果）与 `importance`（3 = 11 条主线节点，1 = 阇烂达罗等途经点）；
- 时长事件补 `endDate`：那烂陀求学 634-02 → 638-12、曲女城大会 18 日、
  钵罗耶伽无遮大会 75 日、于阗停留 644-03 → 08；
- 6 段路线加地图短标注：长安—河西、西域北道、中亚、北印度、那烂陀·五印度、归途；
- `manifest.description` 去掉「M18 示例初稿」，改为编年依据与「日期为研究推定」说明；
  `tags` 增补「中亚」「印度」「求法」，`license` 改为 CC-BY-4.0。

---

## [v1.0.120] - 2026-11-18

### Added
- 玄奘专题新增 10 条求学与归途事件（42 → 52）：
  「至那仆底」（633-05，「汉封」与汉王子传说）、「阇烂达罗」（633-07，从月胄学《众事分毗婆沙》）、
  「王舍城」（639-03，灵鹫山、竹林精舍、七叶窟）、
  「那烂陀求学」（634-02 → 638-12，从戒贤学《瑜伽师地论》五年，通三藏「十德」）、
  「曲女城大会」（643-02，十八日无人能破，尊为「大乘天」）、
  「钵罗耶伽无遮大会」（643-03，七十五日，会后辞归）、
  「信度河失经」（643-08，五十夹经本落水，《西游记》湿经原型）、
  「活国」（643-12，闻高昌已灭，改走天山南道）、
  「朅盘陀」（644-01，葱岭与「汉日天种」传说）、「佉沙（疏勒）」（644-02）。

### Changed
- **时间线校订**：曲女城大会 633 → 643、启程归国 635 → 643（地点那烂陀 → 钵罗耶伽）、
  于阗 643 → 644、那烂陀入寺 632 → 634、北印度游学与五印度巡礼整体后移
  （秣兔罗 / 萨他泥湿伐罗 → 633；摩揭陀以下巡礼 → 639）；迦湿弥罗改为住约两年
  （631-12 → 633-02，`routeEvent: false`）。
- **17 条事件 id 随日期重命名**（如 `nalanda-632-01` → `nalanda-634-01`、
  `return-635-01` → `return-643-05`），旧分享链接中的 `event=` 会回落到专题默认视图。
- **路线 20 → 24 段**：拆出曲女城—那烂陀、那烂陀—曲女城（大会）、曲女城—钵罗耶伽；
  巡礼段改为那烂陀出发并返回那烂陀的环线；归途不再穿喜马拉雅、不经高昌，
  改为钵罗耶伽—憍赏弥—呾叉始罗—信度河—迦毕试—活国—葱岭—朅盘陀—疏勒—于阗—若羌—敦煌—长安。
- 事件正文去掉「地名采用古今对照，待史料校订」占位句；关键事件的正文补入
  《大唐西域记》《大慈恩寺三藏法师传》的具体记载。

---

## [v1.0.119] - 2026-11-18

### Added
- 玄奘专题新增 5 条去程 / 归途过程事件（37 → 42）：
  「莫贺延碛」（630-01-10，沙河失水、五天四夜、「宁可就西而死」）、
  「伊吾」（630-01-20，汉僧抱泣、高昌遣使来迎）、
  「大清池」（630-09-01，《西域记》「洪涛浩汗，惊波汩㴔」）、
  「怛罗斯」（630-11-01，千泉—怛罗斯—赭时—撒马尔罕）、
  「敦煌」（644-10-01，归途经沙州再次上表）。

### Changed
- 4 段路线补上事件落点：玉门关—莫贺延碛—伊吾—高昌、凌山—大清池—碎叶、
  碎叶—怛罗斯—赭时—撒马尔罕、于阗—若羌—敦煌—兰州—长安（去掉绕经高昌）。
- `docs/plans/2026-11-18-M172-玄奘专题事件扩充-plan.md`：提交拆分由 4 个改为 3 个，
  说明 Phase 0 改日期后归途路线必须同步落地。

### Docs
- 新增本计划与对话档案；本轮不改时间线（曲女城 633、归国 635 留待 C2 校订）。

---

## [v1.0.118] - 2026-11-18

### Fixed
- 1424-08-15 原先重复了两条同义事件（「仁宗停止下西洋」与新增的「罢西洋宝船」）。
  合并为一条「罢西洋宝船」，保留原 id 以维持 `relatedIds` 引用，正文改用《明仁宗实录》
  即位诏原文。专题事件 132 → 131。

---

## [v1.0.117] - 2026-11-18

### Added
- 补齐此前暂缓的结局类事件，全部落到实录原文：
  「罢西洋宝船」（1424-08-15，仁宗即位诏「下西洋诸番国宝船，悉皆停止」）、
  「郑和守备南京」（1425-02-08，《明仁宗实录》卷七上「命太监郑和领下番官军守南京」）、
  「宣德重启下西洋」（1430-06-29，《明宣宗实录》卷六七遣郑和、王景弘赍诏谕二十国）、
  「王景弘领队归国」（1433-06-20，郑和卒后由王景弘率队，七月初六抵南京）。
  专题事件 128 → 132。

### Changed
- 「郑和卒于古里」补入卒地争议：注出《非幻庵香火圣像记》依据，并记陈平平（2014）
  据《洪公寿葬铭》提出的异议与「卒于南京」说，标 `extensions.disputed`。
- 专题说明新增「结局」条：1433 年后不复出洋，《殊域周咨录》「至正统初复禁」，
  成化年间刘大夏藏匿出使水程一事（超出时间轴，故不入事件）。

---

## [v1.0.116] - 2026-11-18

### Added
- 郑和专题新增 3 张 AI 生成事件配图（1600×900，右下角保留「豆包 AI 生成」水印）：
  宝船与龙江船厂（宝船尺度与船型）、过洋牵星（火长以牵星板测北极星）、
  麒麟贡使（榜葛剌所贡长颈鹿入宫）。图片下方注明「豆包 AI 生成（示意图）· 非史实图像」。

### Changed
- `scripts/aigc-labels.ts` 从「只管封面」扩展为「封面 + 事件配图」：新增 `figures` 登记、
  自动注入 `TC260:AIGC`（`ProduceID = atlas-figure-<专题>-<事件>`）、按内容哈希重命名为
  `fig-<md5>.jpg`，并校验尺寸、哈希文件名、登记一致性与「登记了却无人引用」的反向情况；
- `docs/guides/ai-content-labeling.md` 同步口径：应用内 AI 内容由「11 张封面」改为
  「11 张封面 + 3 张事件配图」，提审话术与维护流程一并更新；
- 移动端内置图片由 11 张增至 14 张。

---

## [v1.0.115] - 2026-11-18

### Added
- 郑和专题新增 18 条事件（110 → 128），补上「船队怎么做、怎么导航、带了什么、凭什么制度」四层：
  宝船队编成（62 艘 / 27,800 人）、王景弘副使、侯显陆路使乌思藏、马欢与巩珍随行、
  通事火长医官、水罗盘针路、过洋牵星、宝船尺度、郑和航海图、丝绸瓷器铁器出口、
  苏麻离青、榜葛剌贡麒麟、狮子鸵鸟、勘合与回赐、永乐通宝、十六国使臣还国、返航所载。
- 39 段航线上线地图短标注（起航 / 南洋·锡兰 / 西航·古里 / 忽鲁谟斯·阿丹 / 东非 / 归程 /
  分䑸·爪哇 / 分䑸·天方），并自动取折线中点作 `labelPoint`。
- 新增路线分段类型 `detachment`（点线），第一、七次的爪哇·旧港支队与第七次的天方支队
  改用它，与主队虚线区分。
- 专题说明补三条：分䑸图例、船队与人物、考古与争议（含碑刻、宝船厂遗址、梁庄王墓与
  宝船尺度争议）。

### Changed
- 事件分类由 4 类细化为 12 类：航行 / 外交 / 册封 / 朝贡 / 贸易 / 制度 / 建制 / 技术 /
  人物 / 战斗 / 政策 / 宗教；外交占比由 70% 降到 20%，筛选恢复可用。
- 110 条事件补齐地名古今对照 `aliases`（马六甲 / 科泽科德 / 霍尔木兹 / 摩加迪沙 / 斯里兰卡…），
  搜索不再只认古地名。
- 补齐全部事件的 `relatedIds`（前一件事、后一件事、同地事件）与 `importance` 分级；
  锡兰山之战、满剌加官厂、苏干剌之役、郑和之卒补 `endDate`。

### Deferred
- 结局类 4 条（洪熙罢宝船、宣德重启、王景弘领队归国、下西洋终止）暂不落地，
  留作待办，先查清史料与叙述口径。

---

## [v1.0.114] - 2026-11-18

### Docs
- 新增 `docs/plans/2026-11-18-M171-郑和专题内容深挖-plan.md`：盘点郑和专题的内容缺口
  （事件构成单一、分类过粗、地图无标注、地名无古今对照、事件缺关系与重要度），
  给出 4 个阶段 / 12 项任务的实施计划与附录 22 条拟新增事件清单；
- 新增 `docs/conversations/2026-11-18-郑和内容深挖规划.md`，记录调研结论与决策；
- 明确一条约束：`manifest.timeRange` 为 1405—1433，时间轴外的事（郑和生年、碑刻发现、
  墓葬考古、档案散佚）只能写进专题说明与事件正文，不做成事件；
- 本轮不改动任何数据文件。

---

## [v1.0.113] - 2026-11-18

### Changed
- 郑和七次下西洋由「一个航次一条线」拆成按航程阶段划分的 **39 段**（依次 5 / 4 / 5 / 6 / 6 / 6 / 7 段）：
  起航·长乐·占城 / 南洋 / 西航 / 东非 / 归程，每段有自己的日期区间与名称。
  此前图例把七次下西洋都显示为「1 段」，与长征（46 段）、玄奘（20 段）等专题不一致。
- 时间轴线头改为按段推进：去程与回程不再被压成一条等长折线，船位不再「中途就跑到古里」；
  回程也不再整段覆盖在去程上。
- 史料日期无法落在一条连续航线上时（满剌加 1406-01 与爪哇 1406-06），该段标为「分䑸」，
  允许与主队时间区间重叠——第一、七次的爪哇·旧港支队，第七次的天方支队均按此处理。
- 苏门答剌锚点由 97.4/5.4 调整为 97.25/5.25，使 1415-06、1421-06 两个事件回到 30km 判定内。

### Added
- `docs/plans/2026-11-18-M170-郑和航次分段-design.md`、`docs/conversations/2026-11-18-郑和航次分段.md`。

### Unchanged
- 航线几何本身未重算（仍为 M169 的绕陆结果），拆分只在既有点位上切分，顶点 4695 → 4830。

---

## [v1.0.112] - 2026-11-18

### Added
- 11 张专题封面补 AI 生成内容标识：图片保留「豆包 AI 生成」水印，Web 与移动端卡片
  增加「AI 生成示意图」角标，Web 关于页与移动端「关于」增加 AI 内容说明；
- 封面 JPEG 写入 XMP `TC260:AIGC` 隐式标识（`Label=1`、生成方、传播方与内容编号），
  登记表为 `data/atlases/ai-content.json`；
- `pnpm check:aigc` / `pnpm apply:aigc`（`scripts/aigc-labels.ts`），并挂到
  `pnpm validate:data`；校验登记、1600×900 尺寸、MD5 文件名与水印声明；
- 新增 `docs/guides/ai-content-labeling.md`、`docs/decisions/2026-11-18-AI生成内容标识口径.md`
  与 `docs/legal/user-agreement.draft.md`（AI 内容条款草案）；
- 商店材料补充「不提供 AI 生成服务、包含 AI 生成封面」的中英文提审口径。

### Changed
- 封面文件名随 XMP 写入后的内容 MD5 更新，manifest、`index.json`、搜索索引与移动端
  内置数据同步重建；
- `ATTRIBUTION.md`、README、发布检查清单补充 AIGC 说明与校验项；
- 专题文本统一表述为「项目整理，部分由 AI 辅助起草，经人工校订」。

---

## [v1.0.111] - 2026-11-18

### Fixed
- 郑和七次下西洋的航次线不再横穿大陆：原先只有 212 个顶点、顶点之间是两点直线，
  最长一段连续陆地达 1548km（横跨印度次大陆）。现按 0.05° 海陆栅格用 A* 走水面重算，
  七条线合计 4695 个顶点，贴岸绕行马六甲海峡、孟加拉湾、印度西岸、瓜达富伊角与红海口。
- 事件坐标校正到实际港区：爪哇满者伯夷 → 锦石（格雷西克，满者伯夷外港）、
  加异勒 78.12/8.57、卜剌哇 44.03/1.11、竹步 42.7/-0.35（朱巴河口）。
- 阿拨把丹、榜葛剌、天方为内陆目的地，改标 `extensions.routeEvent = false`，航线只到坎贝、
  察地港、吉达，不再拉一条穿陆直线过去。

### Added
- `pnpm check:land`（`scripts/check-route-land.ts`）＋ `scripts/data/ne_50m_land.geojson`
  （Natural Earth，public domain）：沿 `naval` 航段每 2km 采样，连续陆地 ≥25km 报错。
- `data/atlases/zheng-he/land-legs.allow.json`：长江口（太仓）与穆西河（旧港）两处
  真实内河航段登记为例外，逐条写明原因。
- `AGENTS.md` 第 4 节新增第 9 条「海路铁律：船不能走大陆」，把 `pnpm check:land`
  写进可执行流程。

### Changed
- 搜索索引、移动端内置数据随航线重算同步更新。

---

## [v1.0.110] - 2026-11-18

### Docs
- 补齐 M168 计划的验收勾选（validate / routes / heads / 测试 / 索引 / 线上核对）；
- 对话档案补入发布信息（`9dc9b6e`、`f2152f0`、v1.0.108 / v1.0.109）与线上核对结果；
- 文档已与代码、数据同批发布，无遗留待办。

---

## [v1.0.109] - 2026-11-18

### Fixed
- 重建搜索索引，使 `data/atlases/search-index.json` 与 `index.json` 的 `dataVersion` 一致
  （`2026-11-18-f2701544c9d1`）。上一版索引生成于航线最终修正之前，两个文件版本号不同，
  客户端会反复弹出「数据已更新」提示。

---

## [v1.0.108] - 2026-11-18

### Changed
- 郑和专题七次下西洋的事件由 41 个扩充到 110 个（新增 70），每一次航次都有可读的完整事件序列：
  第一次 18、第二次 11、第三次 14、第四次 16、第五次 15、第六次 17、第七次 19。
- 七条航次线补入长乐、暹罗、苏门答剌、柯枝、古里、忽鲁谟斯、天方与东非诸港等停靠点，
  并加入海峡与湾口航路点（马六甲海峡、新加坡、保克海峡、孟加拉湾口、吉达），消除直线穿陆。
- 第二次下西洋改为「布施锡兰山佛寺」（1409-02-15，三体碑），锡兰山之战移到第三次（1411-05）。
- 第一次下西洋的满剌加事件改为「册封满剌加」，官厂移到第三次（1410-07）。
- 阿拨把丹改为甘巴里往返支线；暹罗出使标为非航线事件。
- 阿丹（1418-11）、天方（1432-10）时间调整，与所在航次行程对齐；郑和之死补足返航交代。
- 七个航次实体描述、专题描述与 `updatedAt` 同步更新。

### Added
- 事件来源统一为《明史·郑和传》《瀛涯胜览》《星槎胜览》《西洋番国志》《郑和航海图》
  《郑和下西洋资料汇编》《布施锡兰山佛寺碑》与上海中国航海博物馆年表。

### Docs
- `docs/plans/2026-11-18-M168-郑和专题事件扩充-plan.md`
- `docs/plans/2026-11-18-M168-郑和专题事件扩充-design.md`
- `docs/conversations/2026-11-18-郑和专题事件扩充.md`

---

## [v1.0.107] - 2026-11-17

### Changed
- 时间轴进度范围改为跟随用户筛选出的路线图层：取选中路线中最早的 `startDate` 与最晚的 `endDate`，不再固定使用专题 `timeRange`。
- 切换图层后，进度条两端日期、刻度、事件标记、播放范围与日期输入框的 `min` / `max` 同步更新。
- 当前时间不在新范围时自动夹到起止端点。
- `extensions.legend = false` 的背景线（如郑和专题的明朝海防线）不参与范围计算；没有可用路线时回退到专题 `timeRange`。
- Web 与移动端同步。

### Added
- `routeDateRange` 共享函数与单元测试。

### Docs
- `docs/plans/2026-11-17-M167-进度条范围跟随路线图层-design.md`
- `docs/plans/2026-11-17-M167-进度条范围跟随路线图层-plan.md`
- `docs/conversations/2026-11-17-进度条范围跟随路线图层.md`

---

## [v1.0.106] - 2026-11-17

### Added
- 郑和专题把宝船队航线拆分为 7 次下西洋，每次一个实体、一条完整往返航线；图例显示「第一次下西洋」至「第七次下西洋」。
- manifest 新增 `voyage-1` 至 `voyage-7` 实体；`AtlasEntity` 增加可选 `extensions`。

### Changed
- 「分䑸」不再单独成线：删除 `detached-squadron` 实体，原满剌加—榜葛剌往返段并入第六次航线，原分䑸事件改挂 `voyage-6`。
- 第七次航线的阿丹—天方支线并入 `voyage-7`，不再单独成段。
- 「明朝海防线」退出图例：实体标记 `extensions.legend = false`，保留两段防御线与地图背景显示；独显某航次时仍可见。
- 图例路线样式只统计图例内路线，不再出现「防御 / 驻守」一行。
- 图例「说明」增加「沿海红色点线为明朝海防示意线，不是航线」。
- 移动端补上 `extensions.static` 的进度处理，海防线不再随时间逐段生长。

### Data
- 郑和专题路线 24 → 9 段（7 条航次 + 2 段海防线）。
- 41 个事件按日期改挂 7 个航次实体。
- 重建 `index.json`、`search-index.json`、移动端生成物。

### Docs
- `docs/plans/2026-11-17-M166-郑和专题七次下西洋拆线-design.md`
- `docs/plans/2026-11-17-M166-郑和专题七次下西洋拆线-plan.md`
- `docs/conversations/2026-11-17-郑和专题七次下西洋拆线.md`

---

## [v1.0.105] - 2026-11-17

### Added
- 郑和专题新增「明朝海防线」实体与两段 `defense` 路线：大陆海岸（辽东—山东—南直隶—浙江—福建—广东—海南）与台澎段（福建—澎湖—环台湾本岛—返回福建）。
- 台湾、澎湖纳入明朝东南海防范围；海防线为示意线，`extensions.static = true`，时间轴起点即完整显示。

### Changed
- 东番（台湾）标签由「未设府县」改为「海防范围」；manifest 说明改为「东番（台湾）：明朝东南海防范围，未设府县。」
- 台湾本岛仍为灰色描边、不填充，不表示明朝行政疆域。
- `data/atlases/ATTRIBUTION.md` 补充海防线为示意、`static` 与 `schematic` 的说明。

### Data
- 郑和专题路线 22 → 24 段，新增 2 段海防线。
- 重建 `index.json`、`search-index.json`、移动端生成物。

### Docs
- `docs/plans/2026-11-17-M165-郑和专题明朝海防线-design.md`
- `docs/plans/2026-11-17-M165-郑和专题明朝海防线-plan.md`
- `docs/conversations/2026-11-17-郑和专题明朝海防线.md`

---

## [v1.0.104] - 2026-11-17

### Added
- 郑和专题新增「东番（台湾）」示意标注：台湾本岛灰色细描边、不填充，标识为「东番（台湾）· 未设府县」，明确不表示明朝疆域。
- 图例新增「说明」块，内容为「东番（台湾）：明朝海防要地，未设府县」；Web 与移动端筛选面板同步。
- manifest 新增通用 `extensions.notes` 字段，供专题补充历史说明。

### Changed
- `scripts/build-zheng-he-territories.py` 支持按规则覆盖 `opacity`，新增东番示意面。
- `data/atlases/ATTRIBUTION.md` 记录东番为示意标注、不表示明朝疆域。

### Data
- 郑和专题疆域面 27 → 28 个（新增东番示意标注）。
- 重建 `search-index.json`（数据版本 `2026-11-17-a1795d6d578e`）、`index.json`、移动端生成物。

### Docs
- `docs/plans/2026-11-17-M164-郑和专题台湾注记-design.md`
- `docs/plans/2026-11-17-M164-郑和专题台湾注记-plan.md`
- `docs/conversations/2026-11-17-郑和专题台湾注记.md`

---

## [v1.0.103] - 2026-11-17

### Changed
- 郑和专题图例只保留「明朝宝船队」「分䑸」两条航线：图例改为只列出有路线或事件的实体，「沿途邦国」与 13 个纯疆域实体不再占行。
- 纯疆域实体不参与 `activeEntityIds` 过滤；独显某条航线时，27 个疆域面、边界描边与地名标识继续显示。
- 移动端筛选面板同步只列出有路线或事件的实体。

### Docs
- `docs/plans/2026-11-17-M163-郑和专题图例只保留两条航线-design.md`
- `docs/plans/2026-11-17-M163-郑和专题图例只保留两条航线-plan.md`
- `docs/conversations/2026-11-17-郑和专题图例只保留两条航线.md`

---

## [v1.0.102] - 2026-11-17

### Added
- 郑和下西洋专题新增「时代疆域遮罩」：明、占城、真腊、暹罗、满者伯夷、苏门答剌、锡兰、毗奢耶那伽罗、巴赫曼尼、榜葛剌、拉苏里、马穆鲁克等 12 个政权的疆域面来自 Seshat Cliopatria（CC BY 4.0）。
- 新增 13 个疆域实体；满剌加、古里、忽鲁谟斯、溜山、佐法儿、东非城邦挂在既有「沿途邦国」实体下，古吉拉特单独建实体。
- 新增 `scripts/build-zheng-he-territories.py`，按 Cliopatria 记录 ID 重建疆域面，并校验标识点落在面内。

### Changed
- 郑和专题 `license` 与描述补充疆域数据来源；`updatedAt` 改为 2026-11-17。
- 满剌加、古里、忽鲁谟斯、溜山、佐法儿、东非城邦与古吉拉特为示意补绘，标记 `extensions.precision = "schematic"`。

### Data
- `data/atlases/zheng-he/territories/territories.geojson`：27 个疆域面（明 5、马穆鲁克 3、占城 2、满者伯夷 2、沿途邦国 6、其余各 1）。
- 重建 `index.json`、`search-index.json`、`apps/mobile/src/generated/atlasData.ts`。

### Docs
- `docs/plans/2026-11-17-M162-郑和专题疆域面-design.md`
- `docs/plans/2026-11-17-M162-郑和专题疆域面-plan.md`
- `docs/conversations/2026-11-17-郑和专题疆域面.md`
- `data/atlases/ATTRIBUTION.md`、`README.md` 补充郑和疆域来源与示意范围说明。

---

## [v1.0.101] - 2026-11-17

### Removed
- 事件详情中的分享入口：Web 详情面板与移动端 EventSheet 都不再显示「分享」，Web 端不再使用的 `useShare` 钩子一并删除；深链解析与 `buildShareUrl` 等共享工具保留。

### Docs
- 对话档案与 M160 计划记录移除分享入口。

---

## [v1.0.100] - 2026-11-17

### Removed
- 时间轴缩放功能：Web 与移动端都不再显示 `− / +` 与倍率标签，时间轴固定展示整个专题范围；相关的 viewport 缩放状态与居中逻辑一并移除（共享层的 `createViewport` 等工具保留）。

### Docs
- M160 方案、计划与对话档案记录移除原因。

---

## [v1.0.99] - 2026-11-17

### Changed
- 事件气泡不再只在播放/拖动时出现：页面加载、暂停在某个节点时也会显示当前节点，并在暂停期间常驻；播放时仍按 4 秒节奏自动收起。

### Docs
- M160 方案、计划与对话档案记录气泡触发条件。

---

## [v1.0.98] - 2026-11-17

### Changed
- 时间轴起点/终点日期改为**居中对齐**首个/最后一个事件节点（长征两端的节点分别是 1933-10-12 与 1936-10-22，因此同时与进度条两端重合）；跟随进度的日期小牌也改为始终以指针为中心。

### Docs
- M160 方案、计划与对话档案同步日期对齐规则。

---

## [v1.0.97] - 2026-11-17

### Data
- 新增长征专题事件 `zhaojin-1933-10`「照金苏区反‘围剿’与红军撤离」（1933-10-12 → 10-18，照金，陕北红军），补齐时间轴起点只有路线、没有事件的问题；与包家寨会议、陕甘边第一次反「围剿」互链。
- 专题 `updatedAt` 改为 `2026-11-17`，搜索索引数据版本 `2026-11-17-5c8b90cd16f4`。

### Docs
- 新增 [M161 方案](docs/plans/2026-11-17-M161-照金撤离事件-design.md)、[M161 计划](docs/plans/2026-11-17-M161-照金撤离事件-plan.md) 与[对话档案](docs/conversations/2026-11-17-照金撤离事件.md)。

---

## [v1.0.96] - 2026-11-17

### Changed
- 时间轴日期布局调整：可见窗口起点移到左上、终点留在右上；游标日期改为跟随进度移动的小标签，拖到起点/终点时分别与两端日期重合，静态日期在重合区间自动淡出；移除左下角重复的起点日期。

### Docs
- M160 方案、计划与对话档案记录时间轴日期调整。

---

## [v1.0.95] - 2026-11-17

### Changed
- 进度栏上方不再重复显示当前节点名，节点信息只由地图气泡呈现；当前日期与结束日期保留，读屏仍通过隐藏 live region 播报节点名。

### Docs
- M160 方案、计划与对话档案记录去重决策。

---

## [v1.0.94] - 2026-11-17

### Changed
- 「上一事件 / 下一事件」不再直接打开详情栏：现在跳转时间、把地图定位到该事件并弹出 4s 信息气泡，详情由气泡里的「查看详情」进入。

### Docs
- M160 方案、计划与对话档案记录上一/下一事件的行为调整。

---

## [v1.0.93] - 2026-11-17

### Fixed
- 时间轴拖动在进度条外松开鼠标后未结束：现在监听窗口级 `pointerup` / `pointercancel` / `blur` 与页面隐藏，并在指针回到条上时用 `buttons === 0` 兜底；同时忽略非左键按下。

### Docs
- 对话档案与 M160 计划补充拖动结束的边界处理。

---

## [v1.0.92] - 2026-11-17

### Changed
- 事件气泡不再只属于播放：拖动时间轴跨过事件时同样弹出当前节点，跟手更新（间隔 120ms），松手后保留到 4s 计时结束。

### Docs
- M160 方案、计划与对话档案补充拖动气泡的决策与间隔参数。

---

## [v1.0.91] - 2026-11-17

### Changed
- 拖动时间轴期间也会压暗已走完的路线（与播放态一致），松手立即恢复全彩；通过新增的 `scrubbing` 状态实现，静态阅读时不发灰。

### Docs
- [M160 方案](docs/plans/2026-11-17-M160-路线动态表现增强-design.md)、[M160 计划](docs/plans/2026-11-17-M160-路线动态表现增强-plan.md) 与[对话档案](docs/conversations/2026-11-17-路线动态表现增强.md) 记录拖动压暗的决策。

---

## [v1.0.90] - 2026-11-17

### Changed
- 抵达涟漪在**拖动时间轴**时也会触发，而不再局限于播放；按「同时最多 6 圈、两圈间隔 ≥ 90ms」限流，快速拖动不会满屏炸开。播放态压暗聚焦保持不变。

### Docs
- [M160 方案](docs/plans/2026-11-17-M160-路线动态表现增强-design.md) 与[对话档案](docs/conversations/2026-11-17-路线动态表现增强.md) 补充拖动涟漪的决策与限流参数。

---

## [v1.0.89] - 2026-11-17

### Added
- 地图路线新增动态表现：未尽之路淡墨预告线、线头光点与扩散环、线头后方 14km 拖尾、抵达终点的一次性涟漪、悬停浮签与点击定位。
- 播放时自动聚焦当前：已走完的路线透明度压到 32%，正在推进的线自然突出；线宽随缩放分三档调整。

### Changed
- 路线进度与弧长采样抽到 `apps/web/src/map/route-visuals.ts`，矢量层与后续图层共用。
- 临时对比用的「矢量 / 画布」开关、画布渲染原型与相关工具函数已移除，只保留矢量增强版。

### Docs
- 新增 [M160 方案](docs/plans/2026-11-17-M160-路线动态表现增强-design.md)、[M160 计划](docs/plans/2026-11-17-M160-路线动态表现增强-plan.md) 与[对话档案](docs/conversations/2026-11-17-路线动态表现增强.md)，记录矢量 / 画布两版对比与选型依据。

---

## [v1.0.88] - 2026-11-17

### Changed
- 封面遮罩定稿为整图 70%（停靠点 0.7 / 0.665 / 0.504 / 0.182 / 0），副文字定稿为 130%；临时「遮罩模式」四选一、「封面遮罩」「副文字」两个滑杆及 `localStorage` 逻辑全部移除，`AtlasCard` 不再接受样式参数。
- 封面只保留主标题与年代，去掉英文标题、中英文关键词、品牌行、底部「OPENCHRONICLE ATLAS · 史迹 · 时空地图」与分隔线；Web 与移动端同步。`coverText` 其余字段保留在数据中但不再渲染。

### Data
- 抗日战争封面换新：`cover-851dab39.jpg`；明清封面换新：`cover-226ea43c.jpg`（均 1600×900）。两张专题 `updatedAt` 改为 `2026-11-17`，索引、搜索索引与移动端内置数据同步重建。

### Docs
- `data/atlases/ATTRIBUTION.md` 说明封面只叠加标题与年代，并记录两张换图。
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「定稿」一节。

---

## [v1.0.87] - 2026-11-17

### Added
- 首页新增临时「遮罩模式」四选一：整图渐变 / 局部径向渐变 / 毛玻璃左带 / 纯文字描边，用于对比文字可读性方案；取值存 `localStorage`，与遮罩、副文字两个滑杆联动。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「临时遮罩模式切换」一节。

---

## [v1.0.86] - 2026-11-17

### Changed
- 专题卡去掉下半部分（标题、副标题、标签、进入入口），只保留 16:9 封面和封面上的文字；Web 与移动端同步，卡片改为纯图块，点击整张图进入专题。
- Web 卡片链接补 `aria-label`，图片成为唯一视觉内容后仍有可读名称。
- 临时「封面遮罩」「副文字」两个滑杆保留，待最终数值确定后移除。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「专题卡只保留封面」一节。

---

## [v1.0.85] - 2026-11-16

### Added
- 首页新增临时「副文字」滑杆（60%—200%，默认 100%）：按比例调整封面除主标题外所有文字（年代、英文名、中英文关键词、品牌行、注记）的字号与行距，取值存 `localStorage`，带重置。

### Changed
- 封面除主标题外的文字统一加粗（`font-weight: 600`，Web 与移动端），此项为永久改动。
- 主标题字号不随滑杆变化；150% 时品牌行会换行重叠，属越界提示。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「副文字加粗与临时字号滑杆」一节。

---

## [v1.0.84] - 2026-11-16

### Added
- 首页「历史专题」标题旁新增临时「封面遮罩」滑杆（0—100%，默认 97%）：实时调整封面遮罩不透明度，取值写入 `localStorage`，带「重置」。仅 Web，用于确定最终数值，确定后会移除滑杆并写死。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「临时遮罩滑杆」一节。

---

## [v1.0.83] - 2026-11-16

### Changed
- 恢复封面半透明遮罩并把不透明度略调高：左侧 0.97，32% 处 0.92，52% 处 0.70，72% 处 0.25，90% 归零；移动端用六条分条近似同一渐变。右侧仍保留约 40% 画面。
- 文字保留浅色描边阴影，深色封面上的标题恢复可读。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「恢复遮罩并调高不透明度」一节。

---

## [v1.0.82] - 2026-11-16

### Changed
- 去掉封面上的白色半透明遮罩：Web 删除左侧渐层，移动端删除分条遮罩，封面图完整露出；文字改用浅色描边阴影保证基本可读性。
- 深色画面（三国、明清、抗日战争、长征）上标题对比度会下降，属于本次试验的已知代价。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md` 补「去掉封面白色遮罩」一节。

---

## [v1.0.81] - 2026-11-16

### Changed
- 11 个专题封面换为项目负责人提供的 AI 生成插画：原图 2047×1152，统一缩放到 1600×900 JPEG，11 张合计约 2.8 MB；文件名仍带内容哈希。
- 图片右下角保留「豆包 AI 生成」水印，未裁剪；封面文字仍由 `coverText` 叠加渲染，不写入图片。
- `ATTRIBUTION.md` 封面章节改为：封面为 AI 示意插画，不对应具体史实；此前的公有领域封面于本版停用，记录保留在 git 历史与 `1.0.77`—`1.0.80` 的 CHANGELOG。
- 数据版本 `2026-11-16-7d9281bbab7e`；全仓版本由 `1.0.80` 升级为 `1.0.81`，构建号 `10081`。

### Docs
- `docs/conversations/2026-11-16-封面换成AI插画.md`

---

## [v1.0.80] - 2026-11-16

### Changed
- 封面图与文字彻底分离：11 张封面恢复为无字画作/照片；标题、年代、关键词、品牌与「示意图」注记改由新增的 `coverText` 字段驱动，在 Web 卡片与移动端列表上用真实文本叠加渲染，不再烘焙进图片。
- 新增 `AtlasCoverText` 类型与 schema；manifest 与 `index.json` 补齐 `coverText`。
- 移除卡片图上的年代胶囊：年代已在封面文字与正文出现，且与长标题、品牌行冲突。
- 首页 `index.json` 请求加 `?v=<版本>`，发布后立即取新索引，避免 1 小时 HTTP 缓存继续显示旧封面。

### Docs
- `docs/conversations/2026-11-16-封面文字恢复.md` 补「封面图与文字分离」一节。
- `data/atlases/ATTRIBUTION.md` 改为说明文字由客户端叠加、不写入图片。

---

## [v1.0.79] - 2026-11-16

### Fixed
- 封面改为带内容哈希的文件名（如 `cover-2cfe93b6.jpg`）：`1.0.78` 沿用 `cover.jpg`，Service Worker 的 `CacheFirst` 会命中旧图，已安装 PWA 的用户看不到恢复后的文字。manifest 与 `index.json` 已同步。

### Changed
- 数据版本 `2026-11-16-ba8c8a6f6ad0`；全仓版本由 `1.0.78` 升级为 `1.0.79`，构建号 `10079`。

### Docs
- `docs/conversations/2026-11-16-封面文字恢复.md` 补「绕过图片缓存」一节。

---

## [v1.0.78] - 2026-11-16

### Fixed
- 恢复专题封面上的标题、年代、关键词与品牌文字：上一轮换图时只保留了画作/照片，文字版式丢失。现按原版式重新叠加：
  - 简版（长征、郑和、抗战）：标题、年代、品牌行、底部「示意图 · 数据待史料校订」；
  - 详版（三国、隋唐、宋元、明清、大运河、徐霞客、玄奘）：标题、英文名 + 年代、中英文关键词、底部 `OPENCHRONICLE ATLAS · 史迹 · 时空地图`。
- 西路军封面按简版补上文字（此前无封面）。

### Changed
- 封面文字后加左侧宣纸色渐层，保证新画作/照片上的墨色文字可读；封面重新导出 JPEG，11 张合计约 6.7 MB。
- ATTRIBUTION 注明封面文字为本站叠加版式，不属于原图。

### Docs
- `docs/conversations/2026-11-16-封面文字恢复.md`

---

## [v1.0.77] - 2026-11-16

### Changed
- 11 个专题封面全部换为公有领域历史画作、老照片或实物照片：三国《关羽擒将图》、隋唐《步辇图》、宋元《清明上河图》、明清《乾隆南巡图》、郑和宝船模型、京杭大运河 1900 年老照片、徐霞客石涛《黄山图》、玄奘《负笈图》、长征若尔盖草地、西路军祁连山、抗战八路军浮图峪长城。
- 封面统一裁切为 16:9、1600×900 JPEG，manifest 与 `index.json` 的 cover 改为 `assets/cover.jpg`；删除旧的 `cover.png` / `cover.svg`。
- 西路军封面降饱和处理，贴近站内宣纸色调；长征、西路军、郑和封面在图注中说明为今貌或模型。

### Added
- `data/atlases/ATTRIBUTION.md` 新增「封面图来源与许可」表，逐张标注作者、馆藏、Commons 链接与许可。
- 关于页新增「来源与许可」入口（`/data/atlases/ATTRIBUTION.md`）。

### Docs
- `docs/conversations/2026-11-16-专题封面换成历史画作.md`

---

## [v1.0.76] - 2026-11-16

### Added
- 时间轴栏新增「上一事件 / 下一事件」按钮（Web 与移动端）：按当前实体与筛选跳到相邻事件节点，同步选中事件、打开详情并居中视口；首末节点自动禁用，悬停或无提示时显示目标事件名。

### Fixed
- 长征时间范围由 `1934-02-01` 提前到 `1933-10-12`：包家寨会议（1933-11-03）此前落在范围外，时间轴无法到达；副标题改 `1933—1936`，描述首句补陕甘边前史。
- 时间轴事件按钮增加时间范围过滤，范围外事件不进入候选。

### Changed
- 数据版本 `2026-11-16-f42a29ca7417`；全仓版本由 `1.0.75` 升级为 `1.0.76`，构建号 `10076`。

### Docs
- `docs/conversations/2026-11-16-时间轴上下事件按钮.md`

---

## [v1.0.75] - 2026-11-16

### Added
- 事件「陕北省苏维埃政府成立」（1935-01-25—31）：赤源县白庙岔，马明方任主席，辖 16 个县。
- 事件「下寺湾会议」（1935-11-03）：成立西北革命军事委员会，恢复红一方面军番号，红十五军团编入。
- 事件「象鼻子湾会师」（1935-11-06）：中央红军与红十五军团会师，毛泽东「雪地讲话」宣告长征结束。

### Fixed
- 删除无据路线「永坪—吴起」「吴起—直罗镇」：陕北红军 1935-09-18 已编入红十五军团，军团并未开往吴起；陕北红军路线止于「瓦窑堡—永坪」，重排为 order 1—6。
- 「吴起镇会师」改名「中央红军到达吴起镇」，只挂中央红军，正文补 10/21「切尾巴」与 10/22 吴起镇会议。
- 「直罗镇战役」去掉陕北红军（其时已编入红十五军团）。

### Changed
- 本轮把 M172 范围由「1933—1935 陕甘边」扩为「陕北红军 1934—1936 全史」，`shaanxi-red-army` 与 `red-15-army` 描述互相注明承接关系。
- 数据版本 `2026-11-16-ac75bf9dd200`；全仓版本由 `1.0.74` 升级为 `1.0.75`，构建号 `10075`。

### Docs
- `docs/plans/2026-11-16-陕北红军全史补全-design.md`、`-plan.md`（由「陕甘边历史补全」改名）
- `docs/conversations/2026-11-16-陕北红军全史补全.md`

---

## [v1.0.74] - 2026-11-16

### Added
- 长征 order 7「南梁—西华池—三里塬—南梁（第一次反“围剿”外线）」1934-03-01—05-31：红 42 师三道川、蔺家砭、李家梁、西华池、三里塬、马子川外线作战。
- 长征 order 8「南梁—安定（红三团北上陕北）」1934-07-23—08-15：谢子长南下会合后率红 3 团与陕北游击队返回安定。
- 事件「包家寨会议」（1933-11-03—05）：恢复红 26 军、成立 42 师，进军南梁，划三路游击区。
- 事件「陕甘边区革命委员会成立」（1934-02-25）：南梁小河沟四合台，习仲勋任主席。
- 事件「西华池战斗」（1934-04-11）：歼陇东警备第二旅第五团团部及 2 个营 700 余人；另一说 4/2、600 余人。
- 事件「三里塬战斗」（1934-05）：淳化三里塬遭遇战歼陕西游击支队 2 个连。
- 事件「陕北苏区第一次反“围剿”」（1934-07-08—09-30）：陕北游击队与红 3 团协同，7/17 攻入安定，8/26 河口镇谢子长负伤。

### Changed
- 长征 order 1 由「照金—南梁」改为「照金—包家寨—南梁（重心北移）」，起点日提前到 1933-10-12，类型改 advance。
- 「陕甘边第一次反“围剿”」表述改正：只覆盖陕甘边方向，结果改为「挫败围剿、巩固并扩大南梁根据地」，不再并称「让陕北、陕甘边苏区活了下来」。
- 南梁坐标由 `108.3,36.35` 改为 `108.34,36.40`（偏西南约 6km）；陕北红军实体描述补 1931—1935 年脉络与落脚点定位。
- order 2、3 描述按周家硷会议、第二次反“围剿”重写；order 5 注明为时间轴示意衔接线（陕北红军编入红十五军团后并未开往吴起）。
- 数据版本 `2026-11-16-30064486c338`；全仓版本由 `1.0.73` 升级为 `1.0.74`，构建号 `10074`。

### Docs
- `docs/plans/2026-11-16-陕北红军全史补全-design.md`、`-plan.md`（原「陕甘边历史补全」，`1.0.75` 起扩为全史）
- `docs/conversations/2026-11-16-陕甘边历史补全.md`

---

## [v1.0.73] - 2026-11-16

### Fixed
- 抗日日军进攻线灵丘起点由 `113.6,39.4` 改正为灵丘县城 `114.24,39.44`：原坐标在灵丘以西约 60 公里，「日军占领灵丘」事件同步改正。

### Changed
- 抗日、三国、长征台账与全量审计的遗留待办状态更新：三国石亭/仓亭/高平陵地望多说并暂取代表点；长征 1936 年红二经色达、班玛北上已含在甘孜—阿坝段内；抗日出兵地逐点复核完成。
- 数据版本 `2026-11-16-28e47240401d`；全仓版本由 `1.0.72` 升级为 `1.0.73`，构建号 `10073`。

### Docs
- `docs/conversations/2026-11-16-遗留待办-灵丘与待办收口.md`

---

## [v1.0.72] - 2026-11-16

### Added
- 明清 order 141「济咙—热索桥（入廓尔喀境）」1792-05-13—05-31：福康安 5/13 自济咙启程，5/14 过藏廓边界，5/15 在热索桥突破廓军河防。
- 「热索桥之战」事件（1792-05-15）：坐标取今吉隆口岸热索桥 `28.2788,85.3781`，正文写入上游绕渡与三座石碉。

### Changed
- 廓尔喀之役协布鲁、东觉、噶勒拉、堆补木诸战在今尼泊尔境内，无可靠点位，只入正文，不再列为待办。
- 数据版本 `2026-11-16-83d536bf82b2`；全仓版本由 `1.0.71` 升级为 `1.0.72`，构建号 `10072`。

### Docs
- `docs/conversations/2026-11-16-遗留待办-热索桥.md`

---

## [v1.0.71] - 2026-11-16

### Added
- 隋唐 order 29「瓜州—伊州（归义军收复伊州）」0850：张议潮收复沙、瓜二州后继续东进，取伊州（今哈密）。
- 「归义军收复伊州」事件（850）：注明西州是否同年收复史料有争议，一说为回鹘所据。

### Changed
- 隋唐台账与全量审计的对应待办更新：伊州已立线，西州仍只入正文。
- 数据版本 `2026-11-16-372889a984b1`；全仓版本由 `1.0.70` 升级为 `1.0.71`，构建号 `10071`。

### Docs
- `docs/conversations/2026-11-16-遗留待办-归义军伊州.md`

---

## [v1.0.70] - 2026-11-16

### Added
- 长征 order 9「卓克基—大藏寺—查理寺—阿坝（左路军北上）」1935-08-15—08-21：左路军先头纵队（红 5 军、红 9 军 25 师、红 31 军 93 师）自卓克基、马尔康出发，8/19 占查理寺、8/21 占阿坝。
- 「左路军占领阿坝」事件（1935-08-21）：正文写入 8/28 先头入草地、8/31 抵噶曲河（白河）、因河水暴涨 9/3 折返阿坝。

### Changed
- 长征台账与全量审计的对应待办更新：阿坝—噶曲河段无可靠点位，只入正文，不再作待办。
- 数据版本 `2026-11-16-2a72c4b94263`；全仓版本由 `1.0.69` 升级为 `1.0.70`，构建号 `10070`。

### Docs
- `docs/conversations/2026-11-16-遗留待办-左路军北上.md`

---

## [v1.0.69] - 2026-11-16

### Fixed
- 三国皖口坐标由 `116.47,30.55` 改为 `116.98,30.52`：皖口为皖水入长江之口，即今安庆市大观区山口乡山口镇村，距安庆城十五华里；原坐标落在今望江、太湖之间，偏西约 50 公里。涉及 `wu #24` 起点与 `wu #32` 终点。
- 长征芦花顶点改为芦花镇政府点 `102.98887,32.06539`，临潭顶点改为新城镇（洮州卫城）`103.59318,34.67271`，三条相关事件坐标同步。

### Changed
- 三国「石亭之战」事件正文补皖口今地与石亭地望（今潜山东北，一说怀宁或桐城境）。
- 三国、长征台账与全量审计的对应待办条目标注完成情况。
- 数据版本 `2026-11-16-d2b1ca1a4c9a`；全仓版本由 `1.0.68` 升级为 `1.0.69`，构建号 `10069`。

### Docs
- `docs/conversations/2026-11-16-遗留待办-坐标精校.md`

---

## [v1.0.68] - 2026-11-16

### Docs
- `docs/research/route-endpoints/2026-11-16-全量审计.md`（C8 全量复核报告）：11 个专题、651 段路线、900 条事件，0 个无来由端点、0 条事件缺活动路线；6 份台账共 91 条结论；allowlist 3 条、「已查未得」2 条。
- `docs/plans/2026-11-16-端点史实核查-plan.md` 标记 C0—C8 全部完成，补 C8 结果。
- `docs/conversations/2026-11-16-C8-全量复核.md`。

### Changed
- 数据未改动；全仓版本由 `1.0.67` 升级为 `1.0.68`，构建号 `10068`。

---

## [v1.0.67] - 2026-11-16

### Added
- `check:heads` 新增 `--entity <id>` 选项，可按实体分批核查（配合 `--atlas`）。
- 日军进攻线 19 个出兵/占领事件：灵丘（1937-09-20）、大同（09-13）、青岛（1938-01-10）、菏泽（05-14）、开封（06-06）、商城（09-16）、韶关（1940-01-16）、芜湖（1939-12-16）、归绥（1939-12-19）、舞阳（1941-02-05）、当阳（1941-09-28）、开封（1941-10-02）、深圳（1941-12-08）、曼德勒（1942-05-01）、杭州（1942-05-15）、安阳（1943-04-20）、荆州（1943-05-05）、公安（1943-11-02）、邵阳（1945-04-09）。

### Fixed
- 忻口会战线段改正：原线作太原—代县，实为忻口—南怀化—大白水战场线。
- 平型关战斗终点校正至乔沟伏击区；百团大战西端校正至榆次。
- 滇西反攻东线、盟军西线、松山段补保山与畹町两端锚点。
- 兰封会战方向改正：原线作商丘—开封，实为日军第 14 师团自菏泽南下经兰封至开封。
- 六安—立煌终点改正：日军此路实际攻商城，未攻立煌，改为六安—商城。
- 一·二八段起点由长江口外改为虹口租界，路线改为虹口—闸北。
- 广州入城段起点由城东 10 公里外移至城郊，接大亚湾—广州段。
- 郑州段改为开封—郑州，公安段改为公安—常德。
- 灵丘、大同、青岛三段起点日分别改为占领或登陆当日。

- 中国军队上高、中条山、鄂西、昆仑关、滇西各段补出兵或收束事件；华南游击队三条活动区尾端按示意线登记 allowlist。

### Changed
- 抗日专题 37 处端点全部归零：`check:heads --atlas anti-japanese-war` 报 0，按实体分批亦为 0。
- 事件总数 874 → 900，anti-japanese-war 225 → 251，路线段 651（未增减）；数据版本 `2026-11-16-6dd8f4bde707`。
- 全仓版本由 `1.0.66` 升级为 `1.0.67`，构建号 `10067`。

### Docs
- `docs/research/route-endpoints/anti-japanese-war.md`（新建 C5 台账）
- `docs/plans/2026-11-16-C5-日军进攻线端点核查-design.md`
- `docs/plans/2026-11-16-C5-日军进攻线端点核查-plan.md`
- `docs/conversations/2026-11-16-C5-日军进攻线端点核查.md`

---

## [v1.0.66] - 2026-11-16

### Fixed
- 拉萨—聂拉木段方向与时间改正：聂拉木已于 1792 年正月至二月由成德收复，福康安 2 月 17 日自拉萨启程，五月六日攻擦木、初十克济咙；原线把二月已收复的聂拉木当作终点。
- 汉城段线尾补齐：原止于 1593 年正月，未写 1593 年四月日军撤出、五月明军进驻。

### Added
- 明军收复汉城（1593-05）。
- 李自成建大顺（1644-01-01）。
- 多尔衮自盛京出师（1644-04-09）。
- 吴三桂衡州称帝（1678-03）。
- 清军自瑷珲出师（1685-05）。
- 清军攻克济咙（1792-05-10）。
- 西征军出关（1876-04）。
- 江浙联军自镇江会攻南京（1911-11-20）。
- 郑经入泉州（1674-06）。

### Changed
- ming #12 延长至 1593-05，补壬辰倭乱前期经过。
- ming #19、qing #20/#36/#41/#70/#140、ming-zheng #37 补正文与事件锚点。
- qing #55 改为拉萨—日喀则—定日—济咙，1792-02-17—08-31。
- 事件总数 865 → 874，ming-qing 144 → 153，路线段 651（未增减）；数据版本 `2026-11-16-34f05733f295`。
- 全仓版本由 `1.0.65` 升级为 `1.0.66`，构建号 `10066`。

### Docs
- `docs/research/route-endpoints/ming-qing.md`（新建 C4 台账）
- `docs/plans/2026-11-16-C4-明清端点核查-design.md`
- `docs/plans/2026-11-16-C4-明清端点核查-plan.md`
- `docs/conversations/2026-11-16-C4-明清端点核查.md`

---

## [v1.0.65] - 2026-11-16

### Fixed
- 好水川之战年份由 1040 年改为 1041 年二月（庆历元年），起点由「西安」（今陕西西安）改为镇戎军（今固原）：韩琦自镇戎军调兵万八千人付任福，经怀远城、得胜寨趋羊牧隆城。
- 方腊段方向与日期改正：原为 1120 年九月杭州—睦州（实为起义军攻杭州），改为 1121 年官军反攻并延伸至青溪。
- 襄阳段删去无据的南阳起点：元军出兵与围城记载中未见自南阳南下的行军，改为樊城—襄阳（1273 年正月—三月）。
- 大理—善阐 1096 年段删除：查无由大理赴善阐的行军记录，按「已查未得」不画线；1096 年事件改由「羊苴咩城（大理国都）」段覆盖。

### Added
- 韩琦赴镇戎军调兵（1041-02）。
- 方腊攻占杭州（1120-12-29）。
- 帮源洞之战（1121-04-24）。
- 樊城之战（1273-01-09）。

### Changed
- northern-song #7 改为镇戎军—好水川，1041-02—03。
- northern-song #14 改为杭州—睦州—青溪（方腊之乱与官军进剿），1120-10—1121-04。
- mongol-yuan #28 起点由「草原」改为漠北（与 1209 年出师地相接），1211-03—08。
- mongol-yuan #36 改为樊城—襄阳，1273-01—03。
- dali #2 延长至 1096 年，更名为「羊苴咩城（大理国都）」。
- 好水川、方腊起义、野狐岭、襄阳、高氏代立 5 条事件正文补经过与出处。
- 事件总数 861 → 865，song-yuan 42 → 46，路线段 652 → 651；数据版本 `2026-11-16-6de2c64c576c`。
- 全仓版本由 `1.0.64` 升级为 `1.0.65`，构建号 `10065`。

### Docs
- `docs/research/route-endpoints/song-yuan.md`（新建 C3 台账）
- `docs/plans/2026-11-16-C3-宋元端点核查-design.md`
- `docs/plans/2026-11-16-C3-宋元端点核查-plan.md`
- `docs/conversations/2026-11-16-C3-宋元端点核查.md`

---

## [v1.0.64] - 2026-11-16

### Fixed
- 庞勋起义事件由徐州移置桂州：868 年七月事变发生在桂州，十月才攻占徐州；另增「庞勋攻占徐州」事件（868-10-17）承接线尾。
- 幽州—魏州日期由 781 全年改为 781-01—782-11：781 年朱滔只到莫州、束鹿、深州，782 年才南下魏州救田悦。

### Added
- 开江南河（610）：京口至余杭八百余里，大运河全线贯通。
- 朱滔奉诏讨李惟岳（781）：幽州出兵，军于莫州，破李惟岳于束鹿。
- 归义军收复凉州（861）：张淮深率蕃汉兵七千东征，河陇故地尽复。
- 庞勋攻占徐州（868-10-17）。
- order 5「洛阳—涿郡（永济渠）」608 年。

### Changed
- sui #3 由洛阳—淮安延伸为洛阳—淮安—江都—余杭（通济渠、邗沟、江南河），结束日改 610-12。
- sui #4 补涿郡集结与辽东之役经过，线头由永济渠段承接。
- tang #19 补莫州，写 781 讨李惟岳与 782 救田悦两段。
- tang #24 由沙州—瓜州延伸为沙州—瓜州—肃州—甘州—凉州，848-01—861-03。
- tang #25 补庞勋起义前因（863 年八百徐卒戍桂、六年不代）。
- 归义军收复敦煌、庞勋起义 2 条事件正文补经过与出处。
- 事件总数 857 → 861，sui-tang 32 → 36，路线段 651 → 652；数据版本 `2026-11-16-dc89c408c559`。
- 全仓版本由 `1.0.63` 升级为 `1.0.64`，构建号 `10064`。

### Docs
- `docs/research/route-endpoints/sui-tang.md`（新建 C2 台账）
- `docs/plans/2026-11-16-C2-隋唐端点核查-design.md`
- `docs/plans/2026-11-16-C2-隋唐端点核查-plan.md`
- `docs/conversations/2026-11-16-C2-隋唐端点核查.md`

---

## [v1.0.63] - 2026-11-16

### Fixed
- 吕蒙袭荆州的出发地由陆口改为寻阳：原线起点作陆口，与《三国志·吕蒙传》「蒙至寻阳」不合；路线改为寻阳—公安—江陵。
- 南征荆州主线补新野、襄阳：原线由许昌直连江陵，把新野—襄阳一段省掉，导致追击段（襄阳—当阳）线头悬空约 71km。
- 高平陵之变改为洛阳—高平陵—洛阳：原线止于高平陵，线尾无后续；曹爽回洛阳交出兵权后被族诛。

### Added
- 孙策攻取会稽（196）：王朗据固陵，孙策用孙静之计夜出查渎、突袭高迁屯，王朗败走东冶后投降，孙策自领会稽太守。
- 孙权迁都武昌（221）：自公安迁鄂，改名武昌，置武昌郡。
- order 32「武昌—皖口」228-07、order 33「公安—武昌」221-04。

### Changed
- cao-wei #5 由许昌—官渡—乌巢延伸为许昌—官渡—乌巢—仓亭—许昌，结束日由 200-10 改为 201-09：201 年四月击破袁绍仓亭军、九月还许都。
- cao-wei #12 更名为「襄阳—当阳长坂（轻骑追击）」，补轻骑五千、一日一夜三百余里的记载。
- wu #3 由历阳—曲阿—吴延伸至会稽，结束日由 196-08 改为 196-12。
- 官渡、长坂、孙策定江东、吕蒙袭荆州、石亭、高平陵 6 条事件正文补史实与出处。
- 事件总数 855 → 857，three-kingdoms 35 → 37，路线段 649 → 651；数据版本 `2026-11-16-cec45d50698d`。
- 全仓版本由 `1.0.62` 升级为 `1.0.63`，构建号 `10063`。

### Docs
- `docs/research/route-endpoints/three-kingdoms.md`（新建 C1 台账）
- `docs/plans/2026-11-16-C1-三国端点核查-design.md`
- `docs/plans/2026-11-16-C1-三国端点核查-plan.md`
- `docs/conversations/2026-11-16-C1-三国端点核查.md`

---

## [v1.0.62] - 2026-11-16

### Fixed
- 「包座」坐标由 `103.6,32.65`（松潘）改为 `103.36805,33.47688`（若尔盖包座乡）：原坐标与真正的包座点在序列中错位，导致出草地一段方向错误。
- order 3 南下起点由懋功改为包座、出发日由 9 月 8 日改为 9 月 15 日：9 月 8 日只是张国焘电令右路军准备南下，9 月 15 日才发布《大举南进政治保障计划》，10 月 20 日才克懋功。
- order 3 终点日期由 11 月 25 日改为 11 月 21 日（百丈撤出）。

### Added
- order 7「甘孜—阿坝—包座—腊子口—哈达铺—岷州—临潭—通渭（红四方面军北上甘南）」1936-07-05 → 10-02：补原 order 2 缺失的甘孜—甘南段。
- order 8「通渭—华家岭—会宁（红五军后卫阻击）」1936-10-20 → 10-23：华家岭阻击战此前无活动路线。

### Changed
- order 2 由「懋功—会宁（示意）」16 个月复合线改为「懋功—两河口—卓克基—芦花—毛儿盖—班佑—巴西—包座」1935-06-19 → 09-14，补芦花（芦花会议）。
- order 4 更名为「名山—宝兴—丹巴—道孚—炉霍—甘孜（红四方面军西进康北）」，与二次北上甘南区分。
- 包座战役事件补作战经过、战果与四条来源（中国军网、人民网、四川省情网、维基百科）。
- 事件总数 855，long-march 239，路线段 647 → 649；数据版本 `2026-11-16-c733dc053bc1`。
- 全仓版本由 `1.0.61` 升级为 `1.0.62`，构建号 `10062`。

### Docs
- `docs/research/route-endpoints/long-march.md`（新增 L5 台账与实施记录）
- `docs/plans/2026-11-16-L5-雪山草地核查-design.md`
- `docs/plans/2026-11-16-L5-雪山草地核查-plan.md`
- `docs/conversations/2026-11-16-L5-雪山草地核查.md`

---

## [v1.0.61] - 2026-11-16

### Fixed
- 直罗镇坐标由 `109.38,36`（富县县城）改为 `108.99274,35.9587`（直罗镇镇区，距县城 53 公里）：中央红军 #33、红十五军团 #3/#4、东北军 #14 四处端点随之改正，最大偏差约 35km。
- 关上村战斗归属改正：原数据系于红十五军团，实为红一军团 1936 年 2 月 25—27 日在中阳城南 25 里关上村、郭家庄地域围歼晋绥军独立第 2 旅的战果。
- 西征路线顺序改正：原「延川—盐池—豫旺堡—同心」把 6 月 21 日的盐池放在 6 月 11 日的同心之前，且缺曲子、阜城、环县。
- 骑兵团奔袭会宁的出发地由豫旺堡改为同心：9 月 30 日夜由同心（王家团庄军团部受命）出发，行程 150 余公里。

### Added
- 瓦窑堡会议（1935-12-17—25）：确定抗日民族统一战线，12 月 23 日通过军事战略决议决定东征。
- 中央红军 #47「豫旺堡—界石铺—青江驿—会宁（南下接应）」1936-09-13—10-09：静会战役计划、青江驿与会宁会师的接应线。

### Changed
- 中央 #34 改为直罗镇—瓦窑堡—延长—清涧（东征准备），终点不再是延川，补瓦窑堡会议、1 月 31 日延长军事会议、2 月 6 日袁家沟命令。
- 中央 #41 改为清涧河口—石楼—关上村—兑九峪—临汾—延川：2 月 20 日 20 时渡河、25—27 日关上村、3 月 10 日兑九峪、3 月 16 日起右路军南下晋南、5 月 2—5 日经清水关西渡。
- 中央 #42 改为延川—吴起镇—环县—豫旺堡（西征），5 月 19 日—7 月 27 日；原「南下接应」部分拆为 #47。
- 中央 #35 改为会宁—青江驿—将台堡（迎接红二方面军），写明 10 月 18 日老君坡、10 月 21 日平峰镇、10 月 22 日将台堡。
- 红十五军团 #4—#8 重画：直罗镇—延川—清涧、清涧河口—石楼、石楼—隰县（水头、蓬门）、隰县—孝义（兑九峪）—兴县、兴县—永和—延川（回师）。
- 红十五军团 #9—#11 重画：延川—盐池（经宁条梁、定边）、盐池—同心—豫旺堡、同心—会宁。
- 陕北红军 #4、#6 的瓦窑堡与直罗镇端点改用真实点位。
- 事件总数 854 → 855，long-march 238 → 239，路线段 646 → 647；数据版本 `2026-11-16-94335a5a2c54`。
- 全仓版本由 `1.0.60` 升级为 `1.0.61`，构建号 `10061`。

### Docs
- `docs/research/route-endpoints/long-march.md`（新增 L4 台账与实施记录）
- `docs/plans/2026-11-16-L4-东征西征与会师核查-design.md`
- `docs/plans/2026-11-16-L4-东征西征与会师核查-plan.md`
- `docs/conversations/2026-11-16-L4-东征西征与会师核查.md`

---

## [v1.0.60] - 2026-11-16

### Fixed
- 十万坪大捷坐标由 `109.95,29.15` 改为 `109.828,29.204`（永顺万坪镇龙家寨，旧称龙家寨，镇政府驻十万坪）：原坐标落在永顺县城与塔卧之间，距实际战场约 30km。
- 桑植出发长征坐标由 `110.16,29.4` 改为 `110.23137,29.4593`（刘家坪白族乡，誓师地在干田坝）。
- 忠堡大捷坐标改为 `109.27604,29.67758`（忠堡镇，战场在忠堡与构皮岭之间），日期补 `endDate: 1935-06-14`。
- 湘鄂川黔「围剿」事件坐标由 `109.95,29.15` 改为永顺县城 `109.84987,28.99968`。
- 苏区内部机动线删去龙山、来凤两个据点：来凤 1935 年 6 月起为国民党军第 41 师驻地，龙山县城由刘文华团等据守，均非红军驻地。

### Added
- 省委机关迁塔卧（12/10）、收复桑植县城（4/16）、省委机关迁茨岩塘（5/6）、围攻龙山县城（6/18—7/27）、芭蕉坨战斗（8/8）5 个事件。
- order 20「龙家寨（十万坪）—永顺」11/16—11/18：十万坪夜追、18 日重占永顺。
- order 22「茨岩塘—芭蕉坨（设伏）」8/7—8/8：两万红军趁夜奔赴芭蕉坨、凉风洞、欧溪坪、花鹿溪一线设伏。

### Changed
- order 1 终点改为永顺县城、结束日改 11/7；南腰界、百户司、招头寨入正文。
- order 2 拆为「永顺—龙家寨（十万坪）」11/13—11/16 与「永顺—桑植」11/18—11/24：11/13 弃永顺北撤诱敌、11/16 伏击、11/18 重占，桑植占领日两说并存。
- order 3 起点由龙家寨改为塔卧；order 13 补两河口 `110.03023,29.45328`、桃子溪 `110.056,29.309`，终点改桑植县城。
- order 4 由「来凤—三胡—忠堡」改为「沙道沟—高罗—忠堡」6/2—6/14：6/2 进至沙道沟、高罗，6/9 夜围宣恩调敌，6/12 急进，6/14 俘张振汉。
- order 5 由「来凤—李家河—板栗园」改为「沙道沟—板栗园」8/2—8/3：8/2 沙道沟佯动、8/3 高罗与李家河之间揳入、11 时到利福田。
- order 14 由「忠堡—来凤」改为「忠堡—龙山县城（回师）」6/14—6/18；order 15 改为「板栗园—茨岩塘（回师根据地）」8/3—8/6。
- order 16—19 重画为四条苏区常驻线：桑植—塔卧（1934-12-10—1935-02-28）、塔卧—兴隆街、兴隆街—茨岩塘、兴隆街—沙道沟。
- 事件总数 849 → 854，long-march 233 → 238，路线段 643 → 646；数据版本 `2026-11-16-04385a402e70`。
- 全仓版本由 `1.0.59` 升级为 `1.0.60`，构建号 `10060`。

### Docs
- `docs/research/route-endpoints/long-march.md`（新增 L3 台账与实施记录）
- `docs/plans/2026-11-16-L3-红二六苏区核查-design.md`
- `docs/plans/2026-11-16-L3-红二六苏区核查-plan.md`
- `docs/conversations/2026-11-16-L3-红二六苏区核查.md`

---

## [v1.0.59] - 2026-11-16

### Fixed
- 老木孔事件坐标由 `106.591,27.385`（沙土镇）改为 `106.541,27.4852`（木孔镇）：老木孔今属金沙县木孔镇，原坐标距实际位置约 12km。
- order 22 华弹坐标由 `102.83,26.72` 改为 `102.866,26.922`（宁南华弹镇，旧称洼乌）：原坐标落在其南约 22km 的江边，导致华弹—宁南一段方向错误。

### Added
- 马鬃岭分兵与长干山、枫香坝佯动（3/27—3/31）：补齐九军团四渡赤水后以马鬃岭为枢纽、分向长干山与枫香坝伪装主力的史实，附朱德电令原文与马鬃岭地望三说。
- 冬瓜坪战斗（5/7）：渡江后三路北进、两路会合冬瓜坪，歼敌一个营；保留 5/15、两个营的异说。
- 华弹阻敌（5/12—5/15）：隔金沙江阻击周浑元、李韫珩部，掩护主力渡江与会理会议。
- 礼州会合（5/21）：九军团经五道箐、大箐梁子、大石板进抵礼州，与红三军团会合，结束五十余天单独行动。

### Changed
- order 36 顶点改为太平渡—马鬃岭—长干山—枫香坝—沙土—老木孔—瓢儿井—毕节—纳雍—水城—盘县—平彝—宣威—者海—会泽，起点日改为 1935-03-22（四渡赤水当日）。
- order 22 顶点由 8 个扩为 17 个，按 5/4—5/21 逐日行程重画：树桔渡—汪家坪—冬瓜坪—塘房—红果—新龙—华弹—宁南—松新—普格—五道箐—大箐梁子—大石板—小庙—礼州。
- 事件总数 845 → 849，long-march 229 → 233；数据版本 `2026-11-16-d32e5709e7e3`。
- 全仓版本由 `1.0.58` 升级为 `1.0.59`，构建号 `10059`。

### Docs
- `docs/research/route-endpoints/long-march.md`（新增 L2 台账与实施记录）
- `docs/plans/2026-11-16-L2-红九军团核查-design.md`
- `docs/plans/2026-11-16-L2-红九军团核查-plan.md`
- `docs/conversations/2026-11-16-L2-红九军团核查.md`

---

## [v1.0.58] - 2026-11-16

### Fixed
- order 21（红三军团右纵队）起点由曲靖改为富源，经白水、沾益到寻甸：史料显示三军团 4/26 由富源寨子口至白水，4/27 由白水出发，4/28 撤出沾益往寻甸，并未经过曲靖城。
- order 36（红九军团）起点由示意分兵点改为太平渡，删除 order 19 上的 `106.369,27.61` 假分兵点：九军团 3/21—22 随主力由太平渡、二郎滩四渡赤水，3/24 起在长干山、枫香坝佯动。

### Changed
- order 43 名称补曲靖，描述补 4/27 曲靖珠街至马龙鸡头村 85 里行军与当晚克马龙。
- order 44 补广顺、岩腊两个中间落点：4/13 广顺→4/14 岩腊→江龙。
- order 45 补望谟：4/16 紫云纳寒→望谟坡架、观文、播东、羊架→者坪→册亨。
- 新增 `docs/research/route-endpoints/long-march.md` 台账，记录 L1 六条的研究问题、史实结论、出处与处理。
- 事件与路线段：229 事件 / 121 路线段；全项目 845 事件 / 641 路线段。
- 搜索索引：11 专题 / 845 事件 / 1993.6 KB；数据版本 `2026-11-16-7f64a0f49d1b`。
- 全仓版本由 `1.0.57` 升级为 `1.0.58`，构建号 `10058`。

### Docs
- `docs/research/route-endpoints/long-march.md`
- `docs/plans/2026-11-16-L1-滇东分路核查-design.md`
- `docs/plans/2026-11-16-L1-滇东分路核查-plan.md`
- `docs/conversations/2026-11-16-L1-滇东分路核查.md`

---

## [v1.0.57] - 2026-11-16

### Added
- 《端点史实核查》计划新增 C0 长征专题，分 L1—L5 五批：滇东分路与金沙江、红九军团、红二六苏区、1936 东征西征、雪山草地与懋功—毛儿盖—包座。
- 明确长征专题 `check:heads = 0` 不等于已核实：M144—M159 的曲靖、长顺、`106.369,27.61`、原路回师、常驻线等示意连接必须按同一标准重查。

### Changed
- 第一批由 C1 三国改为 C0/L1：中央红军 1935 年 4—5 月滇东与金沙江。
- 全仓版本由 `1.0.56` 升级为 `1.0.57`，构建号 `10057`。

### Docs
- `docs/plans/2026-11-16-端点史实核查-plan.md`（新增 C0）
- `docs/conversations/2026-11-16-端点史实核查.md`（新增长征补充）

---

## [v1.0.56] - 2026-11-16

### Added
- 新增《端点史实核查》方案与计划：以史学查证为核心，先查线头的前置事实、线尾的后续事实，再决定是否补线。
- 新增按历史战役簇分批的实施表（三国、隋唐、宋元、明清、抗日三组），每簇列出研究问题与候选来源。
- 新增端点核查台账规范：`docs/research/route-endpoints/<atlas>.md`，逐条记录研究问题、史实结论、出处与处理。

### Changed
- 旧的《全量路线端点清理》计划标注为已被取代，保留其 62 个端点的基线清单。
- 明确处理方式只允许四种：补前置/后续路线段、补前置/后续事件、改坐标/拆段、有据的独立端点（附来源）；不允许「为了通过检查」的示意连接。
- 全仓版本由 `1.0.55` 升级为 `1.0.56`，构建号 `10056`。

### Docs
- `docs/plans/2026-11-16-端点史实核查-design.md`
- `docs/plans/2026-11-16-端点史实核查-plan.md`
- `docs/conversations/2026-11-16-端点史实核查.md`

---

## [v1.0.55] - 2026-11-16

### Added
- 《全量路线端点清理》方案与计划：盘点全部 11 个专题，给出 62 个无来由端点的基线、A—E 分类、8 批实施顺序与验收标准。
- 计划附录列出当前 62 个端点的专题、实体、order、端点、路线、最近路线/事件距离，便于逐条销项。

### Changed
- 明确「彻底消除」的口径：有来路/有后续或史料明确的独立起终点；allowlist 必须写 reason/source。
- 全仓版本由 `1.0.54` 升级为 `1.0.55`，构建号 `10055`。

### Docs
- `docs/plans/2026-11-16-全量路线端点清理-design.md`
- `docs/plans/2026-11-16-全量路线端点清理-plan.md`
- `docs/conversations/2026-11-16-全量路线端点清理.md`

---

## [v1.0.54] - 2026-11-16

### Fixed
- 龙山、来凤不再「凭空出现」：苏区内部机动线改为常驻线，进入起始日后整段显示，不再按日期比例截断。

### Added
- 路线扩展支持 `static: true`；渲染时该标记的路线不做逐日推进。

### Changed
- 永顺—桑植（order 2）、桑植—龙山（order 16）、龙山—来凤（order 17）标记为 `static: true`。
- 事件与路线段总数不变：229 事件 / 121 路线段；全项目 845 事件 / 641 路线段。
- 搜索索引：11 专题 / 845 事件 / 1993.6 KB；数据版本 `2026-11-16-d97feab94f29`。
- 全仓版本由 `1.0.53` 升级为 `1.0.54`，构建号 `10054`。

### Docs
- `docs/plans/2026-11-16-M159-常驻线-design.md`
- `docs/plans/2026-11-16-M159-常驻线-plan.md`
- `docs/conversations/2026-11-16-M159-常驻线.md`

---

## [v1.0.53] - 2026-11-16

### Fixed
- 陈家河战斗不再是线尾：改为「龙家寨—陈家河—桃子溪—桑植」连续路线，补上 4/15 桃子溪全歼 174 旅与 4/16 收复桑植县城的一段。
- 「陈家河战斗」事件改名为「陈家河—桃子溪战役」，日期 4/12—4/16，坐标改为陈家河镇 `109.976, 29.483`，正文补桃子溪与收复桑植。

### Changed
- order 3 由「桑植—陈家河」改为「龙家寨—陈家河」（4/12—4/13）。
- order 13 由「陈家河—桑植（回师）」改为「陈家河—桃子溪—桑植（追击与收复）」，类型 `retreat` → `advance`（4/14—4/16）。
- 忠堡、板栗园回师日期对齐战斗日：order 4/14 改为 6/11—6/12、6/12；order 5/15 改为 8/2—8/3、8/3，战斗当天即可看到回师虚线。
- 事件与路线段：229 事件 / 121 路线段；全项目 845 事件 / 641 路线段。
- 搜索索引：11 专题 / 845 事件 / 1993.6 KB；数据版本 `2026-11-16-616f378c6fc4`。
- 全仓版本由 `1.0.52` 升级为 `1.0.53`，构建号 `10053`。

### Docs
- `docs/plans/2026-11-16-M158-陈家河桃子溪追击线-design.md`
- `docs/plans/2026-11-16-M158-陈家河桃子溪追击线-plan.md`
- `docs/conversations/2026-11-16-M158-陈家河桃子溪追击线.md`

---

## [v1.0.52] - 2026-11-16

### Added
- `AGENTS.md` 第 4 节新增第 8 条「路线端点铁律」：不准出现无来由的线头，也不准出现无后续的线尾；例外必须写入 `route-endpoints.allow.json` 并注明原因。
- 新增 `scripts/check-route-endpoints.ts` 与 `pnpm check:heads`：按实体检查端点是否接到同实体路线或事件，豁免防线、航线、补给线、`kmt-*` 与首末条路线。
- 长征新增事件「红二军第六师占领康县」（1936-09-19），锚定成徽两康战役路线南端。

### Changed
- `.githooks/pre-commit`：有路线文件改动时，对改动专题运行 `pnpm check:heads --atlas <id>`，失败即拒绝提交。
- `scripts/deploy.sh` 前置检查新增 `pnpm check:heads`。
- 「甘孜会师」事件补挂红六军团；红六军团石鼓—甘孜路线结束日 6/23 → 7/2，覆盖会师日期。
- 事件与路线段：229 事件 / 121 路线段；全项目 845 事件 / 641 路线段。
- 搜索索引：11 专题 / 845 事件 / 1991.1 KB；数据版本 `2026-11-16-b931cacdfe4a`。
- 全仓版本由 `1.0.51` 升级为 `1.0.52`，构建号 `10052`。

### Docs
- `docs/plans/2026-11-16-M157-路线端点铁律-design.md`
- `docs/plans/2026-11-16-M157-路线端点铁律-plan.md`
- `docs/conversations/2026-11-16-M157-路线端点铁律.md`

---

## [v1.0.51] - 2026-11-16

### Changed
- 忠堡出击线与回师线补三胡乡途中点：order 4「来凤—三胡—忠堡」、order 14「忠堡—三胡—来凤」。
- 板栗园出击线与回师线补李家河镇途中点：order 5「来凤—李家河—板栗园」、order 15「板栗园—李家河—来凤」。
- 三胡、李家河取 OSM 乡镇点，作为途中代表点，路线仍为示意。
- 事件与路线段总数不变：228 事件 / 121 路线段；全项目 844 事件 / 641 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-16-64445b58ed3d`。
- 全仓版本由 `1.0.50` 升级为 `1.0.51`，构建号 `10051`。

### Docs
- `docs/plans/2026-11-16-M156-忠堡板栗园道路细化-design.md`
- `docs/plans/2026-11-16-M156-忠堡板栗园道路细化-plan.md`
- `docs/conversations/2026-11-16-M156-忠堡板栗园道路细化.md`

---

## [v1.0.50] - 2026-11-16

### Fixed
- 忠堡大捷坐标由 `109.15, 29.55` 改为忠堡镇 `109.273, 29.676`，补 `locationPrecision: approx`。
- 板栗园大捷坐标由宣恩县城 `109.49, 29.99` 改为板栗园村 `109.408, 29.66`，补 `locationPrecision: approx`，修正约 38km 偏差。

### Changed
- 忠堡、板栗园两次出击改从来凤出发、回师来凤：order 4「来凤—忠堡」、order 5「来凤—板栗园」、order 14「忠堡—来凤」、order 15「板栗园—来凤」。
- 新增 order 17「龙山—来凤（苏区内部机动线）」，把来凤接回桑植—龙山—永顺苏区。
- 长征专题 228 事件 / 120 → 121 路线段；全项目 844 事件 / 640 → 641 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-16-acdfe43ae376`。
- 全仓版本由 `1.0.49` 升级为 `1.0.50`，构建号 `10050`。

### Docs
- `docs/plans/2026-11-16-M155-苏区网络细化-design.md`
- `docs/plans/2026-11-16-M155-苏区网络细化-plan.md`
- `docs/conversations/2026-11-16-M155-苏区网络细化.md`

---

## [v1.0.49] - 2026-11-16

### Changed
- 陈家河战斗出击线由「永顺—陈家河」改为「桑植—陈家河」，从最近的根据地落点出发。
- 忠堡大捷出击线由「永顺—忠堡」改为「龙山—忠堡」。
- 板栗园大捷出击线由「永顺—板栗园」改为「龙山—板栗园」。
- 回师线相应缩短：order 14「忠堡—龙山」、order 15「板栗园—龙山」；三次出击不再都从十万坪起画。
- 新增 order 16「桑植—龙山（苏区内部机动线）」，作为三次出击的根据地连接线，类型 `other`。
- 长征专题 228 事件 / 119 → 120 路线段；全项目 844 事件 / 639 → 640 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-16-cc93b2b23d35`。
- 全仓版本由 `1.0.48` 升级为 `1.0.49`，构建号 `10049`。

### Docs
- `docs/plans/2026-11-16-M154-苏区出击重排-design.md`
- `docs/plans/2026-11-16-M154-苏区出击重排-plan.md`
- `docs/conversations/2026-11-16-M154-苏区出击重排.md`

---

## [v1.0.48] - 2026-11-16

### Added
- 长征新增红二军团回师路线 3 段：order 13「陈家河—桑植」（4/14）、order 14「忠堡—龙山—桑植」（6/13—6/15）、order 15「板栗园—鹤峰—桑植」（8/4—8/6），均为 `retreat`。

### Changed
- 陈家河、忠堡、板栗园三段苏区出击线不再断头：出击 → 战后回师桑植 → 苏区主线「永顺—桑植」形成闭环。
- 龙山、鹤峰取 OSM 县城点作为回师途中代表点，回师道路为示意。
- 长征专题 228 事件 / 116 → 119 路线段；全项目 844 事件 / 636 → 639 路线段。
- `updatedAt` 更新为 2026-11-16；搜索索引 11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-16-307e2259ec05`。
- 全仓版本由 `1.0.47` 升级为 `1.0.48`，构建号 `10048`。

### Docs
- `docs/plans/2026-11-16-M153-苏区三战回师-design.md`
- `docs/plans/2026-11-16-M153-苏区三战回师-plan.md`
- `docs/conversations/2026-11-16-M153-苏区三战回师.md`

---

## [v1.0.47] - 2026-11-16

### Added
- 事件聚合点在高缩放级别（12 级以上）自动散开：同一地点约 100m 内的多个事件按 22px 半径环状分布，每个事件都有自己的圆点，可直接点开详情。
- 位置本就分开的事件保持原坐标，不做偏移。

### Changed
- 低于 12 级仍显示数字圈；点击数字圈放大 2 级（上限 12 级），到达 12 级后自动散开。
- `MarkerEntry` 由持有整个聚合组改为持有事件数组，新增 `MarkerGroup` 统一聚合点与散开点。
- 全仓版本由 `1.0.46` 升级为 `1.0.47`，构建号 `10047`。

### Docs
- `docs/plans/2026-11-16-M152-聚合点散开-design.md`
- `docs/plans/2026-11-16-M152-聚合点散开-plan.md`
- `docs/conversations/2026-11-16-M152-聚合点散开.md`

---

## [v1.0.46] - 2026-11-15

### Added
- 长征新增中央红军 order 46「大树堡—晒经关—河南站—安顺场（红五团撤离返回）」（1935-05-26—05-27，`retreat`），接住大树堡佯动的尾端。

### Changed
- 大树堡佯攻（order 25）与撤离返回（order 46）、安顺场北上（order 26）形成完整闭环，红五团回到主力序列。
- 撤离路线按四川省地方志工作办公室《抢渡大渡河之四：佯攻大树堡》写为经晒经关、河南站、平坝、窑厂、翻竹马垭口。
- 事件与路线段：228 事件 / 116 路线段；全项目 844 事件 / 636 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-15-bdc59c7d8e7f`。
- 全仓版本由 `1.0.45` 升级为 `1.0.46`，构建号 `10046`。

### Docs
- `docs/plans/2026-11-15-M151-大树堡撤离返回-design.md`
- `docs/plans/2026-11-15-M151-大树堡撤离返回-plan.md`
- `docs/conversations/2026-11-15-M151-大树堡撤离返回.md`

---

## [v1.0.45] - 2026-11-15

### Fixed
- order 36（红九军团单独行动）起点由老木孔前推到长干山、枫香坝一带，接上 order 19 主线，不再无来路；起始日 4/3 → 3/24。
- order 19 在太平渡与 106.58,27.27 之间补分兵顶点 `106.369,27.61`，作为九军团离开主力的接口，主线形状不变。

### Changed
- order 36 名称改为「长干山—枫香坝—老木孔—瓢儿井—毕节—盘县—宣威—会泽（红九军团单独行动）」，正文补四渡赤水后佯动、南渡受阻与老木孔伏击经过。
- 马鬃岭位置三说（播州苟坝、金沙、仁怀）与佯动起始日三说（24/27/30 日）在正文并列，不单选。
- 事件与路线段总数不变：228 事件 / 115 路线段；全项目 844 事件 / 635 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-15-d503e5d65934`。
- 全仓版本由 `1.0.44` 升级为 `1.0.45`，构建号 `10045`。

### Docs
- `docs/plans/2026-11-15-M150-红九军团起点-design.md`
- `docs/plans/2026-11-15-M150-红九军团起点-plan.md`
- `docs/conversations/2026-11-15-M150-红九军团起点.md`

---

## [v1.0.44] - 2026-11-15

### Added
- 路线图层每个主体行新增两个按钮：「显示该路线/隐藏该路线」（眼睛图标，隐藏时带斜线）与「独显该路线（隐藏其他）」（准星图标）。
- 「路线图层」标题右侧新增「全显」按钮，全部主体已显示时自动禁用。

### Changed
- 独显按钮可再次点击，恢复独显前的图层选择；切换显示、恢复分享状态或切换专题时清空恢复快照。
- 行内颜色圆点与名称仍可点击切换，保留原有的大目标操作。
- 中英文案新增 `legend.show`、`legend.hide`、`legend.solo`、`legend.showAll`。
- 全仓版本由 `1.0.43` 升级为 `1.0.44`，构建号 `10044`。

### Docs
- `docs/plans/2026-11-15-M149-路线图层显示控制-design.md`
- `docs/plans/2026-11-15-M149-路线图层显示控制-plan.md`
- `docs/conversations/2026-11-15-M149-路线图层显示控制.md`

---

## [v1.0.43] - 2026-11-15

### Fixed
- order 21（右纵队）起点由沾益前推到曲靖，接上 order 37 主线，消除 9.7km 悬空线头。
- order 43（左纵队）起点由马龙前推到曲靖，接上 order 37 主线，消除 9.9km 悬空线头。
- order 24 在西昌与 102.2,28.3 之间插入礼州顶点，接住 order 22（红九军团归建）终点。
- order 3 第三个顶点由 111.05,25.6 改为文市镇实际坐标 111.1946,25.6784，后卫线 order 5 线头随之接上。
- 事件「桑植出发长征」补挂红六军团，红六军团 order 2 起点不再无事件锚点。

### Changed
- 专题描述与事件总数不变：228 事件 / 115 路线段；全项目 844 事件 / 635 路线段。
- 搜索索引：11 专题 / 844 事件 / 1988.0 KB；数据版本 `2026-11-15-e4a2314b1e87`。
- 全仓版本由 `1.0.42` 升级为 `1.0.43`，构建号 `10043`。

### Docs
- `docs/plans/2026-11-15-M148-线头审计-design.md`
- `docs/plans/2026-11-15-M148-线头审计-plan.md`
- `docs/conversations/2026-11-15-M148-线头审计.md`

---

## [v1.0.42] - 2026-11-15

### Fixed
- order 44 起点由镇宁改为长顺，经江龙南下坝草，接上 order 19 的长顺顶点，消除悬空线头；起始日 4/15 → 4/13，与分路电令同日。
- order 19 正文补充「4 月 13 日在长顺分左右两路纵队」。

### Changed
- 专题描述中的右路线名由「镇宁—坝草—白层—贞丰」改为「长顺—江龙—坝草—白层—贞丰」。
- 事件、路线段总数不变：228 事件 / 115 路线段；全项目 844 事件 / 635 路线段。
- 搜索索引：11 专题 / 844 事件 / 1987.9 KB；数据版本 `2026-11-15-8a021e7b42b3`。
- 全仓版本由 `1.0.41` 升级为 `1.0.42`，构建号 `10042`。

### Docs
- `docs/plans/2026-11-15-M147-右路线头接回长顺-design.md`
- `docs/plans/2026-11-15-M147-右路线头接回长顺-plan.md`
- `docs/conversations/2026-11-15-M147-右路线头接回长顺.md`

---

## [v1.0.41] - 2026-11-15

### Added
- 长征新增中央红军路线段 2 条：order 44「镇宁—坝草—白层—贞丰（右路纵队·红三军团抢渡北盘江）」（4/15—4/18）、order 45「紫云—册亨—安龙—兴仁（左路纵队·红一军团与军委纵队抢渡北盘江）」（4/16—4/20）。

### Changed
- order 19 终点由白层改为紫云（3/22—4/16），不再把左路纵队的紫云来路画到右路纵队的白层渡口。
- order 37 起点仍为白层，正文补左右两路纵队与坝草至坡扪、白层、者坪至弄洋三座浮桥。
- 4 月 17—18 日贞丰一带显示三组线（右路 44 → 37、左路 45、红九军团 36）。
- 长征专题 228 事件不变，路线段 113 → 115；全项目 844 事件不变，路线段 633 → 635。
- 专题描述补充北盘江两岸分线一段。
- 搜索索引：11 专题 / 844 事件 / 1987.9 KB；数据版本 `2026-11-15-975b485a5095`。
- 全仓版本由 `1.0.40` 升级为 `1.0.41`，构建号 `10041`。

### Docs
- `docs/plans/2026-11-15-M146-北盘江两岸分线-design.md`
- `docs/plans/2026-11-15-M146-北盘江两岸分线-plan.md`
- `docs/conversations/2026-11-15-M146-北盘江两岸分线.md`

---

## [v1.0.40] - 2026-11-15

### Added
- 长征新增中央红军 order 43「马龙—嵩明—禄劝（左纵队·红一军团）」（1935-04-27—05-01）。

### Changed
- order 37 改为中央纵队：去掉嵩明、禄劝折点，路线为「北盘江—兴仁—兴义—富源—曲靖—寻甸—柯渡—皎平渡」，消除嵩明—寻甸之字形。
- order 21 由「禄劝—马鹿塘—洪门渡」前推为「沾益—寻甸—禄劝—马鹿塘—洪门渡（右纵队·红三军团）」，起始日 5/3 → 4/27。
- 4 月 27 日起地图上稳定显示三路主纵队（左、右、中央）加红九军团一路；此前 4 月 19—30 日只有两路。
- 长征专题 228 事件不变，路线段 112 → 113；全项目 844 事件不变，路线段 632 → 633。
- 专题描述补充三路纵队分线一段。
- 搜索索引：11 专题 / 844 事件 / 1987.9 KB；数据版本 `2026-11-15-b2f41f49cebb`。
- 全仓版本由 `1.0.39` 升级为 `1.0.40`，构建号 `10040`。

### Docs
- `docs/plans/2026-11-15-M145-三路纵队分线-design.md`
- `docs/plans/2026-11-15-M145-三路纵队分线-plan.md`
- `docs/conversations/2026-11-15-M145-三路纵队分线.md`

---

## [v1.0.39] - 2026-11-15

### Added
- 长征新增中央红军路线段 3 条：order 40「夹金山—达维—懋功」（6/12—6/18）、order 41「延川—石楼—关上村—兑九峪—延川（东征）」（1936-02-20—05-18）、order 42「延川—盐池—豫旺堡—同心—界石铺—青江驿—会宁（西征与南下接应）」（1936-05-19—10-09）。

### Changed
- 退役 order 27「泸定—夹金山」；order 39 由硗碛延伸到夹金山，结束日 6/11 → 6/12，补齐夹金山—达维—懋功 50.6km 断头线。
- order 28 起始日 6/13 → 6/19，把懋功会师（6/18）交由 order 40 覆盖。
- order 22 由「会泽—拖布卡—树桔渡」延伸为「会泽—拖布卡—树桔渡—华弹—宁南—普格—礼州」（5/4—5/21），红九军团归建；按史料改走会理以东的宁南—普格一线，不再按原「树桔渡—会理」假设补线。
- order 19 截到北盘江（3/22—4/18），去掉昆明以南 102.83,24.88 虚构折点；order 37 承接北盘江—禄劝—皎平渡全段（4/16—5/3）。
- order 34「直罗镇—会宁」（跨 11 个月）拆为「直罗镇—延川（东征准备）」，1936 年东征、西征与南下接应另立 order 41、42。
- 主链 30 段首尾距离全部 0.0km（校订前 26 段、27→28 一处 50.6km）。
- 长征专题 228 事件不变，路线段 110 → 112；全项目 844 事件不变，路线段 630 → 632。
- 专题描述补充中央红军路线网结构校订一段。
- 搜索索引：11 专题 / 844 事件 / 1987.9 KB；数据版本 `2026-11-15-b3644b4cc75c`。
- 全仓版本由 `1.0.38` 升级为 `1.0.39`，构建号 `10039`。

### Docs
- `docs/plans/2026-11-15-M144-中央红军路线网结构校订-design.md`
- `docs/plans/2026-11-15-M144-中央红军路线网结构校订-plan.md`
- `docs/conversations/2026-11-15-M144-中央红军路线网结构校订.md`

---

## [v1.0.38] - 2026-11-15

### Added
- 长征新增 5 个 1935 年 7 月中旬至 8 月下旬事件：中共中央进驻黑水芦花寨、毛儿盖战斗、毛儿盖筹粮与「割麦证」、松潘战役计划流产与《夏洮战役计划》、右路军先头部队从毛儿盖出发过草地。

### Changed
- 红四方面军 order 2（懋功—会宁，示意）在芦花与 103.6,32.65 之间插入毛儿盖顶点，修正绕过毛儿盖约 45km 的偏差。
- 长板山、昌德山、达古山、芦花会议、沙窝会议、毛儿盖会议、过草地、包座战役与新增点位互挂关联。
- 长征专题 223 → 228 事件，路线段保持 110；全项目 839 → 844 事件，630 路线段不变。
- 专题描述补充黑水芦花至毛儿盖出发过草地的一段。
- 搜索索引：11 专题 / 844 事件 / 1987.9 KB；数据版本 `2026-11-15-e6ec1b9cd1c2`。
- 全仓版本由 `1.0.37` 升级为 `1.0.38`，构建号 `10038`。

### Docs
- `docs/plans/2026-11-15-M143-黑水芦花与毛儿盖-design.md`
- `docs/plans/2026-11-15-M143-黑水芦花与毛儿盖-plan.md`
- `docs/conversations/2026-11-15-M143-黑水芦花与毛儿盖.md`

---

## [v1.0.37] - 2026-11-15

### Added
- 长征新增 4 个 1935 年 6 月下旬至 7 月初事件：懋功会师联欢会、两河口会师大会与张国焘到两河口、攻占卓克基与进驻官寨、卓克基会议。

### Changed
- 懋功会师、两河口会议、翻越梦笔山、芦花会议与新增点位互挂关联。
- 长征专题 219 → 223 事件，路线段保持 110（order 28 顶点已覆盖）；全项目 835 → 839 事件，630 路线段不变。
- 专题描述补充懋功会师之后至卓克基的一段。
- 搜索索引：11 专题 / 839 事件 / 1951.0 KB；数据版本 `2026-11-15-3b21daec48d8`。
- 全仓版本由 `1.0.36` 升级为 `1.0.37`，构建号 `10037`。

### Docs
- `docs/plans/2026-11-15-M142-懋功会师之后-design.md`
- `docs/plans/2026-11-15-M142-懋功会师之后-plan.md`
- `docs/conversations/2026-11-15-M142-懋功会师之后.md`

---

## [v1.0.36] - 2026-11-15

### Added
- 长征新增 3 个 1935 年 6 月初荥经段事件：茶合岗空袭与胡长保牺牲、水子地集结待机、翻越泡桐岗。

### Changed
- 飞越岭、占领天全、突破芦山宝兴防线与新增点位互挂关联。
- 长征专题 216 → 219 事件，路线段保持 110（order 39 已覆盖，点位偏差均在 30km 内）；全项目 832 → 835 事件，630 路线段不变。
- 专题描述补充中央红军经荥经翻越泡桐岗的一段。
- 搜索索引：11 专题 / 835 事件 / 1925.1 KB；数据版本 `2026-11-15-c514866eb4ee`。
- 全仓版本由 `1.0.35` 升级为 `1.0.36`，构建号 `10036`。

### Docs
- `docs/plans/2026-11-15-M141-荥经泡桐岗-design.md`
- `docs/plans/2026-11-15-M141-荥经泡桐岗-plan.md`
- `docs/conversations/2026-11-15-M141-荥经泡桐岗.md`

---

## [v1.0.35] - 2026-11-15

### Added
- 长征新增 4 个 1935 年 5—6 月红四方面军事件：土门战役、千佛山阻击战、占领茂县、攻占懋功与前出达维。

### Changed
- 嘉陵江战役、达维会师、懋功会师与新增点位互挂关联。
- 长征专题 212 → 216 事件，路线段保持 110（红四方面军 order 1 已覆盖江油—茂县—懋功）；全项目 828 → 832 事件，630 路线段不变。
- 专题描述补充红四方面军西进岷江与迎接中央红军的一段。
- 搜索索引：11 专题 / 832 事件 / 1902.2 KB；数据版本 `2026-11-15-a62e008bb15a`。
- 全仓版本由 `1.0.34` 升级为 `1.0.35`，构建号 `10035`。

### Docs
- `docs/plans/2026-11-15-M140-红四西进岷江-design.md`
- `docs/plans/2026-11-15-M140-红四西进岷江-plan.md`
- `docs/conversations/2026-11-15-M140-红四西进岷江.md`

---

## [v1.0.34] - 2026-11-15

### Added
- 长征新增 6 个 1935 年 5 月底至 6 月中旬事件：化林坪战斗、飞越岭战斗、泸定会议、占领天全、突破芦山宝兴防线、大硗碛休整与翻山动员。
- 新增中央红军 order 39 路线：泸定—化林坪—飞越岭—汉源—荥经—天全—芦山—宝兴—硗碛。

### Changed
- 飞夺泸定桥、翻越夹金山与新增点位互挂关联。
- 长征专题 206 → 212 事件，109 → 110 路线段；全项目 822 → 828 事件，629 → 630 路线段。
- 专题描述补充泸定桥之后至夹金山之前的一段。
- 搜索索引：11 专题 / 828 事件 / 1878.4 KB；数据版本 `2026-11-15-f0d31617b8fb`。
- 全仓版本由 `1.0.33` 升级为 `1.0.34`，构建号 `10034`。

### Docs
- `docs/plans/2026-11-15-M139-泸定之后与夹金山前-design.md`
- `docs/plans/2026-11-15-M139-泸定之后与夹金山前-plan.md`
- `docs/conversations/2026-11-15-M139-泸定之后与夹金山前.md`

---

## [v1.0.33] - 2026-11-15

### Added
- 长征新增 3 个 1935 年 5 月初事件：攻占禄劝、攻占武定、占领元谋（红一军团化装智取三城）。
- 新增中央红军 order 38 路线：禄劝—武定—元谋。

### Changed
- 龙街渡佯渡事件与禄劝、武定、元谋三点互挂关联。
- 长征专题 203 → 206 事件，108 → 109 路线段；全项目 819 → 822 事件，628 → 629 路线段。
- 专题描述补充红一军团 5 月 1—3 日化装智取三城。
- 搜索索引：11 专题 / 822 事件 / 1845.8 KB；数据版本 `2026-11-15-ba6a39c262a8`。
- 全仓版本由 `1.0.32` 升级为 `1.0.33`，构建号 `10033`。

### Docs
- `docs/plans/2026-11-15-M138-红一军团智取三城-design.md`
- `docs/plans/2026-11-15-M138-红一军团智取三城-plan.md`
- `docs/conversations/2026-11-15-M138-红一军团智取三城.md`

---

## [v1.0.32] - 2026-11-15

### Added
- 长征新增 4 个 1935 年 4 月事件：抢渡北盘江、逼近昆明、鲁口哨会议与「四·二九」渡江令、柯渡丹桂村部署渡江。
- 新增中央红军 order 37 路线：北盘江—兴仁—兴义—富源—曲靖—嵩明—寻甸—柯渡—禄劝。

### Changed
- 佯攻贵阳事件与北盘江、逼近昆明互挂关联。
- 长征专题 199 → 203 事件，107 → 108 路线段；全项目 815 → 819 事件，627 → 628 路线段。
- 专题描述补充中央红军 1935 年 4 月西进云南与渡江决策。
- 搜索索引：11 专题 / 819 事件 / 1829.1 KB；数据版本 `2026-11-15-8b7d04c3f48c`。
- 全仓版本由 `1.0.31` 升级为 `1.0.32`，构建号 `10032`。

### Docs
- `docs/plans/2026-11-15-M137-中央红军4月西进云南-design.md`
- `docs/plans/2026-11-15-M137-中央红军4月西进云南-plan.md`
- `docs/conversations/2026-11-15-M137-中央红军4月西进云南.md`

---

## [v1.0.31] - 2026-11-15

### Added
- 长征新增 4 个红九军团 1935 年 4—5 月事件：老木孔战斗、智取瓢儿井、进占宣威、攻克会泽（东川）。
- 新增中央红军 order 36 路线：老木孔—金沙—瓢儿井—毕节—盘县—宣威—者海—会泽（红九军团单独行动）。

### Changed
- 佯攻贵阳事件与红九军团四个节点互挂关联。
- 长征专题 195 → 199 事件，106 → 107 路线段；全项目 811 → 815 事件，626 → 627 路线段。
- 专题描述补充红九军团 1935 年 4—5 月单独行动。
- 搜索索引：11 专题 / 815 事件 / 1806.1 KB；数据版本 `2026-11-15-aeb9315aa53d`。
- 全仓版本由 `1.0.30` 升级为 `1.0.31`，构建号 `10031`。

### Docs
- `docs/plans/2026-11-15-M136-红九军团单独行动-design.md`
- `docs/plans/2026-11-15-M136-红九军团单独行动-plan.md`
- `docs/conversations/2026-11-15-M136-红九军团单独行动.md`

---

## [v1.0.30] - 2026-11-15

### Added
- 长征新增 4 个 1936 年 3 月事件：野马川会议、以则河伏击战、哲庄坝伏击战、来宾铺战斗。
- 新增红二方面军（order 12）与红六军团（order 5）乌蒙山回旋路线：毕节—野马川—以则河—哲庄坝—黑石头—来宾铺—盘县。

### Changed
- 扩写乌蒙山回旋战事件：串起野马川会议、以则河、哲庄坝、来宾铺四个子节点，并补入毛泽东的评价。
- 长征专题 191 → 195 事件，104 → 106 路线段；全项目 807 → 811 事件，624 → 626 路线段。
- 专题描述补充乌蒙山回旋战逐点拆分。
- 搜索索引：11 专题 / 811 事件 / 1785.3 KB；数据版本 `2026-11-15-0e780dfa543d`。
- 全仓版本由 `1.0.29` 升级为 `1.0.30`，构建号 `10030`。

### Docs
- `docs/plans/2026-11-15-M135-乌蒙山回旋战逐点拆分-design.md`
- `docs/plans/2026-11-15-M135-乌蒙山回旋战逐点拆分-plan.md`
- `docs/conversations/2026-11-15-M135-乌蒙山回旋战逐点拆分.md`

---

## [v1.0.29] - 2026-11-15

### Added
- 长征新增 3 个 1936 年 9—10 月事件：通庄静会战役、攻克会宁城、青江驿与界石铺会师。
- 新增红四方面军第四军通渭—青江驿—界石铺—会宁路线（order 6）。
- 新增红十五军团骑兵团豫旺堡—同心—会宁奔袭路线（order 11）。

### Changed
- 扩写会宁会师事件：补入 10 月 7—8 日先头会师与 10 月 10 日文庙联欢大会、《大会合通电》。
- 长征专题 188 → 191 事件，102 → 104 路线段；全项目 804 → 807 事件，622 → 624 路线段。
- 专题描述补充通庄静会战役、攻克会宁城与青江驿界石铺会师。
- 搜索索引：11 专题 / 807 事件 / 1763.1 KB；数据版本 `2026-11-15-cb4064ebdf7e`。
- 全仓版本由 `1.0.28` 升级为 `1.0.29`，构建号 `10029`。

### Docs
- `docs/plans/2026-11-15-M134-通庄静会战役与会宁攻城-design.md`
- `docs/plans/2026-11-15-M134-通庄静会战役与会宁攻城-plan.md`
- `docs/conversations/2026-11-15-M134-通庄静会战役与会宁攻城.md`

---

## [v1.0.28] - 2026-11-15

### Added
- 长征新增 3 个红二方面军 10 月北撤事件：娘娘坝战斗、罗家堡战斗、强渡渭河。
- 新增红二方面军北撤路线（两当—徽县—娘娘坝—罗家堡—磐安—榜罗—通渭—将台堡）。

### Changed
- 长征专题 185 → 188 事件，101 → 102 路线段；全项目 801 → 804 事件，621 → 622 路线段。
- 专题描述补充红二方面军 10 月过渭河北撤节点。
- 搜索索引：11 专题 / 804 事件 / 1744.8 KB；数据版本 `2026-11-15-a871f28944c0`。
- 全仓版本由 `1.0.27` 升级为 `1.0.28`，构建号 `10028`。

### Docs
- `docs/plans/2026-11-15-M133-红二方面军10月北撤-design.md`
- `docs/plans/2026-11-15-M133-红二方面军10月北撤-plan.md`
- `docs/conversations/2026-11-15-M133-红二方面军10月北撤.md`

---

## [v1.0.27] - 2026-11-15

### Added
- 长征新增 4 个 1936 年 8 月事件：岷洮西固战役、夜袭腊子口、二郎山战斗、临潭旧城战斗。

### Changed
- 修正洮州会议坐标：由临潭县城改为临潭新城（今新城镇）。
- 红四方面军路线（order 2）拆分临潭新城、旧城两个控制点。
- 长征专题 181 → 185 事件，路线段仍为 101；全项目 797 → 801 事件，621 → 621 路线段。
- 专题描述补充岷洮西固战役。
- 搜索索引：11 专题 / 801 事件 / 1734.6 KB；数据版本 `2026-11-15-4e016fdbf06e`。
- 全仓版本由 `1.0.26` 升级为 `1.0.27`，构建号 `10027`。

### Docs
- `docs/plans/2026-11-15-M132-岷洮西固战役与二郎山-design.md`
- `docs/plans/2026-11-15-M132-岷洮西固战役与二郎山-plan.md`
- `docs/conversations/2026-11-15-M132-岷洮西固战役与二郎山.md`

---

## [v1.0.26] - 2026-11-15

### Added
- 长征新增 5 个 1936 年会师链事件：成徽两康战役、岷州会议、五龙山阻击战、洮州会议、华家岭阻击战。
- 新增红二方面军成徽两康战役支线（哈达铺—成县—五龙山—徽县—两当—康县）。

### Changed
- 红四方面军路线（order 2）补包座、腊子口、岷县、临潭、通渭、华家岭控制点，结束日期延至 1936-10-23。
- 长征专题 176 → 181 事件，100 → 101 路线段；全项目 792 → 797 事件，620 → 621 路线段。
- 专题描述补充 1936 年 8—10 月会师链节点。
- 搜索索引：11 专题 / 797 事件 / 1718.7 KB；数据版本 `2026-11-15-2652ca514f6e`。
- 全仓版本由 `1.0.25` 升级为 `1.0.26`，构建号 `10026`。

### Docs
- `docs/plans/2026-11-15-M131-1936会师链节点-design.md`
- `docs/plans/2026-11-15-M131-1936会师链节点-plan.md`
- `docs/conversations/2026-11-15-M131-1936会师链节点.md`

---

## [v1.0.25] - 2026-11-15

### Added
- 长征新增 4 个乌江渡口事件：孙家渡、袁家渡、桃子台、楠木渡。

### Changed
- 乌江渡口群路线（order 11）由 3 点扩为 7 点：茶山关—桃子台—楠木渡—孙家渡—江界河—袁家渡—回龙场。
- 长征专题 172 → 176 事件，路线段仍为 100；全项目 788 → 792 事件，620 → 620 路线段。
- 专题描述补充乌江渡口群逐点说明。
- 搜索索引：11 专题 / 792 事件 / 1697.9 KB；数据版本 `2026-11-15-b737e1de28a9`。
- 全仓版本由 `1.0.24` 升级为 `1.0.25`，构建号 `10025`。

### Docs
- `docs/plans/2026-11-15-M130-乌江渡口群补齐-design.md`
- `docs/plans/2026-11-15-M130-乌江渡口群补齐-plan.md`
- `docs/conversations/2026-11-15-M130-乌江渡口群补齐.md`

---

## [v1.0.24] - 2026-11-15

### Added
- 长征新增「将军山战役」事件（1936-02-19 → 02-26，贵州大方）。
- 新增红六军团两段路线：桑植—湘中—石阡—鸭池河—黔西—大定—毕节、毕节—乌蒙山—盘县—普渡河—石鼓。

### Changed
- 红六军团原北上路线顺延为 order 4，删除「1935-11 至 1936-04 段仍待补」。
- 便水战役、鸭池河渡口、乌蒙山回旋战、盘县会议、六甲阻击战、石鼓渡金沙江补挂红六军团。
- 长征专题 171 → 172 事件，98 → 100 路线段；全项目 787 → 788 事件，618 → 620 路线段。
- 搜索索引：11 专题 / 788 事件 / 1684.3 KB；数据版本 `2026-11-15-cb58d90c635c`。
- 全仓版本由 `1.0.23` 升级为 `1.0.24`，构建号 `10024`。

### Docs
- `docs/plans/2026-11-15-M129-红六军团湘黔滇段路线-design.md`
- `docs/plans/2026-11-15-M129-红六军团湘黔滇段路线-plan.md`
- `docs/conversations/2026-11-15-M129-红六军团湘黔滇段路线.md`

---

## [v1.0.23] - 2026-11-14

### Added
- 长征新增 4 个雪山垭口事件：月日茨普、恶热拉山、麦拉山、生欧拉山。

### Changed
- 红二方面军路线（order 8）补月日茨普、中咱、恶热拉、麦拉、盖玉、生欧拉 6 个控制点。
- 长征专题 167 → 171 事件，路线段仍为 98；全项目 783 → 787 事件，618 → 618 路线段。
- 专题描述补充红二军团得荣—巴塘—白玉段垭口。
- 搜索索引：11 专题 / 787 事件 / 1679.2 KB；数据版本 `2026-11-14-de9f7c6ec68d`。
- 全仓版本由 `1.0.22` 升级为 `1.0.23`，构建号 `10023`。

### Docs
- `docs/plans/2026-11-14-M128-红二军团长征北进垭口-design.md`
- `docs/plans/2026-11-14-M128-红二军团长征北进垭口-plan.md`
- `docs/conversations/2026-11-14-M128-红二军团长征北进垭口.md`

---

## [v1.0.21] - 2026-11-14

### Added
- 长征新增 4 个雪山垭口事件：亚洛阔山、沙拥山、伊涅阿山、扎巴加山。
- 新增「夺取瞻化」战斗事件（1936-04-04 夜破城）。
- 新增红四方面军「道孚—瞻化」支线路线（四天翻越四座雪山）。

### Changed
- 长征专题 162 → 167 事件，97 → 98 路线段；全项目 778 → 783 事件，617 → 618 路线段。
- 专题描述补充红四军奔袭瞻化翻越的四座垭口。
- 搜索索引：11 专题 / 783 事件 / 1666.9 KB；数据版本 `2026-11-14-7ee39196a2fb`。
- 全仓版本由 `1.0.20` 升级为 `1.0.21`，构建号 `10021`。

### Docs
- `docs/plans/2026-11-14-M127-瞻化奔袭四座雪山-design.md`
- `docs/plans/2026-11-14-M127-瞻化奔袭四座雪山-plan.md`
- `docs/conversations/2026-11-14-M127-瞻化奔袭四座雪山.md`

---

## [v1.0.22] - 2026-11-14

### Verified
- 独立复核 QuizGo 的收口结果：请求文件 `status: done`；journal 更正行与 `deploy.sh` 写入的
  `22:40:16 / 23:44:40 / 23:46:38` 一致；`status.sh` 公网自探 80/443/8080/8081/8082 全 ✅。
- 从 Mac 公网侧（非 tailnet）复探：80/443/8081/8082 全部超时，22 仍可连（符合 11-21 前保留）。
- 监听仍为 `0.0.0.0:8081` / `0.0.0.0:8082`，即第 2 项撤回后的预期状态；`/srv/backup/pg` 700、
  非 600 文件数 0。

### Added
- AGENTS.md 第 6 节新增「安全组现状（2026-11-14 收口）」：入方向仅 `22→/32`、`UDP 41641`、`ICMP`；
  80/443 已删除且**备案通过当天必须加回**；自探判读法（`28` 已拦 / `7` 放行为异常）；
  22 按源限流、从 ECS 自身探不出差异的局限。
- AGENTS.md 硬性约束新增：安全组 / Tailscale / iptables 属人工；备案前不得出现 80/443。

### Fixed
- 记录一处与对方自述不符：`/srv/backup` 仍为 755（仅 `pg` 收 700），只暴露目录名，非阻塞。

### Docs
- `docs/conversations/2026-11-14-M126-备案前共享面收口确认.md`（新增第三轮：闭环与独立复核）

---

## [v1.0.20] - 2026-11-14

### Changed
- 复核并接受 OpenQuizGo 撤回「nginx 改绑 Tailscale IP」：复跑 bind 测试证实 host 网络
  只保证「能 bind 宿主地址」、不保证「地址已存在」；`docker.service` 与 `tailscaled.service`
  无先后约束，绑定 Tailscale IP 会给 nginx 新增启动依赖。
- 定案：8081/8082 维持 `listen 8081;` / `listen 8082;` + allowlist；第 4 项删除公网 22
  因此可独立执行，复合风险解除。
- 建议 `/srv/ops/bin/status.sh` 增加「公网自探」：8081/8082 期望超时，变 `403`/`200`
  即说明安全组被误开；同时纠正 22 的闭环不能用该探针（规则按源限流，须从 `/32` 侧验）。

### Verified
- 从 ECS 自身探公网 IP：8081/8082/8080 → `exit 28`（filtered），80/443 → `exit 7`（refused）。
  这组基线独立印证「80/443 安全组放行、仅无监听」与「8081 安全组未放行」。

### Docs
- `docs/conversations/2026-11-14-M126-备案前共享面收口确认.md`（新增第二轮记录）

---

## [v1.0.19] - 2026-11-14

### Verified
- 逐项答复 OpenQuizGo 的「备案前共享面收口」4 项提议，全部先实测再表态：
  `status.sh` 无漂移、`conf.d` 仍为 `listen 8081/8082`、`quizgo-ecs` 解析到 `100.65.110.80`、
  `quizgo-web-1` 为 `network_mode: host`。
- 确认 Atlas 无任何脚本依赖 `0.0.0.0:8081`、公网 IP `8.163.122.39` 或 `quizgo-pub`；
  发布自检与请求拉取均走 `ssh quizgo` / `quizgo-ecs`。
- 确认 Atlas 不读 `/srv/backup/pg`，备份权限收紧不影响本站。

### Changed
- 答复写入 `/srv/ops/requests/2026-11-14-quizgo-to-atlas-pre-icp-hardening.md`（`status: open`）：
  第 1、4 项同意，第 2 项同意并附 `network_mode: host` 前提、`nginx -t` 失败回退要求，
  第 3 项无异议。
- 指出第 2 + 第 4 项的复合风险：Tailscale 同时成为 SSH 唯一入口与 nginx bind 依赖，
  要求确认阿里云控制台 VNC 可用并记入 journal。

### Docs
- `docs/conversations/2026-11-14-M126-备案前共享面收口确认.md`

---

## [v1.0.18] - 2026-11-14

### Added
- 长征新增 5 个雪山垭口事件：党岭山（夏羌涅阿）、雅哈雪山、大、小雪山、沙鲁里山、藏巴拉山。
- 新增红六军团 1936 年北上路线：石鼓—中甸—乡城—稻城—理塘—瞻化—甘孜。

### Changed
- 红四方面军路线（order 4）在丹巴—道孚之间补夏羌涅阿垭口。
- 红二方面军路线（order 8）由直线改为石鼓—雅哈—中甸—得荣—巴塘—白玉—甘孜。
- 长征专题 157 → 162 事件，96 → 97 路线段；全项目 773 → 778 事件，616 → 617 路线段。
- 专题描述补充红二、红四方面军雪山垭口说明。
- 搜索索引：11 专题 / 778 事件 / 1650.5 KB；数据版本 `2026-11-14-588ca38bd8b6`。
- 全仓版本由 `1.0.17` 升级为 `1.0.18`，构建号 `10018`。

### Docs
- `docs/plans/2026-11-14-M125-红二红四方面军雪山点位-design.md`
- `docs/plans/2026-11-14-M125-红二红四方面军雪山点位-plan.md`
- `docs/conversations/2026-11-14-M125-红二红四方面军雪山点位.md`

---

## [v1.0.17] - 2026-11-14

### Added
- 长征新增 4 个雪山垭口事件：梦笔山、长板山（雅克夏山）、昌德山（仓德山）、达古山（打古山）。
- 新增卓克基、马塘两个路线控制点。

### Changed
- 合并两条重复的「懋功—毛儿盖」路线为一条：懋功—两河口—梦笔山—卓克基—长板山—芦花—昌德山—达古山—毛儿盖，时间范围 1935-06-13 → 1935-08-20。
- 路线 order 重排，原 30—36 前移为 29—35，保证 1—35 连续唯一。
- 长征专题 153 → 157 事件，97 → 96 路线段；全项目 769 → 773 事件，617 → 616 路线段。
- 专题描述补充雪山垭口点位说明。
- 搜索索引：11 专题 / 773 事件 / 1631.1 KB；数据版本 `2026-11-14-427c7dce2247`。
- 全仓版本由 `1.0.16` 升级为 `1.0.17`，构建号 `10017`。

### Fixed
- 修复 `check:routes` 中长板山因重复路线取错路径而报 38km 超阈值的问题。

### Docs
- `docs/plans/2026-11-14-M124-雪山山口点位数据-design.md`
- `docs/plans/2026-11-14-M124-雪山山口点位数据-plan.md`
- `docs/conversations/2026-11-14-M124-雪山山口点位数据.md`

---

## [v1.0.16] - 2026-11-14

### Added
- 长征「强渡乌江」升级为渡口级：新增江界河、回龙场、茶山关 3 个渡口事件。
- 新增「乌江渡口群（茶山关—江界河—回龙场）」defense 路线。

### Changed
- 强渡乌江坐标由 `107.18, 27.18` 改为江界河渡口 `107.36, 27.28`；补三路渡江、竹筏浮桥与击溃黔军 4000 人。
- 国民党军乌江防线补侯之担部 5 团 1 机炮营、200 里防线与 10 余处渡口。
- 猴场—遵义路线补江界河控制点；原 11—35 段顺延为 12—36。
- 长征专题 150 → 153 事件，96 → 97 路线段；全项目 766 → 769 事件，616 → 617 路线段。
- 搜索索引：11 专题 / 769 事件 / 1619.8 KB；数据版本 `2026-11-14-6e4b9aa4a307`。
- 全仓版本由 `1.0.15` 升级为 `1.0.16`，构建号 `10016`。

### Docs
- `docs/plans/2026-11-14-M123-乌江渡口级数据-design.md`
- `docs/plans/2026-11-14-M123-乌江渡口级数据-plan.md`
- `docs/conversations/2026-11-14-M123-乌江渡口级数据.md`

---

## [v1.0.15] - 2026-11-14

### Added
- 西路军补充 5 个事件：一条山战斗、永昌山丹防御、西洞堡大捷、龙渠会议、星星峡会合。
- 新增「祁连山—星星峡（左支队）」路线。

### Changed
- 西路军专题由 6 事件 / 2 路线段扩为 11 事件 / 3 路线段；时间范围延至 1937-05-07。
- 全项目 761 → 766 事件，615 → 616 路线段。
- 搜索索引：11 专题 / 766 事件 / 1607.2 KB；数据版本 `2026-11-14-89c5914f3204`。
- 全仓版本由 `1.0.14` 升级为 `1.0.15`，构建号 `10015`。

### Docs
- `docs/plans/2026-11-14-M122-西路军补充节点-design.md`
- `docs/plans/2026-11-14-M122-西路军补充节点-plan.md`
- `docs/conversations/2026-11-14-M122-西路军补充节点.md`

---

## [v1.0.14] - 2026-11-14

### Changed
- 提交铁律：每次提交后必须执行 `pnpm release` 更新服务器；只 commit / push 不算完成。
- 第 7.1 节：自 v1.0.14 起每次提交都发布，不再按「用户能否看出区别」攒发布；只改文档、纯重构也必须发。
- 发布被跨项目请求或漂移检查硬拦时，先处理或显式 `--ack-open`，不得跳过。
- 全仓版本由 `1.0.13` 升级为 `1.0.14`，构建号 `10014`。

### Docs
- `docs/conversations/2026-11-14-M121-提交即更新服务器铁律.md`
- `AGENTS.md`

---

## [v1.0.13] - 2026-11-14

### Added
- 长征「巧渡金沙江」升级为点位级：新增金沙江渡江战役、皎平渡、龙街渡、洪门渡、树桔渡、石板河阻击战、通安战斗、皎平渡渡江指挥部 8 个事件。
- 新增龙街渡、洪门渡、树桔渡 3 段渡口支线，使四个渡口与石板河阻击战、通安战斗落到活动路线上。
- 长征「会理—彝海结盟」升级为点位级：新增会理攻城、川军会理防线、泸沽分兵、占领冕宁、彝海结盟 5 个事件。
- 新增川军会理城防短防线，使川军会理防线事件落到活动路线上。
- 长征会议链与封锁线补点：新增国民党军第二道封锁线、扎西会议、苟坝会议、南渡乌江、佯攻贵阳、达维会师、青石嘴战斗、切尾巴战役 8 个事件。
- 新增湘军、粤军各 1 段第二道封锁线短防线。
- 长征北上会议链补点：新增两河口、芦花、沙窝、巴西、俄界 5 个会议事件。
- 红四方面军主线补点：新增强渡嘉陵江、绥崇丹懋战役、天芦名雅邛大战役、百丈关战役、红四方面军二次北上 5 个事件。
- 红二、红六军团 1936 年 1—4 月补点：新增便水战役、鸭池河渡口、盘县会议、普渡河战斗、六甲阻击战 5 个事件。
- 新专题「西路军」：6 个事件（渡黄河、古浪、高台、倪家营子、梨园口、石窝会议）、2 段路线、1 个实体；专题数 10 → 11。

### Changed
- 巧渡金沙江坐标由会东县青龙村附近修正为皎平渡（约 19 km 偏差）；国民党军金沙江封锁坐标同步修正。
- 太平渡—皎平渡路线补禄劝、皎平渡镇控制点，皎平渡—会理路线补通安、铁厂控制点；原 19—32 段顺延为 22—35。
- 会理会议坐标由会理古城修正为城北铁厂村（约 6 km 偏差）；会理—安顺场路线补彝海控制点。
- 于都—宜章路线补城口控制点并改为「突破第二、三道封锁线」；太平渡—皎平渡补南渡乌江；夹金山—懋功补达维。
- 毛儿盖会议坐标由 103.6, 32.65 修正为毛儿盖镇；包座战役坐标改为包座乡并补 `red-4-army`。
- 懋功—毛儿盖路线补两河口、芦花、沙窝；毛儿盖—巴西路线补包座、班佑；巴西—腊子口路线补俄界。
- 红四方面军路线由 3 段增至 4 段：川陕—嘉陵江—懋功、南下、二次北上。
- 桑植—乌蒙山路线补便水、鸭池河；乌蒙山—石鼓路线补盘县、普渡河。
- 长征专题 114 → 150 事件，89 → 96 路线段；全项目 719 → 755 事件，606 → 613 路线段。
- 西路军专题：1936-10-24 → 1937-03-15，6 事件 / 2 路线 / 1 实体，加入 `data/atlases/index.json`。
- 全项目 10 → 11 专题，755 → 761 事件，613 → 615 路线段。
- 搜索索引：11 专题 / 761 事件 / 1592.4 KB；数据版本 `2026-11-14-5b301fe9a896`。
- 移动端内置数据：49 → 52 个文本文件，图片仍 14 个。
- long-march `manifest.json` 的 `updatedAt` 更新为 `2026-11-14`。

### Docs
- `docs/plans/2026-11-14-M120-西路军专题-design.md`
- `docs/plans/2026-11-14-M120-西路军专题-plan.md`
- `docs/conversations/2026-11-14-M120-西路军专题.md`
- `docs/plans/2026-11-14-M119-红二六军团1936年补点-design.md`
- `docs/plans/2026-11-14-M119-红二六军团1936年补点-plan.md`
- `docs/conversations/2026-11-14-M119-红二六军团1936年补点.md`
- `docs/plans/2026-11-14-M118-红四方面军主线补点-design.md`
- `docs/plans/2026-11-14-M118-红四方面军主线补点-plan.md`
- `docs/conversations/2026-11-14-M118-红四方面军主线补点.md`
- `docs/plans/2026-11-14-M117-长征北上会议链补点-design.md`
- `docs/plans/2026-11-14-M117-长征北上会议链补点-plan.md`
- `docs/conversations/2026-11-14-M117-长征北上会议链补点.md`
- `docs/plans/2026-11-14-M116-长征会议链与封锁线补点-design.md`
- `docs/plans/2026-11-14-M116-长征会议链与封锁线补点-plan.md`
- `docs/conversations/2026-11-14-M116-长征会议链与封锁线补点.md`
- `docs/plans/2026-11-14-M115-会理彝海结盟点位级数据-design.md`
- `docs/plans/2026-11-14-M115-会理彝海结盟点位级数据-plan.md`
- `docs/conversations/2026-11-14-M115-会理彝海结盟点位级数据.md`
- `docs/plans/2026-11-14-M114-金沙江皎平渡点位级数据-design.md`
- `docs/plans/2026-11-14-M114-金沙江皎平渡点位级数据-plan.md`
- `docs/conversations/2026-11-14-M114-金沙江皎平渡点位级数据.md`

---

## [v1.0.12] - 2026-11-14

### Added
- 服务器 `~/.bashrc.d/ops-inbox.sh`：**交互式登录**时打印一行待办计数
  （`[/srv/ops] 待办请求：atlas N 条 · quizgo M 条`）。只在交互式 shell 生效，
  `ssh quizgo '命令'` 与 `rsync` 完全不受影响（已实测 A/B 对比 + rsync 冒烟）。

### Decided
- **否决** sshd 动态 `Banner`：认证前发送、公网可见、只能放计数，且要改 `sshd_config` 并 reload。
  同等可见性用 `~/.bashrc.d` 一个文件即可，风险为零。
- `AGENTS.md` §8「为什么不会漏」从三条触点扩为四条，并记录 Banner 的否决理由。

### Docs
- `docs/conversations/2026-11-14-M119-验收QuizGo的1.0.17接入.md`（追加 Banner 决策）

---

## [v1.0.11] - 2026-11-14

### Verified
- 独立验收 OpenQuizGo 1.0.17 对 `/srv/ops` 协作机制的接入：版本一致性、三条必经触点、
  发布收尾自动登记、`.env` 写入顺序与证伪测试、验收五项，**六项全部属实**。
  证据来自服务器实际状态与对方仓库源码，不采信自述。
- 副作用检查：`dmesg` 无 OOM，5 个容器 `RestartCount=0`，备份与磁盘正常。

### Known
- `.env` 残余窗口：`write_app_version` 成功后 `up -d` 失败仍会留下「新版本号 + 旧容器」，
  窗口已从构建失败缩到 `up -d` 失败；彻底堵法（失败回写旧值）列为可选。
- `OpenQuizGo/docs/deployment-todo.md` 的构建耗时估算「约 5 分钟」已过期，实测 >13 分钟（2C2G）。
- `atlas.conf` 解耦双方同意暂缓，现状仍是「Atlas 提请求、QuizGo 提交同步」。

### Docs
- `docs/conversations/2026-11-14-M119-验收QuizGo的1.0.17接入.md`

---

## [v1.0.10] - 2026-11-14

### Fixed
- 共享面归属表写错了 `conf.d/atlas.conf` 的所有者：该文件的正源在 **OpenQuizGo 仓库**
  （`deploy/nginx/conf.d/`），QuizGo 的 `--with-nginx` 用 `rsync --delete` 同步整目录，
  会覆盖甚至删除不在其仓库里的 conf。Atlas 直接改服务器上的该文件会被下次发布覆盖。
  现改为「Atlas 提请求、QuizGo 提交同步」，并写进 `AGENTS.md` 第 8 节与 `/srv/ops/CONTRACT.md` §2.1。

### Docs
- `docs/conversations/2026-11-14-M118-atlas-conf耦合点与交接提示词.md`

---

## [v1.0.9] - 2026-11-14

### Added
- `scripts/deploy.sh`（`pnpm release`）：把第 7 节发布流程做成可执行脚本。含工作区检查、跨项目请求闸门、共享面漂移闸门、构建、回滚点断言、同步、四条自检、自动登记 `state` + `journal`、收尾复验。
- `scripts/ops-inbox.sh`（`pnpm ops:inbox`）：拉取 `/srv/ops` 里发给 atlas 的未处理请求，离线时静默跳过。
- `/srv/ops/bin/inbox.sh`：服务器侧按项目过滤请求。
- `.githooks/pre-commit` 新增跨项目请求提示（只提示不阻塞，避免被对方的长期请求堵住本仓库提交）。

### Changed
- `AGENTS.md` §7.2 以 `pnpm release` 为主路径，手工步骤降级为参考。
- `AGENTS.md` §8 新增「为什么不会漏」：三条自动触发路径（提交钩子 / 发布脚本 / status.sh）以及机制的边界——只提供可见性，不提供强制。

### Docs
- `docs/conversations/2026-11-14-M117-如何保证跨项目请求不被漏读.md`

---

## [v1.0.8] - 2026-11-14

### Added
- 服务器 `/srv/ops/`：跨项目协作机制，替代人工在两个 AI 之间传话。
  - `CONTRACT.md`：共享面归属表、动共享面的强制四步、写入规则、共同红线。
  - `bin/status.sh`：双方状态快照（版本 / 容器 / 端口 / nginx md5 / 镜像一致性 / 漂移检测 / 待办请求 / 资源）。
  - `state/atlas.json`、`state/quizgo.json`：各自发布登记，作为漂移检测基线。
  - `journal/YYYY-MM.log`：只追加的操作日志。
  - `requests/`：跨项目请求，取代「请用户转达」。
  - `locks/`：`flock` 锁，避免双方同时改 `/srv/nginx`。
- `AGENTS.md` 第 8 节「与 OpenQuizGo 的跨项目协作」。
- 发布流程新增第 6 步：写 `state/atlas.json` + journal，并跑 `status.sh` 确认无漂移。

### Changed
- 文件头「必读」表新增「跨项目协作 / 动共享资源」一行。
- 明确 About 页显示的是**最近一次发布构建**的版本；之后只改文档的提交不再发布，版本滞后一档属正常。

### Docs
- `docs/conversations/2026-11-14-M116-跨项目协作机制.md`

---

## [v1.0.7] - 2026-11-14

### Fixed
- `AGENTS.md` §7.2 备份步骤缺 `sudo`：首次发布时 `cp -a /srv/atlas` 报 `Permission denied`，回滚点没建成而 rsync 照常执行。现在备份失败（或 `test -f` 不过）就中止发布。
- `AGENTS.md` §7.4 回滚命令补 `sudo`（`/srv` 属 root）。

### Changed
- 发布流程由 4 步改为 5 步，新增「**先提交、再构建**」：About 页嵌的是构建那一刻的 `package.json` 版本，先构建后提交会让线上显示旧版本号。

### Docs
- `docs/conversations/2026-11-14-M115-Atlas首次线上发布.md`

---

## [v1.0.6] - 2026-11-14

### Added
- `.githooks/pre-commit`：提交时自动升版、校验版本与构建号一致性、强制同时更新 CHANGELOG。
- `package.json` 新增 `prepare`：执行 `pnpm install` 时自动设置 `core.hooksPath=.githooks`。
- `pnpm version:bump <版本>`：支持指定目标版本，用于「构建号已领先、版本号落后」的补救场景。

### Fixed
- `scripts/check-versions.ts` 新增构建号公式校验：此前「版本 `1.0.3` + 构建号 `10005`」这类漂移能通过检查。

### Changed
- `AGENTS.md` 第 1 节由「人工执行」改为「钩子自动执行」，并补充豁免条件、`--no-verify` 禁用与 tag 命令。
- 版本文件存在未暂存改动时钩子拒绝提交，避免自动升版覆盖正在编辑的内容。
- `git commit --amend` 补提交需加 `SKIP_VERSION_BUMP=1`，否则会再升一版。
- CHANGELOG 校验提前到升版之前：被拒绝的提交不再消耗版本号。

### Docs
- `docs/conversations/2026-11-14-M114-提交前自动升版与发布守则.md`

---

## [v1.0.5] - 2026-11-14

### Added
- 新增 `apps/desktop`：Tauri 2 桌面端，一套代码构建 macOS / Windows，复用 `apps/web` 构建产物。
- 新增 macOS App Sandbox entitlement、桌面图标集与 Tauri 权限配置。
- 新增 `.github/workflows/build-installers.yml`：push main 自动产出 Web、macOS（arm64/x64）、Windows、Android 安装包，tag 自动创建 GitHub Release；iOS 在配置签名 secrets 后出 IPA。
- 新增 `docs/guides/store-submission.md`：Apple、华为 AppGallery、Microsoft Store 提交步骤。
- 新增 `apps/mobile/eas.json` 与 `apps/mobile/plugins/with-ipad-orientations.js`：iPad 横竖屏、分屏与 EAS 构建配置。
- 桌面端支持独立高德 Key：`VITE_AMAP_DESKTOP_KEY` / `VITE_AMAP_DESKTOP_SECURITY_CODE`，未配置时回退 Web Key。
- 新增 `scripts/set-github-secrets.sh`：从本地 `.env.local` 一键上传高德 Key 与 Android 签名 Secrets。
- 明清专题新增 12 个事件：芝山岩事件、云林事件、铁国山抗日、简大狮抗日、林少猫抗日、废科举、上海城厢内外总工程局、五大臣出洋考察、天津自治局、各省自治研究所、汉口之战、汉阳之战。
- 新增 12 段路线，覆盖乙未台湾义军、清末地方自治与辛亥革命战役。
- 辛亥革命各省光复新增 12 个事件：长沙光复、西安光复、太原光复、昆明重九起义、南昌光复、上海光复、杭州光复、苏州光复、福州光复、广州光复、成都独立、南京之战。
- 新增 12 段路线，覆盖各省省城光复与江浙联军进攻南京。
- 明末清初与康雍乾新增 12 个事件：扬州十日、嘉定三屠、江阴八十一日、郑成功南京之役、迁界禁海、多伦会盟、乌兰布通之战、昭莫多之战、摊丁入亩、改土归流、四库全书、广州一口通商。
- 新增 12 段路线，覆盖明末抗清、郑成功北伐、清准战争与康雍乾制度节点。
- 南明与明郑新增 12 个事件：弘光政权建立、隆武政权建立、永历政权建立、李定国桂林之战、李定国衡州之战、永历帝被俘、李定国病逝、张煌言就义、郑经嗣位、郑经反攻福建、澎湖海战、郑克塽降清。
- 新增 12 段路线，覆盖南明三政权、李定国抗清与明郑覆亡。
- 明中后期新增 12 个事件：王阳明平定宁王之乱、庚戌之变、台州大捷、横屿之战、张居正改革、宁夏之役、万历朝鲜战争、平壤大捷、露梁海战、播州之役、东林书院重建、甲申之变。
- 新增 12 段路线，覆盖明中期倭患、万历三大征与明末甲申之变。
- 长征「四渡赤水」升级为渡口级：新增一渡赤水事件与 9 个渡口节点，修正二渡、三渡、四渡的日期、坐标与描述。
- 拆分中央红军遵义—金沙江段为 7 段路线，使土城、元厚、太平渡、九溪口、老鸹沱、二郎滩、淋滩、茅台等主渡口落到路线顶点。
- 长征「湘江战役」升级为渡口与阻击阵地级：新增屏山、大坪、凤凰嘴、界首 4 个渡口事件，以及新圩、脚山铺、光华铺 3 个阻击战事件，修正湘江战役坐标与描述。
- 重画中央红军宜章—通道段路线，新增「湘江渡口群与阻击阵地」防线，使 4 个渡口与 3 个阻击阵地落到路线上。
- 湘江战役后卫部队独立成事件：新增红三十四师后卫阻击、红十八团新圩阻击、陈树湘断肠明志 3 个事件，并与湘江战役、新圩阻击战互链。
- 新增「后卫阻击（文市—水车—新圩—楠木山）」与「红三十四师突围（文塘—灌阳—道县石马神）」两段路线，使 3 个后卫事件落到活动路线上。
- 长征国民党军拆分为 9 个实体：中央军（嫡系）、湘军、桂军、黔军、滇军、川军、东北军、晋绥军、甘宁青部队，替代原「国民党追堵部队」。
- 16 段国民党军追堵路线与 14 个事件按派系重新归属；湘江封锁事件同时挂湘军、桂军。
- 路线与事件补充部队番号、指挥关系与作战方向，例如「中央军等追堵红二十五军」「川军等堵截红四方面军」。
- 长征国民党军再补 3 个实体：粤军（陈济棠部）、西北军（庞炳勋第 40 军）、陕军（杨虎城部）。
- 新增 5 段国民党军路线：粤军第一道封锁线与第三道封锁线、西北军独树镇堵截、陕军袁家沟口堵截、甘宁青马鸿宾部四坡村袭击。
- 新增「国民党军第一道封锁线（粤军）」事件；第三道封锁线、独树镇、袁家沟口、四坡村四个战斗事件补挂国民党军主体与部队番号。
- 路线契约新增可选 `label` / `labelPoint`，为 21 段长征国民党军路线补番号标签（如「粤军 第一集团军」「西北军 第40军」）。
- 地图新增路线番号牌：缩放 ≥ 6、时间进度 ≥ 45% 时显示，中英文随语言切换。
- 带番号的防御/封锁线新增军事符号：细实线打底、固定屏幕像素齿线、首尾据点方块。
- 图例新增「防御 / 驻守」齿线样例与说明；仅在存在带番号防御线时显示。
- 非防御路线新增线头箭头：随播放进度沿线移动，并按路线切线方向旋转；缩放 ≥ 5、进度 1%–99.9% 时显示。
- 番号牌新增屏幕空间避让：防御线番号优先，其余按路线顺序贪心放置，重叠时隐藏低优先级标签。
- 番号牌层级提高到事件聚合圆点之上，避免文字被「2」「6」等计数气泡盖住。
- 图例新增线头箭头说明，中英文同步。
- 长征国民党军 14 段长距离追击 / 堵截 / 封锁路线补入城镇与公路走廊控制点，顶点由 63 个增至 133 个；`extensions.precision` 新增 `corridor` 取值。
- 长征「遵义战役」升级为点位级：新增遵义战役、攻占桐梓、邓萍牺牲、红花岗、老鸦山、奔袭忠庄铺、鲁班场战斗 7 个事件。
- 新增「遵义城南防御线（红花岗—老鸦山）」路线，修正娄山关战斗地点与遵义战役前奏关系。
- 长征「大渡河战役」升级为点位级：新增大渡河战役、安顺场渡口、磨西会议、大树堡佯攻、川军安顺场北岸防线、川军泸定桥防线 6 个事件。
- 修正强渡大渡河坐标（石棉县城 → 安顺场渡口）与飞夺泸定桥坐标；新增大树堡佯动路线，补拖乌、栗子坪、得妥、兴隆等控制点。

### Changed
- 长征专题 98 → 114 事件，85 → 89 路线段。
- 国民党军实体 9 → 12 个，总实体 16 → 19 个，`order` 按中央军、湘、粤、桂、黔、滇、川、东北、西北、陕、晋绥、甘宁青重排。
- 国民党军路线线宽减一档、透明度降至 0.6/0.65，突出红军主线；防御线不再显示方向箭头。
- 齿线与据点只对写了 `label` 的防御线启用，其他专题渲染不变。
- 所有专题的非防御路线各新增 1 个线头箭头 Marker；长征 73 个，抗日专题 128 个。
- 番号牌避让采用文本估算尺寸，不逐帧读取 DOM，避免播放时布局抖动。
- 长征国民党军路线描述改为「按主要城镇与公路走廊补点，仍为示意」，中英文同步。
- M111 路线几何、M112 遵义战役、M113 大渡河战役数据变更后，数据版本推进至 `2026-11-13-8fbaedd1d60c`，搜索索引与移动端内置数据已重新生成。
- 国民党军路线文件由 `kmt-army.geojson` 更名为 `kmt-forces.geojson`，几何与时间范围不变。
- 桌面端图例限高滚动，避免 19 个实体溢出到时间轴下方。
- 明清专题 84 → 144 事件，83 → 143 路线段。
- 全项目 625 → 719 事件，535 → 606 路线段。
- 搜索索引：10 专题 / 719 事件 / 1437.5 KB；数据版本 `2026-11-13-8fbaedd1d60c`。
- 全仓版本由 `1.0.3` 升级为 `1.0.5`，构建号 `10005`（构建号此前已领先于版本号，本次一并对齐）。
- Web `vite.config.ts` 支持 `desktop` 模式：关闭 PWA、使用 HashRouter、外链交给系统浏览器。
- 根 `build` 改为只构建 Web，避免 Vercel 误触发 Tauri 编译；桌面构建使用 `bundle:*` 脚本。
- iPad 允许四方向与分屏，iPhone 保持竖屏；图鉴页在 iPad 宽度下自动 2–3 列。
- 本轮不升版本、不部署、不打 tag，随下个发布窗口统一处理。

### Fixed
- 无。

### Docs
- `docs/plans/2026-11-14-M113-大渡河泸定桥点位级数据-design.md`
- `docs/plans/2026-11-14-M113-大渡河泸定桥点位级数据-plan.md`
- `docs/conversations/2026-11-14-M113-大渡河泸定桥点位级数据.md`
- `docs/plans/2026-11-14-M112-遵义战役点位级数据-design.md`
- `docs/plans/2026-11-14-M112-遵义战役点位级数据-plan.md`
- `docs/conversations/2026-11-14-M112-遵义战役点位级数据.md`
- `docs/plans/2026-11-14-M111-长征国民党军路线走廊补点-design.md`
- `docs/plans/2026-11-14-M111-长征国民党军路线走廊补点-plan.md`
- `docs/conversations/2026-11-14-M111-长征国民党军路线走廊补点.md`
- `docs/plans/2026-11-14-M110-路线动态符号与番号避让-design.md`
- `docs/plans/2026-11-14-M110-路线动态符号与番号避让-plan.md`
- `docs/conversations/2026-11-14-M110-路线动态符号与番号避让.md`
- `docs/plans/2026-11-13-M109-地图路线军事符号原型-design.md`
- `docs/plans/2026-11-13-M109-地图路线军事符号原型-plan.md`
- `docs/conversations/2026-11-13-M109-地图路线军事符号原型.md`
- `docs/plans/2026-11-13-M108-长征国民党军粤军西北军陕军-design.md`
- `docs/plans/2026-11-13-M108-长征国民党军粤军西北军陕军-plan.md`
- `docs/conversations/2026-11-13-M108-长征国民党军粤军西北军陕军.md`
- `docs/plans/2026-11-13-M107-长征国民党军派系拆分-plan.md`
- `docs/plans/2026-11-13-M107-长征国民党军派系拆分-design.md`
- `docs/conversations/2026-11-13-M107-长征国民党军派系拆分.md`
- `AGENTS.md`：新增「数据铁律」章节。
- `docs/plans/2026-11-11-M98-桌面端Tauri与多商店发布-plan.md`
- `docs/plans/2026-11-11-M98-桌面端Tauri与多商店发布-design.md`
- `docs/conversations/2026-11-11-M98-桌面端Tauri与多商店发布.md`
- `docs/guides/store-submission.md`
- `docs/decisions/ADR-0010-桌面端采用Tauri2复用Web构建.md`

---

## [v1.0.3] - 2026-11-12

### Fixed
- 移除 iOS `Info.plist` 中 macOS 专用的 `LSMinimumSystemVersion`，修复 App Store 上传校验 `91164`（该键为 16.x 时会被拒绝）。
- 新增 `plugins/with-remove-macos-plist.js`，prebuild 后自动删除该键，避免 Expo 模板默认值回流。

### Changed
- 全仓版本由 `1.0.2` 升级为 `1.0.3`，构建号 `10003`。

### Docs
- 发布清单与英文商店元数据同步 iOS 最低版本口径。
- `docs/conversations/2026-11-12-M104-iOS上传校验修复.md`

---

## [v1.0.2] - 2026-11-12

### Added
- 移动端内置 `data/atlases` 离线数据源：`scripts/build-mobile-data.ts` 生成静态 require 映射，涵盖 10 个专题 / 685 个事件 / 595 段路线 / 搜索索引。
- 新增 `BundledDataSource` 与「远端优先 + 内置回退」数据策略；设置 `EXPO_PUBLIC_DATA_BASE_URL` 即可在服务器就绪后切换，无需改数据格式。
- 新增 App 内离线隐私政策弹窗：首次启动页与首页底部均可打开，不再依赖外部域名。
- 6 个专题的 SVG 封面转换为 1600×900 PNG，修复 React Native `Image` 无法渲染 SVG 的问题。

### Changed
- 移动端 Release 默认读取内置数据，不再请求 `*.vercel.app`；本地开发仍使用本机数据服务。
- Metro 支持 `.geojson` 源文件；Android/iOS CI 在 prebuild 前自动重新生成内置数据映射。
- 隐私政策第 5 节由「静态文件托管 / CDN 分发」更新为「数据随应用内置，可离线浏览」。
- 全仓版本由 `1.0.1` 升级为 `1.0.2`，构建号 `10002`。

### Docs
- `docs/guides/deployment.md`：补充内置数据与远端切换说明。
- 发布清单、英文审核备注同步离线数据口径。
- `docs/conversations/2026-11-12-M103-移动端离线数据与隐私内嵌.md`

---

## [v1.0.1] - 2026-11-12

### Added
- 定稿 OpenChronicle Atlas 品牌 Logo「青铜 · 朱砂」：深墨直角方底、开口 C 环、粗路线 + 大定位针。
- 新增 `docs/assets/branding/`：矢量源文件、1024px 全出血直角方图、青瓷/靛蓝配色备选与对比预览页。

### Changed
- 全端应用图标替换：Web PWA（192/512/1024）、Tauri 桌面（含 `.ico` / `.icns`）、iOS 1024、Android legacy / round / adaptive。
- Logo 与全部应用图标统一为**直角全出血方图**，不再预制圆角，交由 iOS / Android / PWA 系统裁切，避免真机二次圆角造成边缘缺白。
- Android adaptive icon 前景改为透明底 C 环 + 定位针，背景色调整为 `#17120E`。
- 桌面端 `icon` 脚本直接使用 `apps/mobile/assets/icon.png`（直角方图），移动端 `icon.png` 保持无 alpha。
- 启动页 `splash.svg/png` 与商店横幅 `feature-graphic.svg/png` 换用新 Logo 与青铜 · 朱砂配色；Expo splash、Android `splashscreen_background`、PWA manifest 背景统一为 `#17120E`。
- 全仓版本由 `1.0.0` 升级为 `1.0.1`，构建号 `10001`。

### Docs
- `docs/assets/branding/README.md`：Logo 隐喻、配色、几何规范与落地说明。
- `docs/assets/branding/index.html`：三套配色对比预览。
- `docs/conversations/2026-11-12-M102-Logo青铜朱砂定稿与全端图标.md`

---

## [v1.0.0] - 2026-11-12

### Added
- `AGENTS.md` 版本铁律：每次提交自动递增 `1.0.X`。
- `scripts/bump-version.ts` 与 `pnpm version:bump`，统一更新全仓版本与构建号。
- `check:versions` 覆盖桌面端 Cargo/Tauri/Cargo.lock，并强制 `1.0.X` 格式。

### Changed
- 全仓版本由 `0.95.0` 升级为 `1.0.0`；移动端与 macOS 构建号统一为 `10000`。

---

## [v0.95.0-m95] - 2026-11-11

### Added
- 明清专题新增 12 个事件：澎湖之役、台湾总督府设立、新竹保卫战、三角涌战役、苗栗之战、大甲溪之战、各省咨议局联合会、资政院弹劾军机大臣、宪友会成立、滦州兵谏、宪法重大信条十九条、南北议和。
- 新增 12 段路线，覆盖乙未战争中段与清末立宪、辛亥政局。
- 发布说明 `docs/releases/2026-11-11-v0.95.0-m95.md`。

### Changed
- 明清专题 72 → 84 事件，71 → 83 路线段。
- 全项目 613 → 625 事件，523 → 535 路线段。
- 搜索索引：10 专题 / 625 事件 / 1188.8 KB；数据版本 `2026-11-11-c8c1d1e71e1c`。
- 四包版本统一为 `0.95.0`；Android `versionCode` 升为 92；iOS build 92。

### Docs
- `docs/plans/2026-11-11-M95-明清专题补乙未战事与立宪节点-plan.md`
- `docs/plans/2026-11-11-M95-明清专题补乙未战事与立宪节点-design.md`
- `docs/releases/2026-11-11-v0.95.0-m95.md`
- `docs/conversations/2026-11-11-M95-明清专题补乙未战事与立宪节点.md`

---

## [v0.94.0-m94] - 2026-11-11

### Added
- 明清专题新增 8 个事件：成欢之战、九连城之战、乙未战争、八卦山战役、台南陷落、辽南条约、旅顺善后、资政院选举。
- 新增 8 段路线，覆盖甲午陆战尾声、乙未战争与清末立宪。
- 发布说明 `docs/releases/2026-11-11-v0.94.0-m94.md`。

### Changed
- 明清专题 64 → 72 事件，63 → 71 路线段。
- 全项目 605 → 613 事件，515 → 523 路线段。
- 搜索索引：10 专题 / 613 事件 / 1166.6 KB；数据版本 `2026-11-11-92c437a22718`。
- 四包版本统一为 `0.94.0`；Android `versionCode` 升为 91；iOS build 91。

### Docs
- `docs/plans/2026-11-11-M94-明清专题补甲午尾声与乙未战争-plan.md`
- `docs/plans/2026-11-11-M94-明清专题补甲午尾声与乙未战争-design.md`
- `docs/releases/2026-11-11-v0.94.0-m94.md`
- `docs/conversations/2026-11-11-M94-明清专题补甲午尾声与乙未战争.md`

---

## [v0.93.0-m93] - 2026-11-11

### Added
- 明清专题新增 12 个事件：上海广方言馆、福州船政学堂、天津水师学堂、北洋海军成军、丰岛海战、平壤战役、辽东战役、马关条约、台湾民主国、湖北枪炮厂、城镇乡地方自治章程、国会请愿运动。
- 新增 12 段路线，覆盖甲午战争、洋务学堂、台湾乙未与清末新政。
- 发布说明 `docs/releases/2026-11-11-v0.93.0-m93.md`。

### Changed
- 明清专题 52 → 64 事件，51 → 63 路线段。
- 全项目 593 → 605 事件，503 → 515 路线段。
- 搜索索引：10 专题 / 605 事件 / 1151.3 KB；数据版本 `2026-11-11-f07b6e5b76c9`。
- 四包版本统一为 `0.93.0`；Android `versionCode` 升为 90；iOS build 90。

### Docs
- `docs/plans/2026-11-11-M93-明清专题补甲午与清末节点-plan.md`
- `docs/plans/2026-11-11-M93-明清专题补甲午与清末节点-design.md`
- `docs/releases/2026-11-11-v0.93.0-m93.md`
- `docs/conversations/2026-11-11-M93-明清专题补甲午与清末节点.md`

---

## [v0.92.0-m92] - 2026-11-11

### Added
- 明清专题新增 12 个事件：京师同文馆、留美幼童、开平矿务局、左宗棠收复新疆、中法战争、台湾建省、汉阳铁厂、黄海海战、威海卫之战、东南互保、咨议局成立、皇族内阁。
- 新增 12 段路线，覆盖洋务教育、边疆、甲午海战与晚清政局。
- 发布说明 `docs/releases/2026-11-11-v0.92.0-m92.md`。

### Changed
- 明清专题 40 → 52 事件，39 → 51 路线段。
- 全项目 581 → 593 事件，491 → 503 路线段。
- 搜索索引：10 专题 / 593 事件 / 1127.9 KB；数据版本 `2026-11-11-7950c0e5094b`。
- 四包版本统一为 `0.92.0`；Android `versionCode` 升为 89；iOS build 89。

### Docs
- `docs/plans/2026-11-11-M92-明清专题再扩充-plan.md`
- `docs/plans/2026-11-11-M92-明清专题再扩充-design.md`
- `docs/releases/2026-11-11-v0.92.0-m92.md`
- `docs/conversations/2026-11-11-M92-明清专题再扩充.md`

---

## [v0.91.0-m91] - 2026-11-11

### Added
- 明清专题新增 12 个事件：大小金川之役、平定廓尔喀、白莲教起义、天理教起义、虎门销烟、江南制造总局、福州船政局、轮船招商局、三国干涉还辽、列强租借港湾、预备立宪、钦定宪法大纲。
- 新增 11 段路线，覆盖乾隆武功、民间起事、洋务企业与清末立宪。
- 发布说明 `docs/releases/2026-11-11-v0.91.0-m91.md`。

### Changed
- 明清专题 28 → 40 事件，28 → 39 路线段。
- 全项目 569 → 581 事件，480 → 491 路线段。
- 搜索索引：10 专题 / 581 事件 / 1105.0 KB；数据版本 `2026-11-11-7b55e7f4b441`。
- 四包版本统一为 `0.91.0`；Android `versionCode` 升为 88；iOS build 88。

### Docs
- `docs/plans/2026-11-11-M91-明清专题继续扩充-plan.md`
- `docs/plans/2026-11-11-M91-明清专题继续扩充-design.md`
- `docs/releases/2026-11-11-v0.91.0-m91.md`
- `docs/conversations/2026-11-11-M91-明清专题继续扩充.md`

---

## [v0.90.0-m90] - 2026-11-11

### Added
- 明清专题新增 12 个事件：郑成功收复台湾、三藩之乱、雅克萨之战、雍正即位、军机处设立、清平大小和卓、马戛尔尼使华、洋务运动、戊戌变法、义和团与八国联军、清末新政、保路运动。
- 新增 12 段路线，覆盖明郑与清。
- 新增 `ming-zheng`（明郑）实体。
- 发布说明 `docs/releases/2026-11-11-v0.90.0-m90.md`。

### Changed
- 明清专题 16 → 28 事件，16 → 28 路线段。
- 全项目 557 → 569 事件，468 → 480 路线段。
- 搜索索引：10 专题 / 569 事件 / 1083.3 KB；数据版本 `2026-11-11-3e6ea8baa6c4`。
- 四包版本统一为 `0.90.0`；Android `versionCode` 升为 87；iOS build 87。

### Docs
- `docs/plans/2026-11-11-M90-明清专题扩充-plan.md`
- `docs/plans/2026-11-11-M90-明清专题扩充-design.md`
- `docs/releases/2026-11-11-v0.90.0-m90.md`
- `docs/conversations/2026-11-11-M90-明清专题扩充.md`

---

## [v0.89.0-m89] - 2026-11-11

### Added
- 新增第十个专题「明清」（`ming-qing`），覆盖 1368—1912 年。
- 16 个事件：明建立、靖难之役、迁都北京、土木堡之变、隆庆和议、后金建立、萨尔浒之战、清军入关、清统一台湾、尼布楚条约、清平准噶尔、鸦片战争、太平天国、甲午战争、辛亥革命、清帝退位。
- 16 段路线，覆盖明、清两个实体。
- 6 个疆域时段面：明 1400/1500/1600，清 1700/1800/1900。
- 专题封面 `data/atlases/ming-qing/assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-11-v0.89.0-m89.md`。

### Changed
- 全项目 9 → 10 专题，541 → 557 事件，452 → 468 路线段。
- 搜索索引：10 专题 / 557 事件 / 1060.8 KB；数据版本 `2026-11-11-b92eae132d9b`。
- 四包版本统一为 `0.89.0`；Android `versionCode` 升为 86；iOS build 86。

### Docs
- `docs/plans/2026-11-11-M89-明清专题-plan.md`
- `docs/plans/2026-11-11-M89-明清专题-design.md`
- `docs/releases/2026-11-11-v0.89.0-m89.md`
- `docs/conversations/2026-11-11-M89-明清专题.md`
- `data/atlases/ATTRIBUTION.md` 补充明清来源

---

## [v0.88.0-m88] - 2026-11-11

### Added
- 宋元专题新增 10 个事件：西夏立国、灵州之战、永乐城之战、西夏附金、蒙古攻西夏、蒙古灭西夏、大理遣使入宋、高升泰代立、大理城陷落、大理段氏降蒙。
- 新增 9 段路线，覆盖西夏、蒙古 / 元与大理。
- 发布说明 `docs/releases/2026-11-11-v0.88.0-m88.md`。

### Changed
- 宋元专题 32 → 42 事件，30 → 39 路线段。
- 全项目 531 → 541 事件，443 → 452 路线段。
- 搜索索引：9 专题 / 541 事件 / 1032.5 KB；数据版本 `2026-11-11-2a489df3f0c8`。
- 四包版本统一为 `0.88.0`；Android `versionCode` 升为 85；iOS build 85。

### Docs
- `docs/plans/2026-11-11-M88-宋元补充西夏与大理-plan.md`
- `docs/plans/2026-11-11-M88-宋元补充西夏与大理-design.md`
- `docs/releases/2026-11-11-v0.88.0-m88.md`
- `docs/conversations/2026-11-11-M88-宋元补充西夏与大理.md`

---

## [v0.87.0-m87] - 2026-11-11

### Fixed
- 修正疆域标识落点：由外环顶点平均值改为面内离边界最远的点，解决 223 年「魏」标识落在疆域外的问题。
- 重新计算三国、隋唐、宋元共 116 个疆域面的 `labelPoint`，全部通过「点在面内」校验。

### Changed
- 导入脚本新增孔洞排除、MultiPolygon 最大部分选择与网格细化。
- 四包版本统一为 `0.87.0`；Android `versionCode` 升为 84；iOS build 84。
- 数据版本更新为 `2026-11-11-77799826a65a`。
- 发布说明 `docs/releases/2026-11-11-v0.87.0-m87.md`。

### Docs
- `docs/plans/2026-11-11-M87-修正疆域标识落点-plan.md`
- `docs/plans/2026-11-11-M87-修正疆域标识落点-design.md`
- `docs/releases/2026-11-11-v0.87.0-m87.md`
- `docs/conversations/2026-11-11-M87-修正疆域标识落点.md`

---

## [v0.86.0-m86] - 2026-11-11

### Added
- 新增 `scripts/import-cliopatria-territories.py`，可从 Seshat Cliopatria 原始 GeoJSON 复现导入。
- 新增 `data/atlases/ATTRIBUTION.md`，记录 CC BY 4.0 署名与修改说明。
- 宋元新增实体 `western-xia`（西夏）与 `dali`（大理）。
- 发布说明 `docs/releases/2026-11-11-v0.86.0-m86.md`。

### Changed
- 三国疆域由 4 个手绘面升级为 11 个 Cliopatria 时段面。
- 隋唐疆域由 5 个手绘面升级为 63 个 Cliopatria 时段面（安史控制区保留示意面）。
- 宋元疆域由 6 个手绘面升级为 42 个 Cliopatria 时段面。
- 疆域面统一写入 `extensions.precision = "dataset"` 与 `extensions.sourceFeature`。
- 三个专题 manifest 的 `license` 更新为 CC BY 4.0 + Cliopatria 署名。
- 四包版本统一为 `0.86.0`；Android `versionCode` 升为 83；iOS build 83。
- 数据版本更新为 `2026-11-11-4ea1bc9845bb`。

### Docs
- `docs/plans/2026-11-11-M86-疆域数据升级Cliopatria-plan.md`
- `docs/plans/2026-11-11-M86-疆域数据升级Cliopatria-design.md`
- `docs/releases/2026-11-11-v0.86.0-m86.md`
- `docs/conversations/2026-11-11-M86-疆域数据升级Cliopatria.md`
- `docs/schema/atlas-schema-v1.1.0.md` 补充 `precision: dataset`
- README 新增「数据来源与许可」

---

## [v0.85.0-m85] - 2026-11-11

### Fixed
- 修正三国魏、汉、吴、晋疆域重叠：改用共享边界节点，同期政权只相接不重叠。
- 修正宋元北宋/辽、金/南宋、蒙古/金、元/南宋疆域重叠：调整时间区间与边界。
- 修正隋唐唐前期/后期与吐蕃疆域重叠：唐西南界东移。
- 疆域描边不透明度 0.4 → 0.55，宽度 1 → 1.2。

### Changed
- 魏结束时间改为 266-01-31，晋从 266-02-01 开始。
- 金从 1127-04 开始，接在北宋结束后。
- 蒙古结束时间改为 1271-11-30，与元交接。
- 四包版本统一为 `0.85.0`；Android `versionCode` 升为 82；iOS build 82。
- 数据版本更新为 `2026-11-11-6e80e2f92174`。
- 发布说明 `docs/releases/2026-11-11-v0.85.0-m85.md`。

### Docs
- `docs/plans/2026-11-11-M85-疆域重叠修正-plan.md`
- `docs/plans/2026-11-11-M85-疆域重叠修正-design.md`
- `docs/releases/2026-11-11-v0.85.0-m85.md`
- `docs/conversations/2026-11-11-M85-疆域重叠修正.md`

---

## [v0.84.0-m84] - 2026-11-11

### Added
- 疆域遮罩新增文字标识：隋唐 5、宋元 6、三国 4，共 15 个。
- 数据契约新增可选 `label` 与 `labelPoint`，支持中英文短标识与手动落点。
- 地图新增 `AMap.Text` 文字层，与疆域面同步显隐。
- 新增标识 schema 测试（合法标识、越界落点）。
- 发布说明 `docs/releases/2026-11-11-v0.84.0-m84.md`。

### Fixed
- 修复语言切换后疆域层重建、文字与面全部隐藏的问题（时间显隐 effect 依赖 locale）。

### Changed
- 四包版本统一为 `0.84.0`；Android `versionCode` 升为 81；iOS build 81。
- 数据版本更新为 `2026-11-11-a8869724e8a4`。

### Docs
- `docs/plans/2026-11-11-M84-疆域文字标识-plan.md`
- `docs/plans/2026-11-11-M84-疆域文字标识-design.md`
- `docs/releases/2026-11-11-v0.84.0-m84.md`
- `docs/conversations/2026-11-11-M84-疆域文字标识.md`
- `docs/schema/atlas-schema-v1.1.0.md` 补充 `label` / `labelPoint`

---

## [v0.83.0-m83] - 2026-11-11

### Added
- 地图新增「时代疆域遮罩」：半透明 Polygon 随历史时段显示，位于路线与标记之下。
- 数据契约新增可选 `manifest.territories` 与 `AtlasTerritoryFeature`（Polygon / MultiPolygon）。
- 图例新增「时代疆域遮罩」显示开关，默认开启。
- 隋唐 5 面、宋元 6 面、三国 4 面示意疆域数据。
- 新增 `territory.test.ts` 契约与校验测试。
- 发布说明 `docs/releases/2026-11-11-v0.83.0-m83.md`。

### Changed
- 搜索索引指纹纳入疆域数据；数据版本更新为 `2026-11-11-b4cc5bd726a2`。
- 四包版本统一为 `0.83.0`；Android `versionCode` 升为 80；iOS build 80。

### Docs
- `docs/plans/2026-11-11-M83-地图时代疆域遮罩-plan.md`
- `docs/plans/2026-11-11-M83-地图时代疆域遮罩-design.md`
- `docs/releases/2026-11-11-v0.83.0-m83.md`
- `docs/conversations/2026-11-11-M83-地图时代疆域遮罩.md`
- `docs/schema/atlas-schema-v1.1.0.md` 新增疆域遮罩章节

---

## [v0.82.0-m82] - 2026-11-11

### Added
- 隋唐专题新增 14 个事件：贞观之治、唐灭西突厥、白江口、武则天称帝、神龙政变、开元盛世、怛罗斯、河朔藩镇割据、泾原兵变、唐蕃会盟、甘露之变、会昌灭佛、归义军收复敦煌、庞勋起义。
- 新增 12 段路线，覆盖初唐、武周、盛唐、中唐与晚唐。
- 发布说明 `docs/releases/2026-11-11-v0.82.0-m82.md`。

### Changed
- 隋唐专题 18 → 32 事件，16 → 28 路线段。
- 全项目 517 → 531 事件，431 → 443 路线段。
- 搜索索引：9 专题 / 531 事件 / 1014.3 KB；数据版本 `2026-11-11-f0d8052b99ec`。
- 四包版本统一为 `0.82.0`；Android `versionCode` 升为 79；iOS build 79。

### Docs
- `docs/plans/2026-11-11-M82-隋唐专题扩充-plan.md`
- `docs/plans/2026-11-11-M82-隋唐专题扩充-design.md`
- `docs/releases/2026-11-11-v0.82.0-m82.md`
- `docs/conversations/2026-11-11-M82-隋唐专题扩充.md`

---

## [v0.81.0-m81] - 2026-11-11

### Added
- 新增第九个专题「隋唐」（`sui-tang`），覆盖 581—907 年。
- 18 个事件：杨坚代周建隋、隋灭陈、开凿通济渠、辽东之役、李渊建唐、虎牢关、玄武门、灭东突厥、文成公主入藏、安史之乱、马嵬驿、睢阳、吐蕃陷长安、安史之乱结束、两税法、黄巢起义、黄巢入长安、朱温灭唐。
- 16 段路线，覆盖隋、唐、吐蕃与安史叛军 4 个实体。
- 专题封面 `data/atlases/sui-tang/assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-11-v0.81.0-m81.md`。

### Changed
- 全项目 8 → 9 专题，499 → 517 事件，415 → 431 路线段。
- 搜索索引：9 专题 / 517 事件 / 987.1 KB；数据版本 `2026-11-11-15dd00629428`。
- 四包版本统一为 `0.81.0`；Android `versionCode` 升为 78；iOS build 78。

### Docs
- `docs/plans/2026-11-11-M81-隋唐专题-plan.md`
- `docs/plans/2026-11-11-M81-隋唐专题-design.md`
- `docs/releases/2026-11-11-v0.81.0-m81.md`
- `docs/conversations/2026-11-11-M81-隋唐专题.md`

---

## [v0.80.0-m80] - 2026-11-11

### Added
- 宋元专题新增 14 个事件：好水川、庆历和议、宁江州、方腊起义、太原、富平、顺昌、绍兴和议、岳飞之死、隆兴北伐、三峰山、蒙古灭大理、元军渡江、丁家洲。
- 新增 13 段路线，覆盖北宋、辽、金、南宋、蒙古 / 元。
- 发布说明 `docs/releases/2026-11-11-v0.80.0-m80.md`。

### Changed
- 宋元专题 18 → 32 事件，17 → 30 路线段。
- 全项目 485 → 499 事件，402 → 415 路线段。
- 搜索索引：8 专题 / 499 事件 / 954.4 KB；数据版本 `2026-11-11-6b840a9dfb7c`。
- 四包版本统一为 `0.80.0`；Android `versionCode` 升为 77；iOS build 77。

### Docs
- `docs/plans/2026-11-11-M80-宋元专题扩充-plan.md`
- `docs/plans/2026-11-11-M80-宋元专题扩充-design.md`
- `docs/releases/2026-11-11-v0.80.0-m80.md`
- `docs/conversations/2026-11-11-M80-宋元专题扩充.md`

---

## [v0.79.0-m79] - 2026-11-10

### Added
- 新增第八个专题「宋元」（`song-yuan`），覆盖 960—1279 年。
- 新增 5 个实体：北宋、南宋、辽、金、蒙古 / 元。
- 新增 18 个事件：陈桥兵变、澶渊之盟、靖康之变、采石之战、襄阳之战、崖山海战等。
- 新增 17 段路线与封面 `assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-10-v0.79.0-m79.md`。

### Changed
- 专题 7 → 8；全项目 467 → 485 事件，385 → 402 路线段。
- 搜索索引：8 专题 / 485 事件 / 929.4 KB；数据版本 `2026-11-10-e33694ed4185`。
- 四包版本统一为 `0.79.0`；Android `versionCode` 升为 76；iOS build 76。

### Docs
- `docs/plans/2026-11-10-M79-宋元专题-plan.md`
- `docs/plans/2026-11-10-M79-宋元专题-design.md`
- `docs/releases/2026-11-10-v0.79.0-m79.md`
- `docs/conversations/2026-11-10-M79-宋元专题.md`

---

## [v0.78.0-m78] - 2026-11-10

### Added
- 三国专题新增 14 个事件：青州兵、下邳、孙策遇刺、邺城、长坂坡、取成都、街亭、石亭、高平陵、东兴、淮南二叛、司马炎称帝、西陵、王濬造楼船。
- 新增 13 段路线，覆盖曹魏、蜀汉、东吴、西晋四方。
- 发布说明 `docs/releases/2026-11-10-v0.78.0-m78.md`。

### Changed
- 三国专题 21 → 35 事件，20 → 33 路线段。
- 全项目 453 → 467 事件，372 → 385 路线段。
- 搜索索引：7 专题 / 467 事件 / 897.3 KB；数据版本 `2026-11-10-7f43cf92f202`。
- 四包版本统一为 `0.78.0`；Android `versionCode` 升为 75；iOS build 75。

### Docs
- `docs/plans/2026-11-10-M78-三国专题扩充-plan.md`
- `docs/plans/2026-11-10-M78-三国专题扩充-design.md`
- `docs/releases/2026-11-10-v0.78.0-m78.md`
- `docs/conversations/2026-11-10-M78-三国专题扩充.md`

---

## [v0.77.0-m77] - 2026-11-10

### Added
- 新增第七个专题「三国」（`three-kingdoms`），覆盖 190—280 年。
- 新增 4 个实体：曹魏、蜀汉、东吴、西晋。
- 新增 21 个事件：曹操起兵、官渡、赤壁、夷陵、五丈原、魏灭蜀、晋灭吴等。
- 新增 20 段路线与封面 `assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-10-v0.77.0-m77.md`。

### Changed
- 专题 6 → 7；全项目 432 → 453 事件，352 → 372 路线段。
- 搜索索引：7 专题 / 453 事件 / 872.5 KB；数据版本 `2026-11-10-e69beb5e4825`。
- 四包版本统一为 `0.77.0`；Android `versionCode` 升为 74；iOS build 74。

### Docs
- `docs/plans/2026-11-10-M77-三国专题-plan.md`
- `docs/plans/2026-11-10-M77-三国专题-design.md`
- `docs/releases/2026-11-10-v0.77.0-m77.md`
- `docs/conversations/2026-11-10-M77-三国专题.md`

---

## [v0.76.0-m76] - 2026-11-10

### Added
- 京杭大运河新增 12 个沿线城市与漕运节点事件。
- 新增 10 段路线：南宋杭州—镇江，以及元代主线北京—天津—德州—临清—济宁—淮安—扬州—镇江—苏州—杭州。
- 发布说明 `docs/releases/2026-11-10-v0.76.0-m76.md`。

### Changed
- 京杭大运河专题 14 → 26 事件，9 → 19 路线段。
- 全项目 420 → 432 事件，342 → 352 路线段。
- 搜索索引：6 专题 / 432 事件 / 835.3 KB；数据版本 `2026-11-10-0e25348c8b02`。
- 四包版本统一为 `0.76.0`；Android `versionCode` 升为 73；iOS build 73。

### Docs
- `docs/plans/2026-11-10-M76-运河沿线节点-plan.md`
- `docs/plans/2026-11-10-M76-运河沿线节点-design.md`
- `docs/releases/2026-11-10-v0.76.0-m76.md`
- `docs/conversations/2026-11-10-M76-运河沿线节点.md`

---

## [v0.75.0-m75] - 2026-11-10

### Added
- 新增第六个专题「京杭大运河」（`grand-canal`）与实体 `grand-canal`。
- 新增 14 个运河史事件：通济渠、永济渠、江南河、汴河、会通河、通惠河、明清漕运、黄河改道与漕运停止。
- 新增 9 段路线与封面 `assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-10-v0.75.0-m75.md`。

### Changed
- 专题 5 → 6；全项目 406 → 420 事件，333 → 342 路线段。
- 搜索索引：6 专题 / 420 事件 / 814.1 KB；数据版本 `2026-11-10-ac3656978b36`。
- 四包版本统一为 `0.75.0`；Android `versionCode` 升为 72；iOS build 72。

### Docs
- `docs/plans/2026-11-10-M75-京杭大运河专题-plan.md`
- `docs/plans/2026-11-10-M75-京杭大运河专题-design.md`
- `docs/releases/2026-11-10-v0.75.0-m75.md`
- `docs/conversations/2026-11-10-M75-京杭大运河专题.md`

---

## [v0.74.0-m74] - 2026-11-10

### Added
- 新增第五个专题「徐霞客游记」（`xu-xiake`）与实体 `xu-xiake`。
- 新增 23 个游历事件：太湖、泰山、天台、雁荡、庐山、黄山、武夷、华山、嵩山与西南万里行。
- 新增 21 段路线与封面 `assets/cover.svg`。
- 发布说明 `docs/releases/2026-11-10-v0.74.0-m74.md`。

### Changed
- 专题 4 → 5；全项目 383 → 406 事件，312 → 333 路线段。
- 搜索索引：5 专题 / 406 事件 / 788.9 KB；数据版本 `2026-11-10-6147c343bcd7`。
- 四包版本统一为 `0.74.0`；Android `versionCode` 升为 71；iOS build 71。

### Docs
- `docs/plans/2026-11-10-M74-徐霞客游记专题-plan.md`
- `docs/plans/2026-11-10-M74-徐霞客游记专题-design.md`
- `docs/releases/2026-11-10-v0.74.0-m74.md`
- `docs/conversations/2026-11-10-M74-徐霞客游记专题.md`

---

## [v0.73.0-m73] - 2026-11-10

### Added
- 集团军新增第11、20、26、37 集团军 4 个事件。
- 日军新增进攻龙陵、腾冲、石牌 3 个事件。
- 华南新增昌感、高要根据地 2 个事件。
- 新增日军 2 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-10-v0.73.0-m73.md`。

### Changed
- 抗日战争专题 216 → 225 事件，188 → 192 路线段。
- 全项目 374 → 383 事件，308 → 312 路线段。
- 搜索索引：4 专题 / 383 事件 / 753.3 KB；数据版本 `2026-11-10-4775f3b6965a`。
- 四包版本统一为 `0.73.0`；Android `versionCode` 升为 70；iOS build 70。

### Docs
- `docs/plans/2026-11-10-M73-集团军第十三批与华南昌感-plan.md`
- `docs/plans/2026-11-10-M73-集团军第十三批与华南昌感-design.md`
- `docs/releases/2026-11-10-v0.73.0-m73.md`
- `docs/conversations/2026-11-10-M73-集团军第十三批与华南昌感.md`

---

## [v0.72.0-m72] - 2026-11-10

### Added
- 集团军新增第23、26、11、37 集团军 4 个事件。
- 日军新增进攻铜陵、防守宜昌、松山防御、进攻宾阳 4 个事件。
- 华南新增曾生、冯白驹 2 个人物节点。
- 新增集团军 4 段、日军 4 段路线。
- 发布说明 `docs/releases/2026-11-10-v0.72.0-m72.md`。

### Changed
- 抗日战争专题 206 → 216 事件，180 → 188 路线段。
- 全项目 364 → 374 事件，300 → 308 路线段。
- 搜索索引：4 专题 / 374 事件 / 736.7 KB；数据版本 `2026-11-10-6ec7056d8b68`。
- 四包版本统一为 `0.72.0`；Android `versionCode` 升为 69；iOS build 69。

### Docs
- `docs/plans/2026-11-10-M72-集团军第十二批与华南人物-plan.md`
- `docs/plans/2026-11-10-M72-集团军第十二批与华南人物-design.md`
- `docs/releases/2026-11-10-v0.72.0-m72.md`
- `docs/conversations/2026-11-10-M72-集团军第十二批与华南人物.md`

---

## [v0.71.0-m71] - 2026-11-10

### Added
- 集团军新增第22、23、25、36、38 集团军 5 个事件。
- 日军新增进攻襄阳、上饶、金华、洛阳 4 个事件。
- 华南新增尹林平、林锵云 2 个人物节点。
- 新增集团军 4 段、日军 1 段路线。
- 发布说明 `docs/releases/2026-11-10-v0.71.0-m71.md`。

### Changed
- 抗日战争专题 195 → 206 事件，175 → 180 路线段。
- 全项目 353 → 364 事件，295 → 300 路线段。
- 搜索索引：4 专题 / 364 事件 / 718.3 KB；数据版本 `2026-11-10-3385d196bbd5`。
- 四包版本统一为 `0.71.0`；Android `versionCode` 升为 68；iOS build 68。

### Docs
- `docs/plans/2026-11-10-M71-集团军第十一批与华南人物-plan.md`
- `docs/plans/2026-11-10-M71-集团军第十一批与华南人物-design.md`
- `docs/releases/2026-11-10-v0.71.0-m71.md`
- `docs/conversations/2026-11-10-M71-集团军第十一批与华南人物.md`

---

## [v0.70.0-m70] - 2026-11-09

### Added
- 集团军新增第2、3、7、35 集团军 4 个事件。
- 日军新增进攻郑州、包头、南阳 3 个事件。
- 华南新增粤赣湘边、临高根据地 2 个事件。
- 新增集团军 3 段、日军 3 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.70.0-m70.md`。

### Changed
- 抗日战争专题 186 → 195 事件，167 → 175 路线段。
- 全项目 344 → 353 事件，287 → 295 路线段。
- 搜索索引：4 专题 / 353 事件 / 697.0 KB；数据版本 `2026-11-09-f472ef7fb13a`。
- 四包版本统一为 `0.70.0`；Android `versionCode` 升为 67；iOS build 67。

### Docs
- `docs/plans/2026-11-09-M70-集团军第十批与华南粤赣湘边-plan.md`
- `docs/plans/2026-11-09-M70-集团军第十批与华南粤赣湘边-design.md`
- `docs/releases/2026-11-09-v0.70.0-m70.md`
- `docs/conversations/2026-11-09-M70-集团军第十批与华南粤赣湘边.md`

---

## [v0.69.0-m69] - 2026-11-09

### Added
- 集团军新增第2、3、7、35 集团军 6 个事件。
- 日军新增进攻桐柏、三水 2 个事件。
- 华南新增珠江纵队挺进云雾山、琼崖纵队挺进尖峰岭 2 个事件。
- 新增集团军 4 段、日军 2 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.69.0-m69.md`。

### Changed
- 抗日战争专题 176 → 186 事件，159 → 167 路线段。
- 全项目 334 → 344 事件，279 → 287 路线段。
- 搜索索引：4 专题 / 344 事件 / 680.1 KB；数据版本 `2026-11-09-5d275ab71182`。
- 四包版本统一为 `0.69.0`；Android `versionCode` 升为 66；iOS build 66。

### Docs
- `docs/plans/2026-11-09-M69-集团军第九批与华南云雾山-plan.md`
- `docs/plans/2026-11-09-M69-集团军第九批与华南云雾山-design.md`
- `docs/releases/2026-11-09-v0.69.0-m69.md`
- `docs/conversations/2026-11-09-M69-集团军第九批与华南云雾山.md`

---

## [v0.68.0-m68] - 2026-11-09

### Added
- 集团军新增第1、4、5、6 集团军 4 个事件。
- 日军新增进攻平型关、中条山（1938）2 个事件。
- 华南新增东江纵队挺进粤北、海陆丰根据地 2 个事件。
- 新增集团军 3 段、日军 2 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.68.0-m68.md`。

### Changed
- 抗日战争专题 168 → 176 事件，152 → 159 路线段。
- 全项目 326 → 334 事件，272 → 279 路线段。
- 搜索索引：4 专题 / 334 事件 / 661.0 KB；数据版本 `2026-11-09-e53d33b48e72`。
- 四包版本统一为 `0.68.0`；Android `versionCode` 升为 65；iOS build 65。

### Docs
- `docs/plans/2026-11-09-M68-集团军第八批与华南粤北-plan.md`
- `docs/plans/2026-11-09-M68-集团军第八批与华南粤北-design.md`
- `docs/releases/2026-11-09-v0.68.0-m68.md`
- `docs/conversations/2026-11-09-M68-集团军第八批与华南粤北.md`

---

## [v0.67.0-m67] - 2026-11-09

### Added
- 集团军新增第11、20、31、21 集团军 4 个事件。
- 日军新增进攻豫中、滇西防御 2 个事件。
- 华南新增罗浮山、儋州根据地 2 个事件。
- 新增集团军 4 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.67.0-m67.md`。

### Changed
- 抗日战争专题 160 → 168 事件，148 → 152 路线段。
- 全项目 318 → 326 事件，268 → 272 路线段。
- 搜索索引：4 专题 / 326 事件 / 645.4 KB；数据版本 `2026-11-09-23d77294bfb9`。
- 四包版本统一为 `0.67.0`；Android `versionCode` 升为 64；iOS build 64。

### Docs
- `docs/plans/2026-11-09-M67-集团军第七批与华南罗浮山-plan.md`
- `docs/plans/2026-11-09-M67-集团军第七批与华南罗浮山-design.md`
- `docs/releases/2026-11-09-v0.67.0-m67.md`
- `docs/conversations/2026-11-09-M67-集团军第七批与华南罗浮山.md`

---

## [v0.66.0-m66] - 2026-11-09

### Added
- 集团军新增第12、31、27、30 集团军 4 个事件。
- 日军新增进攻粤北、豫南 2 个事件。
- 华南新增大鹏半岛、六连岭根据地 2 个事件。
- 新增集团军 3 段、日军 2 段、华南游击队 1 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.66.0-m66.md`。

### Changed
- 抗日战争专题 152 → 160 事件，142 → 148 路线段。
- 全项目 310 → 318 事件，262 → 268 路线段。
- 搜索索引：4 专题 / 318 事件 / 630.3 KB；数据版本 `2026-11-09-89643b57eb06`。
- 四包版本统一为 `0.66.0`；Android `versionCode` 升为 63；iOS build 63。

### Docs
- `docs/plans/2026-11-09-M66-集团军第六批与华南大鹏-plan.md`
- `docs/plans/2026-11-09-M66-集团军第六批与华南大鹏-design.md`
- `docs/releases/2026-11-09-v0.66.0-m66.md`
- `docs/conversations/2026-11-09-M66-集团军第六批与华南大鹏.md`

---

## [v0.65.0-m65] - 2026-11-09

### Added
- 集团军新增第10、26、29、30 集团军 4 个事件。
- 日军新增进攻鄂西、常德 2 个事件。
- 华南新增珠江纵队挺进粤中、琼崖纵队挺进五指山 2 个事件。
- 新增集团军 4 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.65.0-m65.md`。

### Changed
- 抗日战争专题 144 → 152 事件，136 → 142 路线段。
- 全项目 302 → 310 事件，256 → 262 路线段。
- 搜索索引：4 专题 / 310 事件 / 614.7 KB；数据版本 `2026-11-09-e8d2931dc6c0`。
- 四包版本统一为 `0.65.0`；Android `versionCode` 升为 62；iOS build 62。

### Docs
- `docs/plans/2026-11-09-M65-集团军第五批与华南粤中-plan.md`
- `docs/plans/2026-11-09-M65-集团军第五批与华南粤中-design.md`
- `docs/releases/2026-11-09-v0.65.0-m65.md`
- `docs/conversations/2026-11-09-M65-集团军第五批与华南粤中.md`

---

## [v0.64.0-m64] - 2026-11-09

### Added
- 集团军新增第16、21、32、9 集团军 6 个事件。
- 日军新增进攻桂南、大别山 2 个事件。
- 华南新增港九大队营救美军飞行员、五桂山根据地 2 个事件。
- 新增集团军 5 段、日军 2 段、华南游击队 1 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.64.0-m64.md`。

### Changed
- 抗日战争专题 134 → 144 事件，128 → 136 路线段。
- 全项目 292 → 302 事件，248 → 256 路线段。
- 搜索索引：4 专题 / 302 事件 / 599.7 KB；数据版本 `2026-11-09-2c882c7eadb1`。
- 四包版本统一为 `0.64.0`；Android `versionCode` 升为 61；iOS build 61。

### Docs
- `docs/plans/2026-11-09-M64-集团军第四批与华南港九营救-plan.md`
- `docs/plans/2026-11-09-M64-集团军第四批与华南港九营救-design.md`
- `docs/releases/2026-11-09-v0.64.0-m64.md`
- `docs/conversations/2026-11-09-M64-集团军第四批与华南港九营救.md`

---

## [v0.63.0-m63] - 2026-11-09

### Added
- 集团军新增第15、19、24、27 集团军 5 个事件。
- 日军新增进攻南昌、上高、太行山 3 个事件。
- 华南新增港九大队成立、阳台山根据地 2 个事件。
- 新增集团军 5 段、日军 2 段、华南游击队 1 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.63.0-m63.md`。

### Changed
- 抗日战争专题 124 → 134 事件，120 → 128 路线段。
- 全项目 282 → 292 事件，240 → 248 路线段。
- 搜索索引：4 专题 / 292 事件 / 580.8 KB；数据版本 `2026-11-09-2767248fb0b5`。
- 四包版本统一为 `0.63.0`；Android `versionCode` 升为 60；iOS build 60。

### Docs
- `docs/plans/2026-11-09-M63-集团军第三批与华南港九-plan.md`
- `docs/plans/2026-11-09-M63-集团军第三批与华南港九-design.md`
- `docs/releases/2026-11-09-v0.63.0-m63.md`
- `docs/conversations/2026-11-09-M63-集团军第三批与华南港九.md`

---

## [v0.62.0-m62] - 2026-11-09

### Added
- 集团军新增第5、6、10、20、33、3 集团军 6 个事件。
- 日军新增进攻中条山、浙赣、枣宜、鲁南 4 个事件。
- 华南新增大岭山、白沙根据地 2 个事件。
- 新增集团军 4 段、日军 2 段、华南游击队 2 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.62.0-m62.md`。

### Changed
- 抗日战争专题 112 → 124 事件，112 → 120 路线段。
- 全项目 270 → 282 事件，232 → 240 路线段。
- 搜索索引：4 专题 / 282 事件 / 561.8 KB；数据版本 `2026-11-09-ed80335dc0e9`。
- 四包版本统一为 `0.62.0`；Android `versionCode` 升为 59；iOS build 59。

### Docs
- `docs/plans/2026-11-09-M62-集团军扩充与华南根据地-plan.md`
- `docs/plans/2026-11-09-M62-集团军扩充与华南根据地-design.md`
- `docs/releases/2026-11-09-v0.62.0-m62.md`
- `docs/conversations/2026-11-09-M62-集团军扩充与华南根据地.md`

---

## [v0.61.0-m61] - 2026-11-09

### Added
- 新增实体 `kmt-group-armies`（国民党军集团军）与独立路线图层。
- 集团军新增第8、9、14、7、2、31 集团军 6 个事件。
- 日军新增进攻忻口、太原、台儿庄、随枣 4 个事件。
- 华南新增美合事变。
- 新增集团军 4 段、日军 2 段、华南 1 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.61.0-m61.md`。

### Changed
- 抗日战争专题 101 → 112 事件，105 → 112 路线段。
- 全项目 259 → 270 事件，225 → 232 路线段。
- 搜索索引：4 专题 / 270 事件 / 540.0 KB；数据版本 `2026-11-09-3dde2df03ab0`。
- 四包版本统一为 `0.61.0`；Android `versionCode` 升为 58；iOS build 58。

### Docs
- `docs/plans/2026-11-09-M61-正面战场集团军图层-plan.md`
- `docs/plans/2026-11-09-M61-正面战场集团军图层-design.md`
- `docs/releases/2026-11-09-v0.61.0-m61.md`
- `docs/conversations/2026-11-09-M61-正面战场集团军图层.md`

---

## [v0.60.0-m60] - 2026-11-09

### Added
- 正面战场新增第13军南口、第18军罗店、第59军临沂、第52军台儿庄、第35军五原、第20军长沙 6 个事件。
- 日军新增进攻南口、临沂、五原、第二次长沙 4 个事件。
- 华南新增东江、琼崖根据地 2 个事件。
- 新增国民党军 4 段、日军 3 段、华南游击队 1 段路线。
- 发布说明 `docs/releases/2026-11-09-v0.60.0-m60.md`。

### Changed
- 抗日战争专题 89 → 101 事件，97 → 105 路线段。
- 全项目 247 → 259 事件，217 → 225 路线段。
- 搜索索引：4 专题 / 259 事件 / 520.8 KB；数据版本 `2026-11-09-d02cce3d1fe4`。
- 四包版本统一为 `0.60.0`；Android `versionCode` 升为 57；iOS build 57。

### Docs
- `docs/plans/2026-11-09-M60-正面战场军级序列第二批-plan.md`
- `docs/plans/2026-11-09-M60-正面战场军级序列第二批-design.md`
- `docs/releases/2026-11-09-v0.60.0-m60.md`
- `docs/conversations/2026-11-09-M60-正面战场军级序列第二批.md`

---

## [v0.59.0-m59] - 2026-11-08

### Added
- 华南敌后新增珠江纵队、韩江纵队、南路人民抗日解放军 3 个事件。
- 正面战场新增第29军、第18集团军、第5军、第74军、第10军（常德、衡阳）6 个事件。
- 日军新增进攻淞沪、徐州、武汉、长沙 4 个事件。
- 新增华南 3 段、国民党军 6 段、日军 2 段路线。
- 发布说明 `docs/releases/2026-11-08-v0.59.0-m59.md`。

### Changed
- 抗日战争专题 76 → 89 事件，86 → 97 路线段。
- 全项目 234 → 247 事件，206 → 217 路线段。
- 搜索索引：4 专题 / 247 事件 / 499.2 KB；数据版本 `2026-11-08-29307d2c8ebe`。
- 四包版本统一为 `0.59.0`；Android `versionCode` 升为 56；iOS build 56。

### Docs
- `docs/plans/2026-11-08-M59-华南纵队与正面战场军级序列-plan.md`
- `docs/plans/2026-11-08-M59-华南纵队与正面战场军级序列-design.md`
- `docs/releases/2026-11-08-v0.59.0-m59.md`
- `docs/conversations/2026-11-08-M59-华南纵队与正面战场军级序列.md`

---

## [v0.58.0-m58] - 2026-11-08

### Added
- 新增实体 `south-china-guerrillas`（华南抗日游击队）。
- 华南敌后新增琼崖独立队、香港营救、琼崖反“扫荡”、东江纵队成立 4 个事件。
- 正面战场新增第一、二、三、九战区与远征军司令长官部 5 个事件。
- 日军新增进攻广州、香港、缅甸、河南、长沙 5 个事件。
- 新增华南游击队 3 段、国民党军 2 段、日军 5 段路线。
- 发布说明 `docs/releases/2026-11-08-v0.58.0-m58.md`。

### Changed
- 抗日战争专题 62 → 76 事件，76 → 86 路线段。
- 全项目 220 → 234 事件，196 → 206 路线段。
- 搜索索引：4 专题 / 234 事件 / 475.1 KB；数据版本 `2026-11-08-79295e9a77b4`。
- 四包版本统一为 `0.58.0`；Android `versionCode` 升为 55；iOS build 55。
- 昆明—滇西路线补入楚雄节点。

### Docs
- `docs/plans/2026-11-08-M58-华南敌后与正面战场战区序列-plan.md`
- `docs/plans/2026-11-08-M58-华南敌后与正面战场战区序列-design.md`
- `docs/releases/2026-11-08-v0.58.0-m58.md`
- `docs/conversations/2026-11-08-M58-华南敌后与正面战场战区序列.md`

---

## [v0.57.0-m57] - 2026-11-08

### Added
- 新增实体 `kmt-forces`（国民党军正面战场）、`eighth-route-army`（八路军）、`new-fourth-army`（新四军）。
- 正面战场新增江阴封锁线、笕桥空战、第五战区、第 200 师、滇军第 60 军、桂林柳州失守 6 个事件。
- 华北敌后新增八路军成立、晋察冀、晋绥、晋冀鲁豫、山东纵队、黄崖洞、十字岭 7 个事件。
- 华中敌后新增新四军成立、黄桥、皖南事变、重建军部、车桥 5 个事件。
- 新增国民党军 7 段、八路军 8 段、新四军 5 段、日军 1 段路线。
- 发布说明 `docs/releases/2026-11-08-v0.57.0-m57.md`。

### Changed
- 抗日战争专题 44 → 62 事件，55 → 76 路线段。
- 全项目 202 → 220 事件，175 → 196 路线段。
- 搜索索引：4 专题 / 220 事件 / 447.7 KB；数据版本 `2026-11-08-5040f5abde07`。
- 四包版本统一为 `0.57.0`；Android `versionCode` 升为 54；iOS build 54。
- 平型关、百团大战补八路军；远征军入缅、滇西、松山补国民党军。

### Docs
- `docs/plans/2026-11-08-M57-抗战正面战场与敌后根据地扩充-plan.md`
- `docs/plans/2026-11-08-M57-抗战正面战场与敌后根据地扩充-design.md`
- `docs/releases/2026-11-08-v0.57.0-m57.md`
- `docs/conversations/2026-11-08-M57-抗战正面战场与敌后根据地扩充.md`

---

## [v0.56.0-m56] - 2026-11-08

### Added
- 红十五军团新增 7 个事件：东征、关上村、兑九峪、东征回师、西征、解放盐池、西征结束。
- 国民党军新增追堵东征、堵截西征 2 个事件与 2 段路线。
- 红十五军团路线续接 7 段至 1936-07-27。
- 发布说明 `docs/releases/2026-11-08-v0.56.0-m56.md`。

### Changed
- 长征专题 71 → 80 事件，69 → 78 路线段。
- 全项目 193 → 202 事件，166 → 175 路线段。
- 搜索索引：4 专题 / 202 事件 / 411.1 KB；数据版本 `2026-11-08-c904c44947f7`。
- 四包版本统一为 `0.56.0`；Android `versionCode` 升为 53；iOS build 53。

### Docs
- `docs/plans/2026-11-08-M56-红十五军团东征西征-plan.md`
- `docs/plans/2026-11-08-M56-红十五军团东征西征-design.md`
- `docs/releases/2026-11-08-v0.56.0-m56.md`
- `docs/conversations/2026-11-08-M56-红十五军团东征西征.md`

---

## [v0.55.0-m55] - 2026-11-08

### Added
- 红二十五军新增 7 个事件：何家冲出发、独树镇、庾家河、鄂豫陕苏区、袁家沟口、西征、四坡村。
- 国民党军新增追堵红二十五军事件与「豫—陕—甘」路线。
- 红二十五军主线由 1 段拆为 7 段。
- 发布说明 `docs/releases/2026-11-08-v0.55.0-m55.md`。

### Changed
- 长征专题 63 → 71 事件，62 → 69 路线段。
- 全项目 185 → 193 事件，159 → 166 路线段。
- 搜索索引：4 专题 / 193 事件 / 394.1 KB；数据版本 `2026-11-08-6a59d3e6a40a`。
- 四包版本统一为 `0.55.0`；Android `versionCode` 升为 52；iOS build 52。
- 永坪会师事件补入四坡村关联。

### Docs
- `docs/plans/2026-11-08-M55-红二十五军西征主线补齐-plan.md`
- `docs/plans/2026-11-08-M55-红二十五军西征主线补齐-design.md`
- `docs/releases/2026-11-08-v0.55.0-m55.md`
- `docs/conversations/2026-11-08-M55-红二十五军西征主线补齐.md`

---

## [v0.54.0-m54] - 2026-11-08

### Added
- 新增实体 `red-15-army`（红十五军团）与独立路线图层 `red-15-army.geojson`。
- 新增红十五军团成立、劳山战役、榆林桥战役 3 个事件。
- 新增「永坪—劳山」「劳山—榆林桥」「榆林桥—直罗镇」3 段路线。
- 发布说明 `docs/releases/2026-11-08-v0.54.0-m54.md`。

### Changed
- 长征专题 60 → 63 事件，59 → 62 路线段。
- 全项目 182 → 185 事件，156 → 159 路线段。
- 搜索索引：4 专题 / 185 事件 / 378.3 KB；数据版本 `2026-11-08-9b5a71718a2f`。
- 四包版本统一为 `0.54.0`；Android `versionCode` 升为 51；iOS build 51。
- 直罗镇战役事件补入红十五军团。

### Docs
- `docs/plans/2026-11-08-M54-红十五军团独立图层-plan.md`
- `docs/plans/2026-11-08-M54-红十五军团独立图层-design.md`
- `docs/releases/2026-11-08-v0.54.0-m54.md`
- `docs/conversations/2026-11-08-M54-红十五军团独立图层.md`

---

## [v0.53.0-m53] - 2026-11-06

### Added
- 陕北红军新增 8 个苏区前置事件：照金第一次反“围剿”、南梁苏维埃政府、红二十七军成立、周家硷会议、第二次反“围剿”、西北军委前敌总指挥部、连克六城、第三次反“围剿”。
- 国民党军新增“第三次围剿陕甘苏区”事件与「西安—延安」路线。
- 陕北红军新增 3 段苏区前置路线。
- 发布说明 `docs/releases/2026-11-06-v0.53.0-m53.md`。

### Changed
- 长征专题 51 → 60 事件，55 → 59 路线段；时间范围前移至 1934-02-01。
- 全项目 173 → 182 事件，152 → 156 路线段。
- 搜索索引：4 专题 / 182 事件 / 371.8 KB；数据版本 `2026-11-06-8d393f653b8b`。
- 四包版本统一为 `0.53.0`；Android `versionCode` 升为 50；iOS build 50。
- 修正「永坪会师」表述：9 月 15 日到达会合，9 月 18 日会师大会并成立红十五军团。
- `shaanxi-red-army` 实体描述补充红二十六军、红二十七军与陕甘边/陕北地方武装。

### Docs
- `docs/plans/2026-11-06-M53-陕北红军苏区前置节点补齐-plan.md`
- `docs/plans/2026-11-06-M53-陕北红军苏区前置节点补齐-design.md`
- `docs/releases/2026-11-06-v0.53.0-m53.md`
- `docs/conversations/2026-11-06-M53启动与陕北红军苏区前置节点补齐.md`

---

## [v0.52.0-m52] - 2026-11-06

### Added
- 新增实体 `red-6-army`（红六军团）。
- 红六军团西征出发、木黄会师 2 个事件与「遂川—木黄」路线。
- 十万坪、陈家河、忠堡、板栗园、桑植出发、乌蒙山、石鼓渡江、甘孜会师、红二方面军成立 9 个事件。
- 国民党军“围剿”湘鄂川黔苏区事件与「常德—永顺」路线。
- 红二军团主线拆分为 6 段，新增 3 段苏区支线与红四方面军「懋功—甘孜」段。
- 发布说明 `docs/releases/2026-11-06-v0.52.0-m52.md`。

### Changed
- 长征专题 39 → 51 事件，44 → 55 路线段；时间范围前移至 1934-08-07。
- 全项目 161 → 173 事件，141 → 152 路线段。
- 搜索索引：4 专题 / 173 事件 / 349.3 KB；数据版本 `2026-11-06-b6f52bb857b8`。
- 四包版本统一为 `0.52.0`；Android `versionCode` 升为 49；iOS build 49。
- 修正会宁会师表述：红二方面军实际在将台堡与红一方面军会师。

### Docs
- `docs/plans/2026-11-06-M52-红二六军团长征主线补齐-plan.md`
- `docs/plans/2026-11-06-M52-红二六军团长征主线补齐-design.md`
- `docs/releases/2026-11-06-v0.52.0-m52.md`
- `docs/conversations/2026-11-06-M52-红二六军团长征主线补齐.md`

---

## [v0.51.0-m51] - 2026-11-06

### Added
- 郑和新增南巫里、甘巴里、阿拨把丹 3 个事件。
- 玄奘新增缚喝、萨他泥湿伐罗、秣兔罗 3 个事件。
- 修改郑和满剌加—锡兰山、古里—忽鲁谟斯航线与玄奘铁门—巴米扬、迦毕试—那烂陀路线节点。
- 发布说明 `docs/releases/2026-11-06-v0.51.0-m51.md`。

### Changed
- 郑和专题 38 → 41 事件。
- 玄奘专题 34 → 37 事件。
- 全项目 155 → 161 事件，路线段仍为 141。
- 搜索索引：4 专题 / 161 事件 / 325.7 KB；数据版本 `2026-11-06-cb5dc31eae40`。
- 四包版本统一为 `0.51.0`；Android `versionCode` 升为 48；iOS build 48。

### Docs
- `docs/plans/2026-11-06-M51-郑和玄奘节点扩充第五批-plan.md`
- `docs/plans/2026-11-06-M51-郑和玄奘节点扩充第五批-design.md`
- `docs/releases/2026-11-06-v0.51.0-m51.md`
- `docs/conversations/2026-11-06-M51启动与郑和玄奘节点扩充第五批.md`

---

## [v0.50.0-m50] - 2026-11-06

### Added
- 郑和新增加异勒、小葛兰、柯枝 3 个事件。
- 玄奘新增迦毗罗卫、阿逾陀、憍赏弥 3 个事件。
- 修改郑和印度西南海岸航线与玄奘北印度路线节点。
- 发布说明 `docs/releases/2026-11-06-v0.50.0-m50.md`。

### Changed
- 郑和专题 35 → 38 事件。
- 玄奘专题 31 → 34 事件。
- 全项目 149 → 155 事件，路线段仍为 141。
- 搜索索引：4 专题 / 155 事件 / 316.2 KB；数据版本 `2026-11-06-ac5614f283a0`。
- 四包版本统一为 `0.50.0`；Android `versionCode` 升为 47；iOS build 47。

### Docs
- `docs/plans/2026-11-06-M50-郑和玄奘节点扩充第四批-plan.md`
- `docs/plans/2026-11-06-M50-郑和玄奘节点扩充第四批-design.md`
- `docs/releases/2026-11-06-v0.50.0-m50.md`
- `docs/conversations/2026-11-06-M50启动与郑和玄奘节点扩充第四批.md`

---

## [v0.49.0-m49] - 2026-11-06

### Added
- 郑和新增天方事件与阿丹—天方支线。
- 玄奘新增乌仗那、迦湿弥罗、摩揭陀 3 个事件。
- 新增呾叉始罗—乌仗那—迦湿弥罗支线。
- 发布说明 `docs/releases/2026-11-06-v0.49.0-m49.md`。

### Changed
- 郑和专题 34 → 35 事件，21 → 22 路线段。
- 玄奘专题 28 → 31 事件，19 → 20 路线段。
- 全项目 145 → 149 事件，139 → 141 路线段。
- 搜索索引：4 专题 / 149 事件 / 306.8 KB；数据版本 `2026-11-06-04b5e1edf02f`。
- 四包版本统一为 `0.49.0`；Android `versionCode` 升为 46；iOS build 46。

### Docs
- `docs/plans/2026-11-06-M49-郑和玄奘节点扩充第三批-plan.md`
- `docs/plans/2026-11-06-M49-郑和玄奘节点扩充第三批-design.md`
- `docs/releases/2026-11-06-v0.49.0-m49.md`
- `docs/conversations/2026-11-06-M49启动与郑和玄奘节点扩充第三批.md`

---

## [v0.48.0-m48] - 2026-11-06

### Added
- 郑和新增祖法儿、竹步 2 个事件。
- 玄奘新增祇园精舍、僧伽施 2 个事件。
- 修改郑和东非航线与玄奘北印度路线节点。
- 发布说明 `docs/releases/2026-11-06-v0.48.0-m48.md`。

### Changed
- 郑和专题 32 → 34 事件。
- 玄奘专题 26 → 28 事件。
- 全项目 141 → 145 事件，路线段仍为 139。
- 搜索索引：4 专题 / 145 事件 / 300.3 KB；数据版本 `2026-11-06-cb52317608e2`。
- 四包版本统一为 `0.48.0`；Android `versionCode` 升为 45；iOS build 45。

### Docs
- `docs/plans/2026-11-06-M48-郑和玄奘节点扩充第二批-plan.md`
- `docs/plans/2026-11-06-M48-郑和玄奘节点扩充第二批-design.md`
- `docs/releases/2026-11-06-v0.48.0-m48.md`
- `docs/conversations/2026-11-06-M48启动与郑和玄奘节点扩充第二批.md`

---

## [v0.47.0-m47] - 2026-11-06

### Added
- 郑和新增爪哇、溜山、卜剌哇 3 个事件。
- 玄奘新增呾叉始罗、吠舍离、蓝毗尼 3 个事件。
- 新增「满剌加—爪哇」航线，修改 3 段既有航线节点。
- 发布说明 `docs/releases/2026-11-06-v0.47.0-m47.md`。

### Changed
- 郑和专题 29 → 32 事件，20 → 21 路线段。
- 玄奘专题 23 → 26 事件。
- 全项目 135 → 141 事件，138 → 139 路线段。
- 搜索索引：4 专题 / 141 事件 / 293.7 KB；数据版本 `2026-11-06-490293ad27b8`。
- 四包版本统一为 `0.47.0`；Android `versionCode` 升为 44；iOS build 44。

### Docs
- `docs/plans/2026-11-06-M47-郑和玄奘节点扩充-plan.md`
- `docs/plans/2026-11-06-M47-郑和玄奘节点扩充-design.md`
- `docs/releases/2026-11-06-v0.47.0-m47.md`
- `docs/conversations/2026-11-06-M47启动与郑和玄奘节点扩充.md`

---

## [v0.46.0-m46] - 2026-11-06

### Added
- 长征新增国民党军追堵红二、六军团事件与路线。
- 长征新增国民党军堵截红四方面军事件与路线。
- 湘江封锁线拆分为湘军、桂军两段。
- 发布说明 `docs/releases/2026-11-06-v0.46.0-m46.md`。

### Changed
- 长征专题 37 → 39 事件，41 → 44 路线段。
- 全项目 133 → 135 事件，135 → 138 路线段。
- 搜索索引：4 专题 / 135 事件 / 283.8 KB；数据版本 `2026-11-06-ab7581385574`。
- 四包版本统一为 `0.46.0`；Android `versionCode` 升为 43；iOS build 43。

### Docs
- `docs/plans/2026-11-06-M46-长征国民党军追堵扩充-plan.md`
- `docs/plans/2026-11-06-M46-长征国民党军追堵扩充-design.md`
- `docs/releases/2026-11-06-v0.46.0-m46.md`
- `docs/conversations/2026-11-06-M46启动与长征国民党军追堵扩充.md`

---

## [v0.45.0-m45] - 2026-11-06

### Added
- 长征 6 段国民党军路线、5 个事件加派系/部队标注。
- 新增国民党军六盘山骑兵追击事件。
- 新增六盘山骑兵追击、赣—湘—黔追击路线。
- 发布说明 `docs/releases/2026-11-06-v0.45.0-m45.md`。

### Changed
- 长征专题 36 → 37 事件，39 → 41 路线段。
- 全项目 132 → 133 事件，133 → 135 路线段。
- 搜索索引：4 专题 / 133 事件 / 278.9 KB；数据版本 `2026-11-06-8363560dae0e`。
- 四包版本统一为 `0.45.0`；Android `versionCode` 升为 42；iOS build 42。

### Docs
- `docs/plans/2026-11-06-M45-长征国民党军派系细化-plan.md`
- `docs/plans/2026-11-06-M45-长征国民党军派系细化-design.md`
- `docs/releases/2026-11-06-v0.45.0-m45.md`
- `docs/conversations/2026-11-06-M45启动与长征国民党军派系细化.md`

---

## [v0.44.0-m44] - 2026-11-05

### Added
- 长征新增国民党军 6 段追堵/封锁路线。
- 长征新增 5 个国民党军事件：湘江封锁、乌江防线、金沙江封锁、大渡河防线、腊子口封锁。
- 直罗镇战役加入国民党军实体。
- 发布说明 `docs/releases/2026-11-05-v0.44.0-m44.md`。

### Changed
- 长征专题 31 → 36 事件，33 → 39 路线段。
- 全项目 127 → 132 事件，127 → 133 路线段。
- 搜索索引：4 专题 / 132 事件 / 273.7 KB；数据版本 `2026-11-05-8e1943645b5e`。
- 四包版本统一为 `0.44.0`；Android `versionCode` 升为 41；iOS build 41。

### Docs
- `docs/plans/2026-11-05-M44-长征国民党军追堵-plan.md`
- `docs/plans/2026-11-05-M44-长征国民党军追堵-design.md`
- `docs/releases/2026-11-05-v0.44.0-m44.md`
- `docs/conversations/2026-11-05-M44启动与长征国民党军追堵.md`

---

## [v0.43.0-m43] - 2026-11-05

### Added
- 长征新增强渡乌江、包座战役、榜罗镇会议。
- 郑和新增旧港、苏门答剌、木骨都束。
- 玄奘新增健陀罗、波罗奈、拘尸那迦。
- 8 处路线节点插入/复用。
- 发布说明 `docs/releases/2026-11-05-v0.43.0-m43.md`。

### Changed
- 全项目事件数 118 → 127，路线段仍为 127。
- 搜索索引：4 专题 / 127 事件 / 263.3 KB；数据版本 `2026-11-05-9ad5d662c5f9`。
- 四包版本统一为 `0.43.0`；Android `versionCode` 升为 40；iOS build 40。

### Docs
- `docs/plans/2026-11-05-M43-节点与事件扩充-plan.md`
- `docs/plans/2026-11-05-M43-节点与事件扩充-design.md`
- `docs/releases/2026-11-05-v0.43.0-m43.md`
- `docs/conversations/2026-11-05-M43启动与节点事件扩充.md`

---

## [v0.42.0-m42] - 2026-11-05

### Added
- 共享路线样式与中英文标签 `route-style.ts`。
- Web 地图按 `segmentType` 显示实线/虚线/点线。
- Web 图例新增「路线样式」区块。
- 移动端地图线宽/虚线，筛选面板新增路线样式图例。
- 发布说明 `docs/releases/2026-11-05-v0.42.0-m42.md`。

### Changed
- 四包版本统一为 `0.42.0`；Android `versionCode` 升为 39；iOS build 39。
- 完整开发计划新增并完成「路线样式与图例」条目。

### Docs
- `docs/plans/2026-11-05-M42-路线样式与图例-plan.md`
- `docs/plans/2026-11-05-M42-路线样式与图例-design.md`
- `docs/releases/2026-11-05-v0.42.0-m42.md`
- `docs/conversations/2026-11-05-M42启动与路线样式图例.md`

---

## [v0.41.0-m41] - 2026-11-05

### Added
- 全部 127 段路线补 `segmentType`。
- 全部 127 段路线补 `extensions.precision`（campaign 40 / schematic 87）。
- Schema v1.1 文档新增 `precision` 推荐扩展字段。
- 发布说明 `docs/releases/2026-11-05-v0.41.0-m41.md`。

### Changed
- 搜索索引数据版本更新为 `2026-11-05-c8af60569011`。
- 四包版本统一为 `0.41.0`；Android `versionCode` 升为 38；iOS build 38。

### Docs
- `docs/plans/2026-11-05-M41-路线分段类型与精度标注-plan.md`
- `docs/plans/2026-11-05-M41-路线分段类型与精度标注-design.md`
- `docs/releases/2026-11-05-v0.41.0-m41.md`
- `docs/conversations/2026-11-05-M41启动与路线语义标注.md`

---

## [v0.40.0-m40] - 2026-11-05

### Added
- 长征、郑和、玄奘三专题共 35 个事件补充通行别名。
- 三专题史料与坐标校订报告（覆盖 74 个事件）。
- 发布说明 `docs/releases/2026-11-05-v0.40.0-m40.md`。

### Changed
- 长征事件数组按日期稳定排序，修正永坪会师位置。
- 搜索索引：4 专题 / 118 事件 / 247.6 KB；数据版本 `2026-11-05-7758bbc51df8`。
- 四包版本统一为 `0.40.0`；Android `versionCode` 升为 37；iOS build 37。

### Docs
- `docs/plans/2026-11-05-M40-三专题史料细化-plan.md`
- `docs/plans/2026-11-05-M40-三专题史料细化-design.md`
- `docs/releases/2026-11-05-三专题史料与坐标校订.md`
- `docs/releases/2026-11-05-v0.40.0-m40.md`
- `docs/conversations/2026-11-05-M40启动与三专题史料细化.md`

---

## [v0.39.0-m39] - 2026-11-05

### Added
- 27 个事件共 35 条通行别名，进入搜索索引。
- 抗日战争史料与坐标校订报告（覆盖 44 个事件）。
- 发布说明 `docs/releases/2026-11-05-v0.39.0-m39.md`。

### Changed
- `events.json` 按日期稳定排序。
- 平型关大捷坐标由 113.95, 39.35 修正为 113.75, 39.34。
- 搜索索引：4 专题 / 118 事件 / 244.9 KB；数据版本 `2026-11-05-2a170c0b79de`。
- 四包版本统一为 `0.39.0`；Android `versionCode` 升为 36；iOS build 36。

### Docs
- `docs/plans/2026-11-05-M39-抗战史料细化-plan.md`
- `docs/plans/2026-11-05-M39-抗战史料细化-design.md`
- `docs/releases/2026-11-05-抗日战争史料与坐标校订.md`
- `docs/releases/2026-11-05-v0.39.0-m39.md`
- `docs/conversations/2026-11-05-M39启动与抗战史料细化.md`

---

## [v0.38.0-m38] - 2026-11-05

### Added
- 抗日战争专题新增滇西反攻事件 `dianxi-1944-05`。
- 中国军队东线、盟军/远征军西线、日军防御线三条路线。
- 发布说明 `docs/releases/2026-11-05-v0.38.0-m38.md`。

### Changed
- 抗日战争专题事件数 43 → 44，路线段 52 → 55。
- 全项目事件数 117 → 118，路线段 124 → 127。
- 搜索索引：4 专题 / 118 事件 / 242.4 KB；数据版本 `2026-11-05-b86ce6ab2711`。
- 四包版本统一为 `0.38.0`；Android `versionCode` 升为 35；iOS build 35。

### Docs
- `docs/plans/2026-11-05-M38-滇西反攻细化-plan.md`
- `docs/plans/2026-11-05-M38-滇西反攻细化-design.md`
- `docs/releases/2026-11-05-v0.38.0-m38.md`
- `docs/conversations/2026-11-05-M38启动与滇西反攻细化.md`

---

## [v0.37.0-m37] - 2026-11-05

### Added
- 抗日战争专题新增兰封会战事件 `lanfeng-1938-05` 与中日双方路线。
- 抗日战争专题新增随枣会战事件 `suizao-1939-05` 与中日双方路线。
- 抗日战争专题新增昆仑关战役事件 `kunlun-1939-12` 与中日双方路线。
- 发布说明 `docs/releases/2026-11-05-v0.37.0-m37.md`。

### Changed
- 抗日战争专题事件数 40 → 43，路线段 46 → 52。
- 全项目事件数 114 → 117，路线段 118 → 124。
- 搜索索引：4 专题 / 117 事件 / 238.7 KB；数据版本 `2026-11-05-a97a3acb89f7`。
- 四包版本统一为 `0.37.0`；Android `versionCode` 升为 34；iOS build 34。

### Docs
- `docs/plans/2026-11-05-M37-抗战路线精修第八批-plan.md`
- `docs/plans/2026-11-05-M37-抗战路线精修第八批-design.md`
- `docs/releases/2026-11-05-v0.37.0-m37.md`
- `docs/conversations/2026-11-05-M37启动与抗战路线精修第八批.md`

---

## [v0.36.0-m36] - 2026-11-05

### Added
- 构建期 `dataVersion`（`index.json` 与 `search-index.json`）。
- 共享 `isDataVersionNewer` 与单测。
- Web `DataUpdatePrompt` 与移动端首页更新横幅。
- 发布说明 `docs/releases/2026-11-05-v0.36.0-m36.md`。

### Changed
- 四包版本统一为 `0.36.0`；Android `versionCode` 升为 33；iOS build 33。
- 完整开发计划中的「多专题数据版本与更新提示」标记为完成。

### Docs
- `docs/plans/2026-11-05-M36-数据版本与更新提示-plan.md`
- `docs/plans/2026-11-05-M36-数据版本与更新提示-design.md`
- `docs/releases/2026-11-05-v0.36.0-m36.md`
- `docs/conversations/2026-11-05-M36启动与数据版本更新提示.md`

---

## [v0.35.0-m35] - 2026-11-05

### Added
- 事件别名 `AtlasEvent.aliases`，6 个事件补充别名并进入搜索索引。
- 路线分段类型 `RouteSegmentType` / `segmentType`。
- ADR-0009 与 `docs/schema/atlas-schema-v1.1.0.md`。
- 发布说明 `docs/releases/2026-11-05-v0.35.0-m35.md`。

### Changed
- 4 个 manifest 与 `data/atlases/index.json` 的 `schemaVersion` 升为 `1.1.0`。
- 搜索索引包含别名，体积 229.0 KB。
- 四包版本统一为 `0.35.0`；Android `versionCode` 升为 32；iOS build 32。

### Docs
- `docs/decisions/ADR-0009-Schema-v1.1演进.md`
- `docs/schema/atlas-schema-v1.1.0.md`
- `docs/plans/2026-11-05-M35-Schema演进评估-plan.md`
- `docs/plans/2026-11-05-M35-Schema演进评估-design.md`
- `docs/releases/2026-11-05-v0.35.0-m35.md`
- `docs/conversations/2026-11-05-M35启动与Schema演进.md`

---

## [v0.34.0-m34] - 2026-11-05

### Added
- `SearchEvent` 摘要类型，搜索索引不再保存完整事件对象。
- 搜索索引瘦身测试与发布说明 `docs/releases/2026-11-05-v0.34.0-m34.md`。

### Changed
- 搜索索引体积 323.7 KB → 228.6 KB（-29.4%）。
- `SearchEntry.event` / `SearchHit.event` 改为 `SearchEvent`。
- `eventStart`、`eventEnd`、`collectCategories` 接受更窄类型。
- 四包版本统一为 `0.34.0`；Android `versionCode` 升为 31；iOS build 31。

### Docs
- `docs/plans/2026-11-05-M34-搜索索引瘦身-plan.md`
- `docs/plans/2026-11-05-M34-搜索索引瘦身-design.md`
- `docs/releases/2026-11-05-v0.34.0-m34.md`
- `docs/conversations/2026-11-05-M34启动与搜索索引瘦身.md`

---

## [v0.33.0-m33] - 2026-11-05

### Added
- Web 错误记录模块 `apps/web/src/lib/observability.ts`。
- Web ErrorBoundary 与中英文兜底页。
- 全局 `error` / `unhandledrejection` 监听。
- 发布说明 `docs/releases/2026-11-05-v0.33.0-m33.md`。

### Changed
- 四包版本统一为 `0.33.0`；Android `versionCode` 升为 30；iOS build 30。
- 完整开发计划中的「Web 错误边界与基础可观测性」标记为完成。

### Docs
- `docs/plans/2026-11-05-M33-Web错误边界与可观测性-plan.md`
- `docs/plans/2026-11-05-M33-Web错误边界与可观测性-design.md`
- `docs/releases/2026-11-05-v0.33.0-m33.md`
- `docs/conversations/2026-11-05-M33启动与Web错误边界.md`

---

## [v0.32.0-m32] - 2026-11-05

### Added
- 发布说明 `docs/releases/2026-11-05-v0.32.0-m32.md`。

### Changed
- 发布检查清单同步到 0.32.0 / 4 专题 / 114 事件 / 118 路线段。
- 中文与英文商店元数据同步到 0.32.0、4 个专题。
- README 里程碑表补齐 M1–M32。
- 完整开发计划更新为 32 / 32，并勾选「文档与发布」三项待办。
- 四包版本统一为 `0.32.0`；Android `versionCode` 升为 29；iOS build 29。

### Docs
- `docs/plans/2026-11-05-M32-发布文档与进度同步-plan.md`
- `docs/plans/2026-11-05-M32-发布文档与进度同步-design.md`
- `docs/releases/2026-11-05-v0.32.0-m32.md`
- `docs/conversations/2026-11-05-M32启动与发布文档同步.md`

---

## [v0.31.0-m31] - 2026-11-05

### Added
- 共享事件-路线 QA 模块 `packages/shared/src/qa/routes.ts`。
- `pnpm check:routes` 命令，支持 `--atlas`、`--threshold`、`--json`。
- 路线 QA 单测 `route-qa.test.ts`。
- 发布说明 `docs/releases/2026-11-05-v0.31.0-m31.md`。

### Changed
- 四包版本统一为 `0.31.0`；Android `versionCode` 升为 28；iOS build 28。
- 完整开发计划中的「数据 QA 脚本产品化」标记为完成。

### Docs
- `docs/plans/2026-11-05-M31-数据QA脚本产品化-plan.md`
- `docs/plans/2026-11-05-M31-数据QA脚本产品化-design.md`
- `docs/releases/2026-11-05-v0.31.0-m31.md`
- `docs/conversations/2026-11-05-M31启动与数据QA脚本产品化.md`

---

## [v0.30.0-m30] - 2026-11-05

### Added
- 抗日战争专题新增忻口会战事件 `xinkou-1937-10` 与中日双方路线。
- 抗日战争专题新增上高会战事件 `shanggao-1941-03` 与中日双方路线。
- 抗日战争专题新增湘西会战事件 `xiangxi-1945-04` 与中日双方路线。
- 发布说明 `docs/releases/2026-11-05-v0.30.0-m30.md`。

### Changed
- 抗日战争专题事件数 37 → 40，路线段 40 → 46。
- 全项目事件数 111 → 114，路线段 112 → 118。
- 搜索索引重新生成：4 专题 / 114 事件 / 323.7 KB。
- 专题描述补充忻口、上高、湘西三次战役。
- 四包版本统一为 `0.30.0`；Android `versionCode` 升为 27；iOS build 27。

### Docs
- `docs/plans/2026-11-05-M30-抗战路线精修第七批-plan.md`
- `docs/plans/2026-11-05-M30-抗战路线精修第七批-design.md`
- `docs/releases/2026-11-05-v0.30.0-m30.md`
- `docs/conversations/2026-11-05-M30启动与抗战路线精修第七批.md`

---

## [v0.29.0-m29] - 2026-11-05

### Added
- 抗日战争专题新增枣宜会战事件 `zaoyi-1940-05` 与中日双方路线。
- 抗日战争专题新增中条山战役事件 `zhongtiaoshan-1941-05` 与中日双方路线。
- 抗日战争专题新增鄂西会战事件 `exi-1943-05` 与中日双方路线。
- 发布说明 `docs/releases/2026-11-05-v0.29.0-m29.md`。

### Changed
- 抗日战争专题事件数 34 → 37，路线段 34 → 40。
- 全项目事件数 108 → 111，路线段 106 → 112。
- 搜索索引重新生成：4 专题 / 111 事件 / 309.1 KB。
- 两条路线 `order` 按开始日期重排，修正长沙会战插入造成的顺序错位。
- 专题描述补充枣宜、中条山、鄂西三次战役。
- 四包版本统一为 `0.29.0`；Android `versionCode` 升为 26；iOS build 26。

### Docs
- `docs/plans/2026-11-05-M29-抗战路线精修第六批-plan.md`
- `docs/plans/2026-11-05-M29-抗战路线精修第六批-design.md`
- `docs/releases/2026-11-05-v0.29.0-m29.md`
- `docs/conversations/2026-11-05-M29启动与抗战路线精修第六批.md`

---

## [v0.28.0-m28] - 2026-11-05

### Added
- 抗日战争专题新增常德会战事件 `changde-1943-11` 与中日双方路线。
- 抗日战争专题新增衡阳保卫战事件 `hengyang-1944-06` 与中国守军城防路线。
- 发布说明 `docs/releases/2026-11-05-v0.28.0-m28.md`。

### Changed
- 抗日战争专题事件数 32 → 34，路线段 31 → 34。
- 全项目事件数 106 → 108，路线段 103 → 106。
- 搜索索引重新生成：4 专题 / 108 事件 / 294.7 KB。
- 专题描述补充常德、衡阳两次战役。
- 四包版本统一为 `0.28.0`；Android `versionCode` 升为 25；iOS build 25。

### Docs
- `docs/plans/2026-11-05-M28-抗战路线精修第五批-plan.md`
- `docs/plans/2026-11-05-M28-抗战路线精修第五批-design.md`
- `docs/releases/2026-11-05-v0.28.0-m28.md`
- `docs/conversations/2026-11-05-M28启动与抗战路线精修第五批.md`

---

## [v0.27.0-m27] - 2026-11-05

### Added
- 抗日战争专题新增第二次长沙会战事件 `changsha-1941-09` 与中日双方路线。
- 抗日战争专题新增第三次长沙会战事件 `changsha-1941-12` 与中日双方路线。
- 发布说明 `docs/releases/2026-11-05-v0.27.0-m27.md`。

### Changed
- 抗日战争专题事件数 30 → 32，路线段 27 → 31。
- 全项目事件数 104 → 106，路线段 99 → 103。
- 搜索索引重新生成：4 专题 / 106 事件 / 285.3 KB。
- 专题描述补充第一、二、三次长沙会战。
- 四包版本统一为 `0.27.0`；Android `versionCode` 升为 24；iOS build 24。

### Docs
- `docs/plans/2026-11-05-M27-抗战路线精修第四批-plan.md`
- `docs/plans/2026-11-05-M27-抗战路线精修第四批-design.md`
- `docs/releases/2026-11-05-v0.27.0-m27.md`
- `docs/conversations/2026-11-05-M27启动与抗战路线精修第四批.md`

---

## [v0.26.0-m26] - 2026-11-05

### Added
- 抗日战争专题新增平型关战斗路线段。
- 抗日战争专题新增第一次长沙会战事件 `changsha-1939-09` 与中日双方路线。
- 南京—台儿庄、台儿庄—武汉段增加临沂、商丘节点。
- 发布说明 `docs/releases/2026-11-05-v0.26.0-m26.md`。

### Changed
- 抗日战争专题事件数 29 → 30，路线段 24 → 27。
- 全项目事件数 103 → 104，路线段 96 → 99。
- 搜索索引重新生成：4 专题 / 104 事件 / 274.9 KB。
- 专题描述补充平型关、徐州、长沙三条精修战役。
- 四包版本统一为 `0.26.0`；Android `versionCode` 升为 23；iOS build 23。

### Docs
- `docs/plans/2026-11-05-M26-抗战路线精修第三批-plan.md`
- `docs/plans/2026-11-05-M26-抗战路线精修第三批-design.md`
- `docs/releases/2026-11-05-v0.26.0-m26.md`
- `docs/conversations/2026-11-05-M26启动与抗战路线精修第三批.md`

---

## [v0.25.0-m25] - 2026-11-05

### Added
- 构建期搜索索引 `data/atlases/search-index.json`（4 专题 / 103 事件 / 270.2 KB）。
- `build:search-index` 脚本与 Vercel 构建集成。
- 共享 `loadSearchIndex` 与 `SearchIndexFile` 类型。

### Changed
- Web / 移动端搜索页只请求索引文件，不再加载全部专题数据。
- `SearchEntry.atlasTitle` 改为多语言对象，英文界面显示英文专题名。
- 搜索拼音在构建期写入，运行时不再加载 pinyin-pro。
- 四包版本统一为 `0.25.0`；Android `versionCode` 升为 22；iOS build 22。

### Fixed
- 修复搜索页随专题增多而线性加载全部数据的问题。

### Docs
- `docs/plans/2026-11-05-M25-构建期搜索索引-plan.md`
- `docs/plans/2026-11-05-M25-构建期搜索索引-design.md`
- `docs/releases/2026-11-05-v0.25.0-m25.md`
- `docs/conversations/2026-11-05-M25启动与构建期搜索索引.md`

---

## [v0.24.0-m24] - 2026-11-05

### Added
- 抗战第二批战役路线精修：南京保卫战、百团大战、豫湘桂战役。
- 抗战路线段数 22 → 24。
- 精修段描述继续区分「战役路线」与「示意简化」。

### Changed
- 四包版本统一为 `0.24.0`；Android `versionCode` 升为 21；iOS build 21。

### Docs
- `docs/plans/2026-11-05-M24-抗战路线精修第二批-plan.md`
- `docs/plans/2026-11-05-M24-抗战路线精修第二批-design.md`
- `docs/releases/2026-11-05-v0.24.0-m24.md`
- `docs/conversations/2026-11-05-M24启动与抗战路线精修第二批.md`

---

## [v0.23.0-m23] - 2026-11-05

### Added
- 抗战四条战役路线精修：淞沪会战、台儿庄战役、武汉会战、远征军/缅北反攻。
- 抗战路线段数 21 → 22，补充中间节点。
- 路线描述区分「战役路线」与「示意简化」两种精度层级。

### Changed
- 四包版本统一为 `0.23.0`；Android `versionCode` 升为 20；iOS build 20。

### Fixed
- 修复抗战重点战役只有城市级连线、缺少战役节点的问题。

### Docs
- `docs/plans/2026-11-05-M23-抗战路线精修-plan.md`
- `docs/plans/2026-11-05-M23-抗战路线精修-design.md`
- `docs/releases/2026-11-05-v0.23.0-m23.md`
- `docs/conversations/2026-11-05-M23启动与抗战路线精修.md`

---

## [v0.22.0-m22] - 2026-11-05

### Added
- `pnpm check:versions` 三端版本一致性检查脚本。

### Changed
- iOS `CFBundleShortVersionString` 对齐 0.22.0，build 19，最低系统 16.4。
- Android 主 manifest 关闭明文流量、移除悬浮窗权限；debug manifest 保留调试配置。
- `app.config.ts` 同步 `usesCleartextTraffic: false` 与 `blockedPermissions`。
- 四包版本统一为 `0.22.0`；Android `versionCode` 升为 19。

### Fixed
- 修复 iOS 版本仍为 0.5.0、与源码不一致的问题。
- 修复 Android 生产 manifest 允许明文流量与保留悬浮窗权限的问题。

### Docs
- `docs/plans/2026-11-05-M22-发布阻塞项内部修复-plan.md`
- `docs/plans/2026-11-05-M22-发布阻塞项内部修复-design.md`
- `docs/releases/2026-11-05-v0.22.0-m22.md`
- `docs/conversations/2026-11-05-M22启动与发布阻塞项修复.md`

---

## [v0.21.0-m21] - 2026-11-05

### Added
- 第四专题「抗日战争」上线：29 事件 / 21 路线段 / 3 实体。
- 抗战封面 JPEG、索引条目、标签英文映射。
- 事件-路线抽查 0 个 >30km。

### Changed
- 四包版本统一为 `0.21.0`；Android `versionCode` 升为 18。
- 首页专题数更新为 4。

### Fixed
- 修复抗战草稿 13 个实体级路线-事件偏差/缺失。

### Docs
- `docs/plans/2026-11-05-M21-抗日战争专题校正与上线-plan.md`
- `docs/plans/2026-11-05-M21-抗日战争专题校正与上线-design.md`
- `docs/releases/2026-11-05-v0.21.0-m21.md`
- `docs/conversations/2026-11-05-M21启动与抗日战争专题上线.md`

---

## [v0.20.0-m20] - 2026-11-05

### Added
- M21：搜索拼音 chunk 懒加载，`loadPinyinProvider()` 动态加载 `pinyin-pro`。
- M20：`store-metadata-en.md` 英文商店元数据与 `release-checklist.md` 发布检查清单。
- M22：`anti-japanese-war` 数据草稿（29 事件 / 9 路线段，未索引）。
- 抗战数据 QA 报告与草稿说明。

### Changed
- `buildSearchIndex` 支持可选拼音 provider；未提供时不生成拼音字段。
- 四包版本统一为 `0.20.0`；Android `versionCode` 升为 17。
- 移除 Vite pinyin `manualChunks` 配置。

### Fixed
- 拼音 chunk 不再进入首屏加载路径。

### Docs
- `docs/plans/2026-11-05-并行开发与无人值守-plan.md`
- `docs/releases/store-metadata-en.md`
- `docs/releases/release-checklist.md`
- `docs/releases/2026-11-05-抗日战争数据草稿QA.md`
- `docs/releases/2026-11-05-v0.20.0-m20.md`

---

## [v0.19.0-m19] - 2026-11-05

### Added
- Web 搜索页事件类型筛选、时间段筛选与重置。
- 移动端搜索页事件类型筛选、时间段筛选与重置。
- 搜索筛选相关中英文案。

### Changed
- 四包版本统一为 `0.19.0`；Android `versionCode` 升为 16。

### Docs
- `docs/plans/2026-11-05-M19-搜索筛选增强-plan.md`
- `docs/plans/2026-11-05-M19-搜索筛选增强-design.md`
- `docs/releases/2026-11-05-v0.19.0-m19.md`
- `docs/conversations/2026-11-05-M19启动与搜索筛选增强方案.md`

---

## [v0.18.0-m18] - 2026-11-05

### Added
- 第三专题「丝绸之路：玄奘西行」：1 实体 / 19 段路线 / 20 事件 / 封面。
- 玄奘专题中英双语事件与专题字段。
- 标签「丝绸之路」「佛教」英文映射。
- 专题索引更新为 3 个专题。

### Changed
- 四包版本统一为 `0.18.0`；Android `versionCode` 升为 15。
- 专题卡片年份显示去掉前导零（0629 → 629）。

### Docs
- `docs/plans/2026-11-05-M18-第三专题玄奘西行-plan.md`
- `docs/plans/2026-11-05-M18-第三专题玄奘西行-design.md`
- `docs/releases/2026-11-05-v0.18.0-m18.md`
- `docs/conversations/2026-11-05-M18启动与第三专题玄奘西行方案.md`

---

## [v0.17.0-m17] - 2026-11-05

### Added
- 共享 `neighborEvents` 事件前后邻居计算与单测。
- Web 详情「上一事件 / 下一事件」与 Alt+← / Alt+→ 快捷键。
- 移动端详情上一/下一事件导航。
- 导航按当前筛选与图层集合计算，首尾禁用。

### Changed
- 四包版本统一为 `0.17.0`；Android `versionCode` 升为 14。

### Docs
- `docs/plans/2026-11-05-M17-事件前后导航-plan.md`
- `docs/plans/2026-11-05-M17-事件前后导航-design.md`
- `docs/releases/2026-11-05-v0.17.0-m17.md`
- `docs/conversations/2026-11-05-M17启动与事件前后导航方案.md`

---

## [v0.16.0-m16] - 2026-11-05

### Added
- Web Skip Link「跳到主要内容」与各页面主内容 landmark。
- 事件详情打开时焦点进入、关闭后恢复。
- 时间轴当前事件 `aria-live="polite"` 与事件点 `aria-current`。
- 移动端专题卡片/时间轴事件点可访问标签。
- PWA 更新提示 `role="status"`。

### Changed
- 四包版本统一为 `0.16.0`；Android `versionCode` 升为 13。

### Docs
- `docs/plans/2026-11-05-M16-无障碍键盘体验-plan.md`
- `docs/plans/2026-11-05-M16-无障碍键盘体验-design.md`
- `docs/releases/2026-11-05-v0.16.0-m16.md`
- `docs/conversations/2026-11-05-M16启动与无障碍键盘体验方案.md`

---

## [v0.15.0-m15] - 2026-11-05

### Added
- PWA 新版本提示与手动刷新（`registerType: 'prompt'`）。
- `/about` 关于页：版本、数据契约、地图服务、缓存管理、仓库链接。
- Web 缓存占用/条目显示与清除入口。
- 关于/更新/缓存相关中英文案。

### Changed
- 四包版本统一为 `0.15.0`；Android `versionCode` 升为 12。
- 新增依赖 `workbox-window`。
- `vercel.json` 增加 `/about` rewrite。

### Fixed
- 修复 PWA 新版本静默接管、用户无法选择刷新时机的问题。

### Docs
- `docs/plans/2026-11-05-M15-更新提示与关于页-plan.md`
- `docs/plans/2026-11-05-M15-更新提示与关于页-design.md`
- `docs/releases/2026-11-05-v0.15.0-m15.md`
- `docs/conversations/2026-11-05-M15启动与更新提示关于页方案.md`

---

## [v0.14.0-m14] - 2026-11-04

### Added
- 长征 5 个多日事件补充 `endDate`（湘江战役、猴场会议、遵义会议、娄山关战斗、直罗镇战役）。
- Web / 移动端时间轴持续时间条。
- 当前事件区间高亮。

### Changed
- 四包版本统一为 `0.14.0`；Android `versionCode` 升为 11。

### Docs
- `docs/plans/2026-11-04-M14-事件持续时间-plan.md`
- `docs/plans/2026-11-04-M14-事件持续时间-design.md`
- `docs/releases/2026-11-04-v0.14.0-m14.md`
- `docs/conversations/2026-11-04-M14启动与事件持续时间方案.md`

---

## [v0.13.0-m13] - 2026-11-04

### Added
- 共享 `timelineEventMarkers` 事件标记计算与单测。
- Web 时间轴事件点：当前事件高亮、点击跳转并打开详情。
- 移动端时间轴事件点：点击跳转并打开详情。
- 事件点随图层/筛选/缩放联动。

### Changed
- 四包版本统一为 `0.13.0`；Android `versionCode` 升为 10。

### Docs
- `docs/plans/2026-11-04-M13-时间轴事件标记-plan.md`
- `docs/plans/2026-11-04-M13-时间轴事件标记-design.md`
- `docs/releases/2026-11-04-v0.13.0-m13.md`
- `docs/conversations/2026-11-04-M13启动与时间轴事件标记方案.md`

---

## [v0.12.0-m12] - 2026-11-04

### Added
- 分享链接保存语言（`lang`）、图层（`entities`）、类型（`categories`）与时间段（`from`/`to`）。
- Web 打开分享链接后恢复语言、图层、筛选与时间点。
- 移动端深链复用 `decodeShareState` 并恢复分享状态。
- 两端 store 新增 `setActiveEntities`。

### Changed
- 四包版本统一为 `0.12.0`；Android `versionCode` 升为 9。
- 旧分享链接保持兼容。

### Fixed
- 修复分享链接打开后语言、图层与筛选丢失的问题。

### Docs
- `docs/plans/2026-11-04-M12-分享链接增强-plan.md`
- `docs/plans/2026-11-04-M12-分享链接增强-design.md`
- `docs/releases/2026-11-04-v0.12.0-m12.md`
- `docs/conversations/2026-11-04-M12启动与分享链接增强方案.md`

---

## [v0.11.0-m11] - 2026-11-04

### Added
- 移动端语言持久化：AsyncStorage `atlas-locale` + 启动 `hydrateLocale()`。
- 缓存命中检测与「离线缓存」徽标（首页、专题页）。
- 首页「清除离线缓存」入口与确认弹窗。
- 缓存/离线相关中英文案。

### Changed
- 四包版本统一为 `0.11.0`；Android `versionCode` 升为 8。

### Fixed
- 修复移动端重启后语言恢复默认中文的问题。
- 修复清除缓存可能误删语言设置的风险（仅删除 `atlas-cache:v1:`）。

### Docs
- `docs/plans/2026-11-04-M11-移动端体验收尾-plan.md`
- `docs/plans/2026-11-04-M11-移动端体验收尾-design.md`
- `docs/releases/2026-11-04-v0.11.0-m11.md`
- `docs/conversations/2026-11-04-M11启动与移动端体验收尾方案.md`

---

## [v0.10.0-m10] - 2026-11-04

### Added
- 郑和专题航线补齐去程/返程，共 20 段。
- 郑和航线名称与描述英文。
- `extensions.routeEvent = false` 支持标记非路线事件。

### Changed
- 郑和 26 个事件与航线时间对齐；出发事件 2—12km，其余路线事件 0km。
- 分䑸访问榜葛剌事件只绑定 `detached-squadron`。
- 四包版本统一为 `0.10.0`；Android `versionCode` 升为 7。

### Fixed
- 修复郑和返航事件偏离航线 9342km、港口事件偏离 721—1428km 的问题。

### Docs
- `docs/plans/2026-11-04-M10-郑和航线时间校正-plan.md`
- `docs/plans/2026-11-04-M10-郑和航线时间校正-design.md`
- `docs/releases/2026-11-04-v0.10.0-m10.md`
- `docs/conversations/2026-11-04-M10启动与郑和航线校正方案.md`

---

## [v0.9.0-m9] - 2026-11-04

### Added
- 中文全拼检索（`zunyi` / `zun yi`）。
- 事件名首字母检索（`zy` → 遵义会议），按前缀匹配降低噪音。
- 中英文混合查询。
- `pinyin-pro` 依赖与独立构建 chunk。

### Changed
- 搜索提示与占位符更新为支持拼音/首字母。
- 拼音匹配片段回退原文，不高亮拼音。
- 四包版本统一为 `0.9.0`；Android `versionCode` 升为 6。

### Docs
- `docs/plans/2026-11-04-M9-检索增强-plan.md`
- `docs/plans/2026-11-04-M9-检索增强-design.md`
- `docs/releases/2026-11-04-v0.9.0-m9.md`
- `docs/conversations/2026-11-04-M9启动与检索增强方案.md`

---

## [v0.8.0-m8] - 2026-11-04

### Added
- Web PWA 离线支持：应用壳预缓存、专题数据/封面/地图瓦片运行时缓存。
- Web 离线提示 `OfflineBanner` 与 `useOnlineStatus`。
- PWA manifest 与 192/512/1024 图标。
- 移动端 `CachedHttpDataSource`：AsyncStorage 缓存专题数据，断网回退。
- `@react-native-async-storage/async-storage@2.2.0` 依赖。

### Changed
- 四包版本统一为 `0.8.0`；Android `versionCode` 升为 5。
- `vercel.json` 为 `sw.js` / `manifest.webmanifest` 增加 no-cache 头。

### Fixed
- 弱网/断网时专题数据与详情不可用的问题。

### Docs
- `docs/plans/2026-11-04-M8-离线与弱网体验-plan.md`
- `docs/plans/2026-11-04-M8-离线与弱网体验-design.md`
- `docs/releases/2026-11-04-v0.8.0-m8.md`
- `docs/conversations/2026-11-04-M8启动与离线弱网方案.md`

---

## [v0.7.0-m7] - 2026-11-04

### Added
- Web / 移动端中英文切换，Web 语言持久化到 `localStorage`。
- 共享 i18n 模块：`locale`、`messages`、`categories`、`tags`。
- 54 个事件的英文名称、摘要、描述与地点。
- 郑和专题英文标题、副标题、描述与实体名称/描述。
- 英文日期格式、英文分类名、英文专题标签。
- 英文检索：分类字段同时索引中英文。

### Changed
- 四包版本统一为 `0.7.0`；Android `versionCode` 升为 4。
- 专题索引 `index.json` 同步英文标题与副标题。

### Fixed
- 修复专题卡片只读取中文标题、英文切换后仍显示中文的问题。

### Docs
- `docs/plans/2026-11-04-M7-中英双语-plan.md`
- `docs/plans/2026-11-04-M7-中英双语-design.md`
- `docs/releases/2026-11-04-v0.7.0-m7.md`
- `docs/conversations/2026-11-04-M7启动与中英双语方案.md`

---

## [v0.6.0-m6] - 2026-11-04

### Added
- 共享事件聚合算法 `clusterEvents(events, zoom)`，Web / 移动端复用。
- Web 地图 Marker 聚合：聚合点显示数量，点击放大。
- 移动端地图 Marker 聚合：复用共享算法，点击放大。
- Web / 移动端时间轴 0—8 级缩放，刻度与拖动自适应。
- 共享时间轴视口工具 `createViewport` / `centerViewportStart` / `timelineSpan`。
- 聚合与视口单测（`cluster.test.ts`、`viewport.test.ts`）。

### Changed
- 四包版本统一为 `0.6.0`；Android `versionCode` 升为 3。
- 时间轴缩放后，起止日期显示当前视口范围。

### Docs
- `docs/plans/2026-11-04-M6-地图聚合与时间轴缩放-plan.md`
- `docs/plans/2026-11-04-M6-地图聚合与时间轴缩放-design.md`
- `docs/releases/2026-11-04-v0.6.0-m6.md`
- `docs/conversations/2026-11-04-M6启动与地图聚合缩放方案.md`

---

## [v0.5.0-m5] - 2026-11-04

### Added
- 第二专题「郑和下西洋」：3 实体 / 8 段航线 / 26 事件 / 封面。
- 多专题首页与跨专题搜索验证。
- Web `/privacy` 隐私政策页与页脚入口。
- 应用图标、Android 自适应图标、启动图、favicon。
- `vercel.json`、`wrangler.toml`、部署指南与商店元数据草稿。
- 移动端 0.5.0 / versionCode 2，Android APK 重建。
- Vercel 临时预览部署（两专题、隐私页、深链），随后认领并部署 production。
- Vercel SPA rewrites（/search、/privacy、/atlas/*）。
- 商店截图（Web 移动端占位，iOS/Android 各 4 张）与 Feature Graphic。
- 全项目收尾审计报告（M1–M5），四包版本统一为 0.5.0。

### Changed
- 首页页脚更新为 M5 示例数据。
- 移动端隐私同意页支持 `EXPO_PUBLIC_PRIVACY_URL`。

### Fixed
- 修正长征「懋功会师」路线时间：中央红军第 6 段改为 6/19 出发；红四方面军拆为「通江—懋功（6/18 到达）」与「懋功—会宁」两段。
- 逐条抽查长征 28 个事件与路线到达时间：中央红军拆为 26 段，瑞金—湘江拆为「瑞金—于都」「于都—宜章」「宜章—湘江」，四渡赤水坐标改至太平渡；起点当天路线不再消失。
- 长征 33 段路线补充中间途经节点（会昌、信丰、汝城、道县、剑河、桐梓、二郎滩、皎平渡、泸沽、达维、两河口、卓克基、班佑、六盘山、平凉等），路线走向更贴近实际。
- 长征 28 个事件补充针对性史料来源（年谱、史料丛书、文献集），遵义会议另加《遵义会议文献》。

### Docs
- `docs/plans/2026-11-04-M5-第二专题与上架部署-plan.md`
- `docs/plans/2026-11-04-M5-第二专题与上架部署-design.md`
- `docs/decisions/ADR-0008-静态部署与资源托管方案.md`
- `docs/guides/deployment.md`
- `docs/releases/store-metadata.md`
- `docs/releases/2026-11-04-v0.5.0-m5.md`

---

## [v0.4.0-m4] - 2026-11-04

### Added
- 移动端 React Navigation（Gallery / Atlas / Search）与高德地图 `expo-gaode-map`。
- 移动端时间轴：拖动、播放/暂停、倍速、日期输入、刻度自适应。
- 移动端详情底部抽屉：Markdown、图片、来源、关联事件、系统分享。
- 移动端搜索与筛选（实体、类型、时间段）。
- 隐私同意页；Android 屏蔽定位权限。
- 深链 `atlas://` 与 `Share.share`。
- Android release APK（release keystore 签名）、`configure-android-release.mjs` 构建脚本。
- 封面 JPEG（RN 不支持 SVG）。

### Changed
- shared 中文日期改为手动格式化，兼容 Hermes 缺少 locale 数据。
- Android release 使用全屏 Modal 展示详情/筛选。
- Android 开发数据允许 cleartext（`expo-build-properties`）。

### Fixed
- 修复 Metro 在 pnpm monorepo 下无法解析 `invariant` 的问题（移除 `disableHierarchicalLookup`）。
- 修复 R8 缺少 AMap 可选类导致的 release 构建失败（ProGuard `-dontwarn`）。

### Known Issues
- iOS 因 AMap SDK 无 arm64 模拟器切片，当前 arm64 Mac 模拟器无法运行；需真机 + Apple 账号出 IPA。
- Android 详情抽屉在 TV 模拟器上宽度异常，待手机真机复验。

### Docs
- `docs/plans/2026-11-03-M4-移动端打包与三端一致性-plan.md`
- `docs/plans/2026-11-03-M4-移动端打包与三端一致性-design.md`
- `docs/decisions/ADR-0007-移动端架构与构建发布方案.md`
- `docs/conversations/2026-11-03-M4启动与移动端打包方案.md`
- `docs/releases/2026-11-04-v0.4.0-m4.md`

---

## [v0.3.0-m3] - 2026-11-03

### Added
- shared 检索：`buildSearchIndex` / `searchEvents`（中英文、字段评分、片段、过滤）。
- shared 筛选：`applyEventFilters` / `collectCategories`。
- shared 分享：`encodeShareState` / `decodeShareState` / `buildShareUrl`。
- 事件详情 Markdown 渲染（`react-markdown` + `remark-gfm` + `rehype-sanitize`），按需加载。
- 详情图片、图注、来源、关联事件与分享按钮。
- `/search` 全局搜索页：专题筛选、关键词高亮、空状态、错误重试。
- 专题侧栏筛选：类型多选、时间段、命中数量、重置；移动端筛选浮层。
- 分享链接与深链恢复（时间、事件、地图视野）。
- 新增 18 个检索/筛选/分享单测（shared 共 57 个）。

### Changed
- 深链带 `view` 时视野优先于事件定位。
- Web Share 1.5 秒超时后降级复制；剪贴板失败用 `execCommand` 兜底。
- Markdown 组件 React.lazy 拆包，主包体积保持可控。

### Fixed
- 修复深链设置事件时间被 StrictMode 二次加载覆盖的问题。
- 修复深链选中事件在 map ready 前设置导致地图不居中的问题。
- 修复分享链接缺少地图视野参数的问题。

### Docs
- `docs/plans/2026-11-03-M3-检索筛选与分享-plan.md`
- `docs/plans/2026-11-03-M3-检索筛选与分享-design.md`
- `docs/decisions/ADR-0006-检索与分享状态方案.md`
- `docs/conversations/2026-11-03-M3启动与检索分享方案.md`
- `docs/releases/2026-11-03-v0.3.0-m3.md`

---

## [v0.2.0-m2] - 2026-11-03

### Added
- `packages/shared/src/timeline`：时间轴核心、年/月/日自适应刻度、路线累计长度与截断插值、事件显隐/当前事件、播放推进。
- 时间轴单测 23 个（shared 共 39 个）。
- Web 底部时间轴：拖动、点击轨道跳转、日期输入、播放/暂停、0.5/1/2/4x、主次刻度。
- 键盘无障碍：方向键 ±1 天、Shift ±7 天、PageUp/PageDown ±30 天、Home/End、空格。
- 地图联动：路线 `Polyline.setPath` 生长、Marker 按时间显隐、当前事件脉冲高亮。
- 播放事件气泡（固定 UI，4 秒自动消失，可查看详情/关闭）。
- 移动端 390px 时间轴与气泡适配。

### Changed
- 播放时间保留亚日精度，UI 仍按日显示；修复每帧 snap 到日边界导致播放不前进。
- 刻度选择增加单位权重，避免 90 天步长的日刻度压过月刻度。

### Fixed
- 修复播放到终点后无法自动停止的问题。
- 修复事件气泡被地图视口裁切的问题（由 `InfoWindow` 改为固定气泡）。

### Docs
- `docs/plans/2026-11-03-M2-通用时间轴-plan.md`
- `docs/plans/2026-11-03-M2-通用时间轴-design.md`
- `docs/decisions/ADR-0005-时间轴与路线动画方案.md`
- `docs/conversations/2026-11-03-M2启动与时间轴方案.md`
- `docs/releases/2026-11-03-v0.2.0-m2.md`

---

## [v0.1.0-m1] - 2026-11-03

### Added
- 项目启动：建立 `/docs` 留档体系（conversations / plans / decisions / changelog / releases / schema / guides）与文档模板。
- 建立根 `README.md`：双仓库地址、双推配置、技术栈、数据契约速览、快速开始、里程碑状态。
- 建立数据契约 `atlas-schema v1.0.0` 文档。
- 产出 M1 plan 与 design 文档、ADR-0001/0002/0003。
- 初始化 git 仓库并完成 GitHub / Gitee 首次双推（`4c73ba6`），统一开发分支为 `main`。
- 底图改用高德地图：新增 ADR-0004、`docs/guides/amap-setup.md`，更新 M1 plan/design 与 README（GCJ-02 坐标转换、分平台 Key）。
- 补充 iOS 高德 Key、Web 端 (JS API) Key 申请说明（`atlas-ios` / `atlas-web`、Bundle ID、域名白名单、安全密钥）。
- 三端 Key 交付并写入本地 `.env.local`（不入库），M1 实施启动。
- pnpm workspaces monorepo：`apps/web`、`apps/mobile`、`packages/shared`。
- `@atlas/shared`：类型、zod schema、数据加载器、跨文件校验、时间函数、WGS84 ↔ GCJ-02、多语言解析。
- Web：首页专题卡片墙、高德 JS API 2.0 地图、按实体分色路线、事件 Marker、只读详情面板、图例开关、时间轴占位。
- 移动端空壳：Expo SDK 58 + RN 0.88，包名/Bundle ID 配置，`expo prebuild` 验证通过。
- `pnpm validate:data` 数据校验脚本。

### Changed
- Web 由 React 18 升级到 **React 19.3**，与 Expo SDK 58 统一版本，避免 `@types/react` 双版本冲突。
- 移动端原生目录改为 Expo prebuild 生成并 gitignore（CNG）。
- 地图 fitView 后限制最小缩放 4.5，改善移动端可读性。

### Fixed
- 修复浏览器中 `fetch` 作为实例方法调用导致的 `Illegal invocation`。
- 修复相对 URL 传入 `HttpDataSource` 时的 `Invalid base URL`。
- 修复移动端 Marker 点击被内部元素拦截。
- 修复事件详情选择后地图动画被 fitView 覆盖的问题（改为立即定位）。

### Data
- 新增 `data/atlases/long-march`：6 个实体、9 段路线、28 个事件、封面 SVG，全部带史料来源（示意初稿，待校订）。

### Docs
- `docs/conversations/2026-11-03-项目启动与M1方案.md`
- `docs/conversations/2026-11-03-底图改用高德与AndroidKey申请.md`
- `docs/conversations/2026-11-03-iOSKey申请.md`
- `docs/conversations/2026-11-03-WebKey类型选择说明.md`
- `docs/conversations/2026-11-03-WebJSAPIKey申请.md`
- `docs/conversations/2026-11-03-Key交付与M1启动.md`
- `docs/releases/2026-11-03-v0.1.0-m1.md`

---

## 版本记录格式说明

每个已发布版本使用如下小节：

```md
## [v0.1.0-m1] - YYYY-MM-DD

### Added
- …

### Changed
- …

### Fixed
- …

### Docs
- …

### Data
- …
```
