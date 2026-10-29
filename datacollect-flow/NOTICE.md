# 来源与版本

本技能是 [workflow-visualizer](https://github.com/jimku233/workflow-visualizer)（作者 jimku233，MIT License）的**下游定制版**，按「具身智能数采项目统筹」的岗位场景重写。

## 保留自上游（原样，未改动）

| 路径 | 说明 |
|---|---|
| `scripts/flow.mjs` | 渲染器（1938 行，零第三方依赖，只用 `node:` 内置模块） |
| `scripts/serve.mjs` | 局域网静态服务器，手机同 Wi-Fi 看图 |
| `assets/` | 产物页面的 CSS / JS / shell 模板 |
| `references/spec.md` | 字段与 Mermaid 子集手册 |
| `LICENSE` | MIT 原文 |

## 本版重写的部分

| 路径 | 改动 |
|---|---|
| `SKILL.md` | 整篇按数采语境重写：五要素提取、字段映射、`check` 结果的任务单释义、岗位红线、能力边界 |
| `examples/任务单-餐饮摆台.json` | 新增 |
| `examples/早会执行卡-竖版.json` | 新增 |
| `examples/异常决策树-设备.json` | 新增 |

## 上游版本

- 仓库：https://github.com/jimku233/workflow-visualizer
- 抓取提交：`24e5565b73656deb5fe8f49b90b7c3c8ea6a4fd0`（2026-10-18）
- 生成器版本：v1.2.3
- 抓取日期：2026-10-27

## 怎么跟上游

上游升级时只替换 `scripts/`、`assets/`、`references/spec.md` 三处，`SKILL.md` 与 `examples/` 不动：

```powershell
# 在临时目录浅克隆上游
git clone --depth 1 https://github.com/jimku233/workflow-visualizer.git <临时目录>
# 覆盖三处，再更新本文件的「抓取提交」与版本号
```

覆盖后**务必重跑一遍三个示例**，确认 `check` 仍然通过、产物正常：

```powershell
node scripts\flow.mjs check examples\任务单-餐饮摆台.json
node scripts\flow.mjs render examples\任务单-餐饮摆台.json --all --out out\任务单-餐饮摆台.html
```

上游改了布局或字段语义时，本文件里的字段映射表可能需要跟着调。
