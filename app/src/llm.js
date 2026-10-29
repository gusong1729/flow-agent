/**
 * 出站调用。
 *
 * 为什么不让前端直接 fetch：Tauri 的 WebView 来源是 http(s)://tauri.localhost，
 * 各家模型 API 都不给浏览器发 CORS 头，直连必被拦。生产路径走 Rust 命令 `call_model`，
 * 只有 `npm run dev` 在普通浏览器里跑时才退回 fetch（会因 CORS 失败，属预期）。
 *
 * 为什么不用 `@tauri-apps/api` 的 invoke：本项目没有打包器、没有 node_modules，
 * dist 是纯拷贝，WebView 解析不了裸模块名 —— 曾经因此让真包里的每次生成都失败
 * （code review 第 1 号问题）。Tauri 2 把 invoke 挂在 window.__TAURI_INTERNALS__ 上，
 * 直接用它，零依赖。
 */

import { buildRequest, extractText, payloadError, truncated } from './providers.js';

export const isTauri = typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

function tauriInvoke(cmd, args) {
  const bridge = window.__TAURI_INTERNALS__;
  if (!bridge || typeof bridge.invoke !== 'function') {
    throw new Error('Tauri 桥不可用（window.__TAURI_INTERNALS__.invoke 缺失）');
  }
  return bridge.invoke(cmd, args);
}

/**
 * 把一次成功 HTTP 响应归一成 {ok,text,error,status}。
 * Tauri 与浏览器两条路径都只经过这里，错误文案不再各写一套。
 */
function interpret(protocol, status, data, maxTokens) {
  const biz = payloadError(protocol, data);
  if (biz) return { ok: false, error: biz, status };

  if (truncated(protocol, data)) {
    return {
      ok: false,
      error: maxTokens
        ? `输出被 max_tokens 截断（当前上限 ${maxTokens}）。规格太大就拆成两张图，或把上限调大。`
        : '输出被截断（该协议未传输出上限，用的是服务端默认）。规格太大就拆成两张图。',
      status,
    };
  }

  const text = extractText(protocol, data);
  if (!text) return { ok: false, error: '模型返回了空内容', status };
  return { ok: true, text, status };
}

/**
 * 返回 { ok, text, error, status }。
 * options.maxTokens 可覆盖默认值（默认在 providers.js 的 buildRequest 里，8192）。
 */
export async function callModel(provider, payload) {
  if (!provider.apiKey) {
    return { ok: false, error: '这个供应商还没填 API Key', status: 0 };
  }

  const req = buildRequest(provider, payload);
  const maxTokens = req.body.max_tokens;

  if (isTauri) {
    try {
      const res = await tauriInvoke('call_model', req);
      if (!res || typeof res !== 'object') {
        return { ok: false, error: '桥返回值无法解析（期望 {ok,status,data,error}）', status: 0 };
      }
      if (!res.ok) return { ok: false, error: String(res.error || '请求失败'), status: res.status ?? 0 };
      return interpret(provider.protocol, res.status ?? 0, res.data, maxTokens);
    } catch (e) {
      return { ok: false, error: `本地桥调用失败：${e?.message ?? e}`, status: 0 };
    }
  }

  // 浏览器直连：只在 npm run dev 时用，CORS 会拦住真实供应商，属预期
  let status = 0;
  try {
    const r = await fetch(req.url, {
      method: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body),
    });
    status = r.status;
    const data = await r.json().catch(() => null);
    if (!data) return { ok: false, error: `HTTP ${status}：返回的不是 JSON`, status };
    if (!r.ok) {
      const biz = payloadError(provider.protocol, data);
      return { ok: false, error: biz || `HTTP ${status}`, status };
    }
    return interpret(provider.protocol, status, data, maxTokens);
  } catch (e) {
    return {
      ok: false,
      error: `请求失败：${e?.message ?? e}（浏览器直连会被 CORS 拦，桌面端不受影响）`,
      status,
    };
  }
}
