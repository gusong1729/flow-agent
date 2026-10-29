/**
 * 真实调用验证：用本仓库自己的 providers.js / prompt.js / renderer 打一次真接口。
 *
 * 它不覆盖 Tauri 桥（那层由 tools/test-llm.mjs 用假桥覆盖），覆盖的是：
 *   请求信封 → 真实 HTTP → 业务错误识别 → 正文提取 → 截断识别 → JSON 解析 → 渲染。
 *
 * 用法：
 *   MM_KEY=xxx node tools/verify-live.mjs [openai|anthropic]
 * 密钥只从环境变量读，不落盘、不进仓库。
 */
import { PRESETS, buildRequest, extractText, payloadError, truncated } from '../src/providers.js';
import { SYSTEM_PROMPT } from '../src/prompt.js';
import { renderEverything } from '../src/renderer/flow-browser.js';

const MAP = { anthropic: 'minimax-anthropic', responses: 'minimax-responses', chat: 'minimax-openai' };
const which = MAP[process.argv[2]] || 'minimax-responses';
const preset = PRESETS.find((p) => p.id === which);
const apiKey = process.env.MM_KEY || process.env.MINIMAX_API_KEY;

if (!apiKey) {
  console.error('缺 MM_KEY 环境变量（不要把 key 写进文件）');
  process.exit(2);
}

const provider = { ...preset, apiKey };

// 真实任务：与界面里贴规则等价
const user = `客户规则：餐饮场景，用 EGO 头戴 + 腕部相机，拍餐具摆台和撤台。
要求：全程拍到双手与桌面；单轮 3 次，含 1 次撤台；每步目标时长写清；不确定的标 hold。
请按系统提示输出规格 JSON。`;

const maxTokens = Number(process.env.MAXTOK || 8192);
const req = buildRequest(provider, { system: SYSTEM_PROMPT, user, maxTokens });
console.log(`→ ${provider.label}  ${req.url}`);
console.log(`  max_tokens=${req.body.max_tokens}  model=${req.body.model}`);

const t0 = Date.now();
const resp = await fetch(req.url, {
  method: 'POST',
  headers: req.headers,
  body: JSON.stringify(req.body),
});
const raw = await resp.text();
let data;
try {
  data = JSON.parse(raw);
} catch {
  console.error(`返回不是 JSON（HTTP ${resp.status}）：${raw.slice(0, 300)}`);
  process.exitCode = 1;
  process.exit();   // 没有 data 就不要再往下走，否则后面会 TypeError 掩盖真实原因
}

console.log(`← HTTP ${resp.status}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);

const biz = payloadError(provider.protocol, data);
if (biz) {
  console.error(`业务错误：${biz}`);
  process.exit(1);
}
if (truncated(provider.protocol, data)) {
  console.error('输出被截断（finish_reason=length / stop_reason=max_tokens / status=incomplete）');
  process.exit(1);
}

const usage = data.usage || {};
console.log(
  `  usage: prompt=${usage.prompt_tokens ?? usage.input_tokens} ` +
    `completion=${usage.completion_tokens ?? usage.output_tokens}` +
    (usage.completion_tokens_details?.reasoning_tokens != null
      ? `（其中 reasoning=${usage.completion_tokens_details.reasoning_tokens}）`
      : ''),
);

const text = extractText(provider.protocol, data);
console.log(`  正文 ${text.length} 字`);

let spec;
try {
  spec = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
} catch (e) {
  console.error(`JSON 解析失败：${e.message}\n前 200 字：${text.slice(0, 200)}`);
  process.exitCode = 1;
}

const r = renderEverything(spec, { flows: [] });
const empty = (spec.nodes || []).filter((n) => !n.label);
console.log(`✓ 规格：${spec.nodes?.length ?? 0} 节点 / ${spec.edges?.length ?? 0} 边 / ${spec.groups?.length ?? 0} 分组`);
console.log(`✓ 渲染：竖版 ${r.portraitSize}  横版 ${r.landscapeSize}  HTML ${r.html.length}B`);
if (empty.length) console.log(`! ${empty.length} 个节点缺 label`);
console.log(`  标题：${spec.title}`);
