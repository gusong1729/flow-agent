/**
 * 供应商预设与协议差异。
 *
 * 按调研结论（docs/模型接入与界面方向.md）：
 *  - 三种协议：responses（/v1/responses）、openai（/v1/chat/completions）、
 *    anthropic（/v1/messages）。responses 面用 input 单串 + reasoning.effort 控思考预算。
 *  - 「OpenAI 兼容」只保证外层信封，thinking / max_tokens / 错误信封各家不同，
 *    所以差异集中在本文件的三个函数里：buildRequest / payloadError / truncated。
 *    调用点不许再写 provider 分支。
 *  - Key 只存本机；不随仓库提交。
 */

export const PRESETS = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    protocol: 'openai',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    note: '按量付费 API Key（登录账号拿不到它，那是另一套 OAuth）',
  },
  {
    id: 'minimax-responses',
    label: 'MiniMax（Responses 面 · 推荐）',
    protocol: 'responses',
    baseURL: 'https://api.minimax.cn/v1',
    model: 'MiniMax-M3.1-Flash',
    note: '思考预算可控，长任务能跑完；订阅 Key（M Plan）与按量 Key 通用',
    effort: 'minimal',
  },
  {
    id: 'minimax-openai',
    label: 'MiniMax（Chat 面 · 慎用）',
    protocol: 'openai',
    baseURL: 'https://api.minimax.cn/v1',
    model: 'MiniMax-M3.1-Flash',
    note: '实测 20 节点规格会被思考吃光 max_tokens（8191 全花在 reasoning、正文 0 字）',
    effort: 'low',
  },
  {
    id: 'minimax-anthropic',
    label: 'MiniMax（Anthropic 面）',
    protocol: 'anthropic',
    baseURL: 'https://api.minimax.cn/anthropic/v1',
    model: 'MiniMax-M3.1-Flash',
    note: '官方推荐；订阅 Key 走 M Plan（与按量 Key 独立）',
    effort: 'low',
  },
];

/** 两种协议各自的终点路径。 */
const ENDPOINT = {
  openai: '/chat/completions',
  anthropic: '/messages',
  responses: '/responses',
};

/** 协议归一：认不出来的一律当 openai，避免把未知值传到分支里。 */
function protocolOf(provider) {
  const p = provider.protocol;
  return p === 'anthropic' || p === 'responses' ? p : 'openai';
}

/**
 * 把用户填的 baseURL 拼成真正的请求地址。
 *
 * 要容忍三种写法（用户基本都会遇到其中一种）：
 *   1. 只填域名          https://api.x.com            → https://api.x.com/v1/chat/completions
 *   2. 填到版本号        https://api.x.com/v1         → https://api.x.com/v1/chat/completions
 *   3. 直接粘完整 endpoint https://api.x.com/v1/chat/completions → 原样使用，绝不双拼
 * 另外：任意版本段（/v1 /v2 /v1beta）都认得，不能只认 v1，
 * 否则 https://x.com/v2 会被拼成 /v2/v1/chat/completions。
 */
export function endpointOf(provider) {
  const protocol = protocolOf(provider);
  const tail = ENDPOINT[protocol];
  const base = String(provider.baseURL || '').trim().replace(/\/+$/, '');
  if (!base) throw new Error('baseURL 为空');

  if (base.endsWith(tail)) return base; // 已经是完整 endpoint
  if (/\/v\d+(?:beta\d*)?$/i.test(base)) return base + tail; // 已带版本段
  return base + '/v1' + tail;
}

