## 流程图agent v0.1.0 · 数采任务统筹桌面端

把客户的采集规则变成现场能执行的拍摄任务单：**贴一段规则，右边直接长出流程图。**

> 本项目是 [workflow-visualizer](https://github.com/jimku233/workflow-visualizer)（MIT）的**改版**。
> 上游提供渲染内核（自实现布局与 SVG，零依赖纯离线）；本版在它之上加了对话式生成、三协议模型接入和 Windows 桌面壳。
> 逐项归属见仓库根目录的 `NOTICE.md`。

### 下载

| 文件 | 说明 |
|---|---|
| `flow-agent-0.1.0-x64.exe` | 免安装单文件，**双击即用**。约 7.9 MB |

- 要求 Windows 10/11 x64
- **不需要安装 Node**：渲染器已编进程序
- 不联网也能看已有的图；只有「让模型生成新任务单」需要网络与 API Key
- 未做代码签名，SmartScreen 可能提示「未知发布者」

SHA-256：`8d6eb8894d1d883c9dc05d89039da9f50e238a7302df4407284504f5450bbc6f`

### 这一版有什么

- **无控制台窗口**：GUI 子系统，双击直接开窗，不弹黑框
- **Key 持久化 + 加密**：供应商配置存 `%APPDATA%\com.ohworkspace.flowagent\providers.dat`，Windows DPAPI（user scope）加密，换机器或换 Windows 账户都解不开；ACL 另收紧到当前用户。重开程序不用重新填 Key
- **三协议供应商**：Responses（`/v1/responses`，MiniMax 推荐）、OpenAI 兼容、Anthropic 兼容，都可自定义 baseURL
- **渲染器搬进 WebView**：`flow.mjs` 机械转换成浏览器模块，渲染逻辑一行未改；带逐字节回归
- **出错说人话**：MiniMax 的「HTTP 200 但 `base_resp.status_code≠0`」能识别；输出被截断会明确说是 `max_tokens`，不再报成"格式不对"
- **启动失败不再静默**：GUI 没有控制台，所以窗口创建失败会落 `last-error.log` 并弹系统对话框（例如已经在运行、WebView2 目录被占用）

### 一个实测结论（给后来人）

MiniMax 是重思考模型，`max_tokens` 是「思考 + 正文」的总预算。走 `/chat/completions` 生成一张 20 节点的任务单，32768 个 token 里 27543 花在 reasoning 上，正文被截断；改走 `/v1/responses` + `reasoning.effort=minimal` 后 18–27 秒出完整规格。预设已按此配置。

### 已知限制

- **未提供安装包**：Tauri 的打包器要从 GitHub 下载 NSIS 二进制，构建时该下载超时。需要安装包可在网络通畅时本地 `npm run tauri build`
- **DPAPI 是 user scope**：挡得住"文件被拷走"，挡不住同一 Windows 账户下别的进程；Key 运行时以明文存在于进程内存
- **画布 iframe 用 `allow-scripts allow-same-origin`**：产物页要能跑搜索/缩放/导出就得这样，属残余风险（产物由本地渲染器生成，文本经转义）
- 未做代码签名

### 从源码构建

```powershell
cd app
npm run app      # build-static + cargo build --release
npm test         # 单元 32 项 + 渲染器逐字节回归 9 项
```
