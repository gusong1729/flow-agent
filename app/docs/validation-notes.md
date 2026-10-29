# 验证记录 · 流程图agent 桌面端 v0.1

日期：2026-10-28 起，2026-10-29 补真实调用验证
验证者：AI（headless Chrome 截图 + 渲染器逐字节回归 + cargo build + 真实 exe 窗口截图 + 真实 MiniMax 接口）

## 零之三、真实调用验证（2026-10-29，用真实 M Plan Key）

工具：`tools/verify-live.mjs`（走本仓库自己的 providers/prompt/renderer，key 只从环境变量读）。

### 三条路径都能通

| 端点 | 结果 |
|---|---|
| `POST /v1/chat/completions`（OpenAI 面） | HTTP 200，`base_resp.status_code=0`，`content` 拿到合法 JSON |
| `POST /v1/responses` | HTTP 200，`output[]` 里能找到 `type=message` 与 `output_text` |
| `POST /anthropic/v1/messages` | HTTP 200，`content` 里同时有 `thinking` 与 `text` 块（我们的 `extractText` 只取 `text`，正确） |

### 但生成 20 节点规格会撞上「思考吃光预算」

这是本轮最重要的实测发现：

| 配置 | 耗时 | completion | 其中 reasoning | 结果 |
|---|---|---|---|---|
| chat/completions，max_tokens=8192 | 79s | 8192 | 8192 | `finish_reason=length`，**正文 0 字** |
| chat/completions，max_tokens=32768 | 3min+ | 32768 | 27543 | 正文 12767 字，但 JSON 在第 492 行被切断 |
| chat/completions，`reasoning.effort=low`（短问题） | 秒级 | 56 | 33 | 正常 |
| chat/completions，`reasoning.effort=low`（真实任务） | 70s | 8192 | 8191 | 仍被思考吃光，正文 0 字 |

结论：**MiniMax M3.1-Flash 是重思考模型，`max_tokens` 同时是「思考 + 正文」的总预算**。给它一张 20 节点的任务单，它会先想两万多 token。`reasoning.effort=low` 在短问题上确实生效（33 token），但在长任务上未能压住。

值得记的一点：**我们的 `truncated()` 每一次都正确判成了「被 max_tokens 截断」**，而不是像修复前那样报「模型没有返回 JSON」——这条修复在真实调用里得到了验证。

### 结论：长任务必须走 `/v1/responses` + `reasoning.effort`

对比实测（同一份"20 节点餐饮任务单"提示词）：

| 路径 | 耗时 | output | 其中 reasoning | 正文 | 结果 |
|---|---|---|---|---|---|
| chat/completions, max_tokens=8192 | 80s | 8192 | 8191 | 0 字 | 截断 |
| chat/completions, max_tokens=32768 | 3min+ | 32768 | 27543 | 12767 字 | JSON 切断 |
| **responses, effort=low** | **32s** | 6706 | 2645 | 10610 字 | **可解析** |
| **responses, effort=minimal** | **18s** | 4537 | 958 | 9350 字 | **可解析** |
| **responses, effort=minimal（走本仓库代码）** | **27s** | 6076 | — | 11854 字 | **28 节点 / 35 边 / 4 分组，渲染成功** |

最后一行是 `tools/verify-live.mjs responses` 的输出——整条链路（providers → HTTP → 提取 → 解析 → 渲染）在我们自己的代码上跑通，没有借用任何外部脚本。

所以实现改为：
- 新增第三种协议 `responses`（`/v1/responses`，`input` 单串、`reasoning.effort` 可控、正文在 `output[]` 的 `output_text` 里）；
- MiniMax 预设默认走 `responses` + `effort: minimal`；旧的 chat 面保留但标注「慎用」，因为它会烧光预算；
- `extractText` / `payloadError` / `truncated` 三处按协议分支，`truncated` 认 `status=incomplete` 与 `incomplete_details.reason=max_output_tokens`。

## 零、端到端结论

真 exe 跑通了完整闭环：`flow-agent.exe` → WebView2 → 载入内嵌 dist → 点「填示例」→ 右栏渲染出 20 环节的横版任务单，底部工具栏（竖版/横版、缩放、适配、SVG/PNG、明暗、Mermaid）可用。截图见 `screenshots/04-真实exe内渲染.png`。

> 注意：这一步的「生成任务单」按钮链路**当时未用真实 Key 验证**，只验证了错误分支；2026-10-29 补上了真实调用，见上面「零之三」。

## 零之二、只有跑真 exe 才暴露的三个 bug（全部已修）

这三个在 headless Chrome + dev 服务器里**一个都不会出现**，是"必须端到端"再次被证明的地方：

