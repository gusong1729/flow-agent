/**
 * 出站通道单测：Tauri 桥、业务错误、截断。
 *
 * 重点守的是 code review 第 1 号问题：真包里 invoke 必须能通到 Rust，
 * 而不是在解析裸模块名时就抛错。这里用一个假的 window.__TAURI_INTERNALS__ 证明
 * 调用确实发生了、参数形状正确。
 *
 * 跑法：npm run test:llm
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

/** 每个用例前重装全局桥，再动态 import（llm.js 在模块顶层读一次 isTauri）。 */
async function loadLlm(invokeImpl) {
  globalThis.window = { __TAURI_INTERNALS__: { invoke: invokeImpl } };
  const mod = await import(`../src/llm.js?case=${Math.random()}`);
  return mod;
}

const provider = {
  protocol: 'openai',
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-test',
  model: 'deepseek-chat',
};

describe('Tauri 桥', () => {
  test('走 window.__TAURI_INTERNALS__.invoke，参数形状正确', async () => {
    let seen = null;
    const { callModel } = await loadLlm(async (cmd, args) => {
      seen = { cmd, args };
      return { ok: true, status: 200, data: { choices: [{ message: { content: 'hello' } }] }, error: '' };
    });

    const r = await callModel(provider, { system: 'S', user: 'U' });

    assert.equal(r.ok, true);
    assert.equal(r.text, 'hello');
    assert.equal(seen.cmd, 'call_model');
    assert.equal(seen.args.url, 'https://api.deepseek.com/v1/chat/completions');
    assert.equal(seen.args.headers.authorization, 'Bearer sk-test');
    assert.equal(seen.args.body.messages[1].content, 'U');
  });

  test('MiniMax「HTTP 200 但 base_resp.status_code≠0」要报真实原因', async () => {
    const { callModel } = await loadLlm(async () => ({
      ok: true,
      status: 200,
      data: { base_resp: { status_code: 1004, status_msg: '鉴权失败：Key 与账号不匹配' } },
      error: '',
    }));

    const r = await callModel({ ...provider, baseURL: 'https://api.minimax.cn/v1' }, { system: 'S', user: 'U' });

    assert.equal(r.ok, false);
    assert.match(r.error, /鉴权失败/);
  });

  test('截断要说是 max_tokens，不能报成格式错', async () => {
    const { callModel } = await loadLlm(async () => ({
      ok: true,
      status: 200,
      data: { choices: [{ finish_reason: 'length', message: { content: '{"title":"半截' } }] },
      error: '',
    }));

    const r = await callModel(provider, { system: 'S', user: 'U' });

    assert.equal(r.ok, false);
    assert.match(r.error, /max_tokens/);
  });

  test('桥 reject 时要变成结构化错误，而不是抛出', async () => {
    const { callModel } = await loadLlm(async () => {
      throw new Error('bridge boom');
    });

    const r = await callModel(provider, { system: 'S', user: 'U' });

    assert.equal(r.ok, false);
    assert.match(r.error, /本地桥调用失败.*bridge boom/);
  });

  test('没填 Key 时直接返回，不打桥', async () => {
    let called = false;
    const { callModel } = await loadLlm(async () => {
      called = true;
      return { ok: true, status: 200, data: {}, error: '' };
    });

    const r = await callModel({ ...provider, apiKey: '' }, { system: 'S', user: 'U' });

    assert.equal(r.ok, false);
    assert.equal(called, false);
  });
});

describe('模式判定', () => {
  test('有 __TAURI_INTERNALS__ 时 isTauri 为真', async () => {
    const { isTauri } = await loadLlm(async () => ({ ok: true, status: 200, data: {}, error: '' }));
    assert.equal(isTauri, true);
  });

  test('没有桥时 isTauri 为假（退回 fetch 分支）', async () => {
    globalThis.window = {};
    const { isTauri } = await import(`../src/llm.js?case=${Math.random()}`);
    assert.equal(isTauri, false);
  });
});
