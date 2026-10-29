# 流程图agent · 数采任务统筹

把客户的数据采集规则，变成现场能执行的**拍摄任务单**：贴一段规则，右边直接长出可点、可搜、可导出的流程图。

> **本项目是 [workflow-visualizer](https://github.com/jimku233/workflow-visualizer)（作者 jimku233，MIT）的改版。**
> 上游提供的是「业务流程 → 自包含交互式流程图」的渲染内核；本项目在它之上做了三件上游没有的事：
> **对话式生成、多供应商模型接入、Windows 桌面外壳**。
> 哪些文件来自上游、哪些是本项目新增，逐条列在 [NOTICE.md](NOTICE.md)。

## 下载

到 [Releases](../../releases) 下载 **`flow-agent-0.1.0-x64.exe`**：免安装单文件，解压到任意目录，双击即用。

要求：Windows 10/11 x64。**不需要安装 Node，不需要联网才能出图**——渲染器已编进程序，断网也能看已有的图；只有「让模型生成新任务单」需要网络和 API Key。

## 用起来是什么样

```
┌────────────────────────┬──────────────────────────────┐
│  对话                   │  画布                         │
│  「餐饮场景，用 EGO 头戴  │   ┌────┐  ┌────┐  ┌────┐     │
│   + 腕部相机，拍摆台…」   │   │进场│→ │试拍│→ │采集│ …   │
│                        │   └────┘  └────┘  └────┘     │
│  [填示例]  [生成任务单]   │  点节点看负责人/拍摄要求/合格标准 │
└────────────────────────┴──────────────────────────────┘
```

- 没有 API Key 也能先看效果：点「填示例」渲染内置任务单，不消耗额度。
- 图里点任意节点，能看到时间、负责人、拍摄要求、合格判定。
- 底部工具栏：竖版/横版切换、缩放、导出 SVG / PNG、明暗、复制 Mermaid 源码。

## 模型供应商

支持**三种协议**，都能自定义 baseURL（中转站、自建网关都行）：

| 协议 | 路径 | 典型供应商 |
|---|---|---|
| Responses | `/v1/responses` | **MiniMax（推荐）** |
| OpenAI 兼容 | `/v1/chat/completions` | DeepSeek、多数中转站 |
| Anthropic 兼容 | `/v1/messages` | MiniMax 的 Anthropic 面 |

内置预设：DeepSeek、MiniMax（Responses 面）、MiniMax（Chat 面）、MiniMax（Anthropic 面）。

> **一个实测结论**：MiniMax 是重思考模型，`max_tokens` 是「思考 + 正文」的总预算。走 `/chat/completions` 生成一张 20 节点的任务单，32768 个 token 里 27543 花在 reasoning 上，正文被截断；改走 `/v1/responses` + `reasoning.effort=minimal` 后 18–27 秒出完整规格。预设已按此配置。

## 数据放在哪

全部在**程序目录下的 `data\`**，绿色便携：

```
flow-agent.exe
data/                 ← 只需删掉这个文件夹就回到全新状态
  ├─ config.dat       ← 供应商配置（DPAPI 加密）
  └─ webview2/        ← 页面缓存
```

- 整个文件夹拷走就是全部状态，换电脑只需重新填一次 Key
- 不放系统目录，卸载/迁移不残留
- `config.dat` 由 Windows DPAPI 加密，不是明文


## 从源码构建

```powershell
cd app
npm run app      # = node tools/build-static.mjs && cargo build --release
```

产物：`app/src-tauri/target/release/flow-agent.exe`（约 7.9 MB，GUI 子系统，双击无控制台窗口）。

其他命令：

```powershell
npm test              # 单元测试 32 项 + 渲染器逐字节回归 9 项
npm run renderer      # 从 datacollect-flow/scripts/flow.mjs 重新生成浏览器渲染器
npm run dev           # 只开界面（浏览器），不需要 Rust
```

## 目录

```
.
├── app/                     桌面端（Tauri 2 + 原生 ESM，无框架无打包器）
│   ├── src/
│   │   ├── main.js          对话 / 画布 / 设置抽屉
│   │   ├── providers.js     三协议信封、错误与截断识别
│   │   ├── store.js         配置读写（桌面端走 DPAPI）
│   │   ├── llm.js           出站（Tauri 桥 / 浏览器 fetch）
│   │   ├── prompt.js        生成「规格 JSON」的系统提示
│   │   └── renderer/        由 flow.mjs 机械转换的浏览器渲染器（生成物）
│   ├── src-tauri/           Rust 壳：代发请求 + 配置加解密
│   ├── tools/               构建 / 转换 / 测试 / 真实调用验证
│   └── docs/                界面截图
├── datacollect-flow/        领域技能：SKILL.md + 上游渲染器 + 三份模板
├── docs/                    供应商接入调研
├── NOTICE.md                上游归属与许可
└── LICENSE                  MIT（含上游版权声明）
```

## 许可

MIT，见 [LICENSE](LICENSE)。上游 workflow-visualizer 的版权声明保留在其中，归属细节见 [NOTICE.md](NOTICE.md)。
