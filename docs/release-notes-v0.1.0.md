## 流程图agent v0.1.0

把业务流程整理成现场能执行的步骤：贴一段规则，右边直接长出可点、可搜、可导出的流程图。

> 本项目是 [workflow-visualizer](https://github.com/jimku233/workflow-visualizer)（MIT）的改版。
> 上游提供渲染内核（自实现布局与 SVG，零依赖纯离线）；本版在它之上加了对话式生成、多协议模型接入和 Windows 桌面外壳。

### 下载

`flow-agent.exe` —— 免安装单文件，解压到任意目录，双击即用。约 7.9 MB，Windows 10/11 x64。

- 不需要安装 Node：渲染器已编进程序
- 断网也能看已有的图；「让模型生成新任务单」才需要网络与 API Key

SHA-256：`8d6eb8894d1d883c9dc05d89039da9f50e238a7302df4407284504f5450bbc6f`

### 功能

- 双击即开窗，没有控制台窗口
- **供应商配置加密保存**：存 `%APPDATA%` 下，Windows DPAPI 加密，重开不用重填 Key
- **多协议供应商**：Responses（`/v1/responses`）、OpenAI 兼容、Anthropic 兼容，均可自定义 baseURL
- **渲染器编进 WebView**：`flow.mjs` 转为浏览器模块，渲染逻辑未改，带逐字节回归测试
- **错误说明清楚**：能识别「HTTP 200 但业务码非 0」；输出被截断会明确指出来

### 从源码构建

```powershell
cd app
npm run app
npm test
```
