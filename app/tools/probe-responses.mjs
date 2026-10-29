/**
 * 对比探针：MiniMax 的 /v1/responses + reasoning.effort 是否比 chat/completions 更省。
 * 只看 token 账，不判好坏；用完即弃，不进产品代码。
 */
import { SYSTEM_PROMPT } from '../src/prompt.js';

const key = process.env.MM_KEY;
if (!key) {
  console.error('缺 MM_KEY');
  process.exitCode = 2;
  process.exit;
}

const user = `客户规则：餐饮场景，用 EGO 头戴 + 腕部相机，拍餐具摆台和撤台。
要求：全程拍到双手与桌面；单轮 3 次，含 1 次撤台；每步目标时长写清；不确定的标 hold。
请按系统提示输出规格 JSON。`;

for (const effort of ['low', 'minimal']) {
  const body = {
    model: 'MiniMax-M3.1-Flash',
    input: `${SYSTEM_PROMPT}\n\n${user}`,
    reasoning: { effort },
  };
  const t0 = Date.now();
  const r = await fetch('https://api.minimax.cn/v1/responses', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  const d = await r.json();
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  if (!r.ok || d.error) {
    console.log(`effort=${effort}: HTTP ${r.status} 错误 ${JSON.stringify(d.error || d).slice(0, 200)}`);
    continue;
  }

  const msg = (d.output || []).find((o) => o.type === 'message');
  const text = (msg?.content || []).filter((c) => c.type === 'output_text').map((c) => c.text).join('');
  const u = d.usage || {};
  console.log(
    `effort=${effort}: ${secs}s  status=${d.status}  ` +
      `in=${u.input_tokens} out=${u.output_tokens} ` +
      `reasoning=${u.output_tokens_details?.reasoning_tokens ?? '?'}  正文=${text.length}字`,
  );
  if (text.trim().startsWith('{')) {
    try {
      const spec = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
      console.log(`  ✓ 可解析：${spec.nodes?.length ?? 0} 节点 / ${spec.edges?.length ?? 0} 边`);
    } catch (e) {
      console.log(`  ✗ JSON 不完整：${e.message}`);
    }
  }
}