/** 组装请求体。两种协议的信封差异只在这里出现。 */
export function buildRequest(provider, { system, user, maxTokens = 8192 }) {
  const protocol = protocolOf(provider);
  // effort 是声明式字段：只有供应商声明了才发送。
  // 为什么必须给：MiniMax 这类思考模型不设上限时会把 max_tokens 全花在 reasoning 上，
  // 正文一个 token 都不剩（实测 32768 里 27543 是思考）。设 low 后 reasoning 降到 33。
  const effort = typeof provider.effort === 'string' && provider.effort ? provider.effort : null;

  if (protocol === 'responses') {
    return {
      url: endpointOf(provider),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${provider.apiKey}`,
      },
      body: {
        model: provider.model,
        // responses 面用一个 input 字符串，没有 system 角色
        input: system + '\n\n' + user,
        ...(effort ? { reasoning: { effort } } : {}),
      },
    };
  }

  if (protocol === 'anthropic') {
    return {
      url: endpointOf(provider),
      headers: {
        'content-type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: {
        model: provider.model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      },
    };
  }

  return {
    url: endpointOf(provider),
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${provider.apiKey}`,
    },
    body: {
      model: provider.model,
      max_tokens: maxTokens,
      ...(effort ? { reasoning: { effort } } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    },
  };
}

/** 从两种协议的响应里取出正文。 */
export function extractText(protocol, data) {
  if (protocol === 'responses') {
    const out = Array.isArray(data?.output) ? data.output : [];
    const msg = out.find((o) => o?.type === 'message');
    const parts = Array.isArray(msg?.content) ? msg.content : [];
    return parts
      .filter((c) => c?.type === 'output_text' && typeof c.text === 'string')
      .map((c) => c.text)
      .join('')
      .trim();
  }
  if (protocol === 'anthropic') {
    const parts = Array.isArray(data?.content) ? data.content : [];
    return parts
      .filter((p) => p?.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text)
      .join('')
      .trim();
  }
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

/**
 * 识别「HTTP 200 但业务上失败了」的响应，返回一句人能看懂的原因；正常返回 null。
 *
 * 为什么必须单独做：MiniMax 一家就是 200 + base_resp.status_code ≠ 0。
 * 只看 HTTP 状态会把鉴权失败/限流/额度不足全当成成功，最后在正文为空的
 * 地方报「模型返回了空内容」，真正原因被埋掉（code review 抓到的第 2 号问题）。
 */
export function payloadError(protocol, data) {
  if (!data || typeof data !== 'object') return null;

  // Anthropic：{ type: "error", error: { type, message } }
  if (data.type === 'error' && data.error) {
    return String(data.error.message || data.error.type || '供应商返回了错误');
  }

  // MiniMax / 部分国内网关：{ base_resp: { status_code, status_msg } }
  const br = data.base_resp;
  if (br && typeof br === 'object' && br.status_code != null && Number(br.status_code) !== 0) {
    return String(br.status_msg || `供应商业务错误码 ${br.status_code}`);
  }

  // OpenAI 风格：{ error: { message } } 或 { error: "..." }
  if (data.error) {
    const e = data.error;
    if (typeof e === 'string') return e;
    if (typeof e.message === 'string' && e.message) return e.message;
    return '供应商返回了 error 字段但没有说明';
  }

  // 该协议要求的正文一条都没有
  const hasBody =
    protocol === 'anthropic'
      ? Array.isArray(data.content)
      : protocol === 'responses'
        ? Array.isArray(data.output)
        : Array.isArray(data.choices);
  if (!hasBody) return '响应里没有正文（结构与协议不符）';

  // responses 面：status=failed 也算业务失败
  if (protocol === 'responses' && data.status === 'failed') {
    return String(data.incomplete_details?.reason || 'responses 返回 status=failed');
  }

  return null;
}

/** 输出是不是被 max_tokens 截断了。截断时不该报「格式不对」。 */
export function truncated(protocol, data) {
  if (protocol === 'anthropic') return data?.stop_reason === 'max_tokens';
  if (protocol === 'responses') {
    return data?.status === 'incomplete' || data?.incomplete_details?.reason === 'max_output_tokens';
  }
  return data?.choices?.[0]?.finish_reason === 'length';
}