| # | 现象 | 根因 | 修法 |
|---|---|---|---|
| 1 | exe 里点「填示例」报 `HTTP 404` | Tauri 生产包的前端资源是**编译期嵌进二进制**的，运行时按 URL 路径取子目录文件不可靠（dev 服务器下却正常） | 样例改成构建期生成的 ES 模块 `src/samples.generated.js`，直接编进 JS，彻底不走 fetch |
| 2 | `node tools/sync-samples.mjs` 无任何输出、退出码 `0xC0000409`（STATUS_STACK_BUFFER_OVERRUN） | Node 24.11.1 在 Windows 上对**中文文件名**调 `fs.rmSync(..., {force:true})` 会让进程直接崩掉（无报错） | 改用 `fs.unlinkSync`；`build-static.mjs` 的自写 `rmTree()` 同理，不用 `rmSync` |
| 3 | 画布里的图被挤成一条竖缝（145% 缩放下的 portrait） | srcdoc 的 iframe 在布局稳定前就执行了 `autoVariant()`，那一刻视口接近默认 300×150，判定成 portrait 后不再重算 | `frame.onload` 后点产物页自己的 `[data-variant-btn="landscape"]`，走它的官方 API，不做 CSS 硬覆盖 |

另有一个环境问题：**WebView2 的 user-data 目录会被上一次残留的 `msedgewebview2.exe` 锁住**，再次启动直接 panic（`0x800700AA 请求的资源在使用中`）。这不是代码 bug，但说明调试时不能靠 `timeout` 强杀——必须先 `Stop-Process flow-agent`，必要时结束残留的 WebView2 子进程。生产上若要允许多实例，需要给每个实例独立 data directory。

## 零之四、更正：debug 包会去连 devUrl（2026-10-29 晚）

用户打开我给出的 `target/debug/flow-agent.exe` 时看到 **ERR_CONNECTION_REFUSED 127.0.0.1**。

原因：`cargo build`（不带 `--release`）产出的是 **dev 配置**的包，Tauri 会按 `tauri.conf.json` 的
`devUrl`（`http://127.0.0.1:5183`）去取页面，而不是用内嵌的 `frontendDist`。当时那个开发服务器已经被关掉。

> 说明：触发这个问题的 `devUrl` 字段**已于 2026-10-29 从 tauri.conf.json 删除**，
> 所以现在在该文件里看不到它；上面描述的是当时的复现条件，不是当前状态。

**由此更正一条早先的错误诊断**：之前记录的「exe 内样例 404 = Tauri 资源嵌入不解码中文 URL」**是错的**。
真实原因是应用一直在连我自己起的 `python -m http.server 5183`（根目录是 `app/`），
而 `samples/` 当时在 `public/samples/` 下，那个服务器自然 404。

→ 结论与纪律：

1. **给用户验收必须给 release 包**：`npm run app`（先 build-static，再 `cargo build --release`）。
   release 包用内嵌 `frontendDist`，不需要任何服务器，才是「双击即用」。
2. debug 包只在开发时用，且必须先起 `node tools/serve-dev.mjs 5183`。
3. 「样例改内联 ESM」这个修复**仍然有效且更好**（少一次网络往返、不受服务器根目录影响），
   但它当初要解决的问题是「服务器根目录不对」，不是「Tauri 嵌入不解码 URL」。

## 一、渲染器移植（地基，最关键的验证）

| 项 | 命令 | 结果 |
|---|---|---|
| 机械转换 | `python tools/build-renderer.py` | 生成 `src/renderer/flow-browser.js`（156 KB，含 4 份内联资源） |
| 逐字节回归 | `node tools/test-renderer.mjs` | **3 规格 × 竖版 SVG / 横版 SVG / Mermaid = 9 项全部 PASS** |
| 页面级一致性 | CLI 产物截图 vs 浏览器产物截图，同窗口 1900×1250 | **PNG md5 完全相同**（`a7eaf66698b8ccd99522cd0a28246386`） |

已知必然而已剥离的差异：CLI 写 `.svg` 文件时会补 39 字节 XML 声明，渲染函数返回的字符串不带；测试里用 `stripXml()` 剥掉后比对。

## 二、界面（截图见 `docs/screenshots/`）

| 截图 | 覆盖的状态 | 观察到的问题 |
|---|---|---|
| `01-空状态.png` | 首屏、无供应商 Key、画布为空 | 画布栏左右各有一个 `—` 占位，视觉上略空，不影响功能 |
| `02-示例已渲染.png` | 点「填示例」→ 右栏长图 + 对话流三条 | 无错位；iframe 内页面自带的底部工具栏可用（缩放/明暗/导出） |
| `03-供应商设置.png` | 抽屉打开、三个预设 + Key 输入 + 自定义供应商折叠表单 | provider 的 meta 行用 `word-break: break-all`，长 URL 会在 `v1` 中间断行，可读性一般 |

界面按 kz-design 的反 AI slop 清单自查：

