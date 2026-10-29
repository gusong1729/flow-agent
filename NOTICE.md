# 上游归属与许可

本仓库是 [**workflow-visualizer**](https://github.com/jimku233/workflow-visualizer)（作者 **jimku233**，MIT License）的**改版（derivative work）**。

上游做的是「把业务流程渲染成自包含交互式流程图」的独立工具；本仓库把它改造成一个**面向具身智能数据采集项目统筹的桌面应用**，并加了三件上游没有的东西：对话式生成、多供应商模型接入、Windows 桌面外壳。

## 直接来自上游的部分

| 本仓库路径 | 与上游的关系 |
|---|---|
| `datacollect-flow/scripts/flow.mjs` | **原样保留**。上游渲染器主体（约 1938 行，零依赖，自实现布局与 SVG） |
| `datacollect-flow/scripts/serve.mjs` | 原样保留 |
| `datacollect-flow/assets/` | 原样保留（产物页面的 CSS / JS / shell 模板） |
| `datacollect-flow/references/spec.md` | 原样保留（字段与 Mermaid 子集手册） |
| `app/src/renderer/flow-browser.js` | **机械转换生成物**：由 `app/tools/build-renderer.py` 从 `flow.mjs` 去掉 `node:` 依赖、内联资源、砍掉 CLI 入口而来，渲染逻辑一行未改。附带逐字节回归测试 `app/tools/test-renderer.mjs` |

- 抓取上游时的提交：`24e5565b73656deb5fe8f49b90b7c3c8ea6a4fd0`（2026-10-18）
- 上游版本：v1.2.3

## 本仓库新增的部分

| 路径 | 内容 |
|---|---|
| `app/` | Tauri 2 桌面壳 + 原生 ESM 界面（左对话 / 右画布）+ 三协议供应商层 + DPAPI 加密的配置存储 |
| `app/src-tauri/src/main.rs` | 上游没有：模型请求代发（绕 WebView CORS）、配置加解密与落盘 |
| `app/src/providers.js` | 上游没有：OpenAI / Anthropic / Responses 三种协议信封、业务错误与截断识别 |
| `app/src/prompt.js` | 上游没有：让模型产出「规格 JSON」的系统提示 |
| `app/tools/*.mjs` | 上游没有：静态构建、样例生成、渲染器转换、逐字节回归、真实调用验证 |
| `datacollect-flow/SKILL.md` | 重写为数据采集语境（上游是通用业务流程） |
| `datacollect-flow/examples/*.json` | 上游没有：任务单 / 早会执行卡 / 异常决策树三份模板 |
| `docs/` | 上游没有：供应商接入调研、验证记录 |

## 许可

本仓库整体以 **MIT** 分发，见 [`LICENSE`](LICENSE)。上游 MIT 许可的版权声明保留在该文件中。

## 关于界面设计参考

界面的设计约束（反 AI slop 清单、配色与排版纪律）参考了本地安装的 **kz-design** 技能（作者 K叔）。
**该技能的代码与文档不随本仓库分发**，也没有被复制进本仓库；这里只是遵循了它的设计原则。
因此它不在本仓库的许可范围内，也不构成本仓库的版权人。

上游没有要求署名之外的其他义务，但署名是基本礼貌，也是 MIT 的硬性条件——**如果你要基于本仓库再改，请保留本文件与 `LICENSE` 里的两份版权声明**。