- 无紫蓝渐变、无深蓝科技底（用暖炭灰 `#14120f` + 黄铜 `#d8a24a`）
- 无装饰 emoji、无每标题配图标
- 无卡片套卡片（对话流用扁平行 + 虚线分隔，不是气泡卡）
- 未用 Inter/Roboto/system 做全场 display（标题走衬线 `--font-display`，正文走 `--font-body`）
- 配色不是单一色相堆叠（暖炭 + 黄铜 + 语义绿/橙/红）

## 三、仍在 placeholder / 未验证的

1. **真实模型调用未跑通验证。** `call_model` 需要在 GUI 里填真 Key 才能测；本轮只验证了代码路径编译通过与前端的错误分支（无 Key 时提示、缺 Key 时自动打开设置）。这是 v0.1 最大的未验证项。
2. ~~Key 存在 WebView 的 localStorage~~ → **已改**：2026-10-29 起存 `%APPDATA%\com.ohworkspace.flowagent\providers.dat`，DPAPI(user scope) 加密 + ACL 收紧。安全性边界见下。
3. **画布隐藏了产物页的右侧详情栏**（`aside`）。窄容器里它会吃掉画布宽度；代价是点节点不再弹出"时间/负责人/说明"面板。下一步要把这个面板做进我们自己的画布栏，用 iframe 内部选中态驱动。
4. **打包（NSIS 安装包）未做**，只做到 `cargo build`；发布前还要配 `WEBVIEW2_USER_DATA_FOLDER` 或每实例独立 data directory，避免多开被锁。
5. `#home-btn` / `#flows-toggle` / `#panel-toggle` 是注入 CSS 隐藏的；上游改 id 就会失效，升级上游后要重看。
6. 界面截图里左侧对话区比设计稿宽（grid 上限 460px），窄屏（<900px）会切成上下两栏，未在真机上验证。

## 四、跑法

```powershell
cd 01-项目工程\流程图agent\app

# 只开界面（不需要 Rust、不需要 Tauri）
node tools\serve-dev.mjs 5183
# 浏览器打开 http://127.0.0.1:5183/index.html?sample=1

# 桌面端（正式包：GUI 子系统，无控制台，内嵌前端）
npm run app      # = node tools/build-static.mjs && cargo build --release
# 产物：src-tauri/target/release/flow-agent.exe

# 开发调试（会弹控制台，且需要 dev server）
npm run dev
```


## 五、第二轮代码审查（2026-10-29，发布前）

两轴并行复审，发现的问题与处置：

| 问题 | 处置 |
|---|---|
| `main.js` 里 `loadProviders()` 未 await，`storeBroken` 判断在 Promise 解析前执行 → 提示永不显示、且重复读配置 | 删掉那次提前调用，判断搬进 `boot()` 的 await 之后 |
| `tighten_acl` 先 `/inheritance:r` 再 grant，且失败静默 → 用户名含空格/中文时可能把文件锁到读不出来 | 改「先 grant 并检查退出码，成功后再断继承」，失败上报。**这条是真正会吃掉用户 Key 的隐患** |
| 并发保存共用固定 `providers.dat.tmp` → 连改两个 Key 可能落盘半个文件 | 临时名带 pid + 纳秒；`sync_all` 失败不再吞 |
| DPAPI 失败只说"失败"，无法定位 | 带上 `last_os_error()` |
| 第二个实例会撞 WebView2 锁并 `expect()` panic；GUI 无控制台 = 双击静默退出 | `report_fatal()`：写 `last-error.log` + 弹系统对话框说明原因 |
| `sync-samples` 缺源件只 warn、退出码 0 | 改为 `process.exitCode=1` |
| `verify-live` 解析失败后继续使用未定义的 `data` → TypeError 掩盖真实原因 | 失败即退出 |
| `providers.js` 注释仍写"协议只有两种" | 更正；responses 面无 `max_tokens` 时截断文案不再打 `undefined` |
| 调试后门 `?sample=1` / `?settings=1` 已编进正式包 | 改为必须显式 `?dev=1&…` 才生效 |
| `LICENSE` 把未随仓库分发的第三方设计技能列为版权人 | 移除；改为只在 NOTICE 里说明"设计原则参考"，并明确不构成版权人 |

### 仍然存在的限制（不隐藏）

- **DPAPI user scope 挡不住同一 Windows 账户下的其他进程**。它保证的是"文件拷到别处没用"，不是"本机绝对安全"。Key 在运行时必然以明文存在于进程内存与输入框 DOM 中，本版未做内存清零。
- 画布 iframe 用 `sandbox="allow-scripts allow-same-origin"`：这是让产物页（含搜索/缩放/导出）能工作的必要条件，但它等于信任产物页。产物由本地渲染器生成、文本经 `xml()` 转义，属**残余风险**而非已证漏洞。
- 未做代码签名：Windows SmartScreen 会提示"未知发布者"。
