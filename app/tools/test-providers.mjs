/**
 * 纯函数单测：协议信封、endpoint 拼接、业务错误识别、截断识别、Tauri invoke 通道。
 * 跑法：npm run test:llm（node --test，零依赖）
 *
 * 这些点是 code review 里抓出来的，先写断言再改实现。
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { endpointOf, buildRequest, payloadError, truncated, extractText, PRESETS } from '../src/providers.js';

const openai = { protocol: 'openai', baseURL: 'https://api.deepseek.com/v1', apiKey: 'sk-x', model: 'deepseek-chat' };
const anthropic = { protocol: 'anthropic', baseURL: 'https://api.minimax.cn/anthropic/v1', apiKey: 'k', model: 'MiniMax-M3.1-Flash' };

describe('endpointOf', () => {
  test('baseURL 已带 /v1 → 直接接路径', () => {
    assert.equal(endpointOf(openai), 'https://api.deepseek.com/v1/chat/completions');
  });

  test('baseURL 不带版本 → 补 /v1', () => {
    assert.equal(
      endpointOf({ ...openai, baseURL: 'https://api.deepseek.com' }),
      'https://api.deepseek.com/v1/chat/completions',
    );
  });

  test('尾斜杠不应产生双斜杠', () => {
    assert.equal(
      endpointOf({ ...openai, baseURL: 'https://api.deepseek.com/v1/' }),
      'https://api.deepseek.com/v1/chat/completions',
    );
  });

  test('用户直接粘完整 endpoint → 原样使用，不双拼', () => {
    assert.equal(
      endpointOf({ ...openai, baseURL: 'https://x.com/v1/chat/completions' }),
      'https://x.com/v1/chat/completions',
    );
    assert.equal(
      endpointOf({ ...anthropic, baseURL: 'https://x.com/v1/messages' }),
      'https://x.com/v1/messages',
    );
  });

  test('anthropic 面拼 /messages', () => {
    assert.equal(endpointOf(anthropic), 'https://api.minimax.cn/anthropic/v1/messages');
  });

  test('非标准版本号不被误改成 /v2/v1', () => {
    assert.equal(
      endpointOf({ ...openai, baseURL: 'https://x.com/v2' }),
      'https://x.com/v2/chat/completions',
    );
  });
});

describe('buildRequest', () => {
  test('OpenAI 用 Authorization: Bearer，system 进 messages', () => {
    const r = buildRequest(openai, { system: 'S', user: 'U' });
    assert.equal(r.headers.authorization, 'Bearer sk-x');
    assert.equal(r.body.messages[0].role, 'system');
    assert.equal(r.body.messages[1].content, 'U');
    assert.equal(r.body.system, undefined);
  });

  test('Anthropic 用 x-api-key + anthropic-version，system 是顶层字段', () => {
    const r = buildRequest(anthropic, { system: 'S', user: 'U' });
    assert.equal(r.headers['x-api-key'], 'k');
    assert.equal(r.headers.authorization, undefined);
    assert.equal(r.headers['anthropic-version'], '2023-06-01');
    assert.equal(r.body.system, 'S');
    assert.equal(r.body.messages.length, 1);
  });

  test('声明了 effort 才发 reasoning，没声明就不发（别给自定义站塞未知字段）', () => {
    assert.deepEqual(buildRequest(openai, { system: 'S', user: 'U' }).body.reasoning, undefined);
    const withEffort = buildRequest({ ...openai, effort: 'low' }, { system: 'S', user: 'U' });
    assert.deepEqual(withEffort.body.reasoning, { effort: 'low' });
  });

  test('MiniMax 预设默认带 effort=low（否则思考会吃光 max_tokens）', () => {
    for (const id of ['minimax-openai', 'minimax-anthropic']) {
      const p = PRESETS.find((x) => x.id === id);
      assert.equal(p.effort, 'low', `${id} 缺 effort`);
    }
  });

  test('默认 max_tokens 足以生成 20 节点规格（不再用 4096 卡自己）', () => {
    const r = buildRequest(openai, { system: 'S', user: 'U' });
    assert.ok(r.body.max_tokens >= 8192, `max_tokens 太小：${r.body.max_tokens}`);
  });
});

const responses = { protocol: 'responses', baseURL: 'https://api.minimax.cn/v1', apiKey: 'k', model: 'MiniMax-M3.1-Flash', effort: 'minimal' };

describe('responses 面（MiniMax 官方推荐，思考预算可控）', () => {
  test('拼 /responses，不拼 /v1 两次', () => {
    assert.equal(endpointOf(responses), 'https://api.minimax.cn/v1/responses');
  });

  test('body 用 input 而不是 messages，并带上 reasoning.effort', () => {
    const r = buildRequest(responses, { system: 'S', user: 'U' });
    assert.equal(r.body.input, 'S\n\nU');
    assert.equal(r.body.messages, undefined);
    assert.deepEqual(r.body.reasoning, { effort: 'minimal' });
    assert.equal(r.headers.authorization, 'Bearer k');
  });

  test('从 output[] 里取 type=message 的 output_text，跳过 reasoning 项', () => {
    const data = {
      status: 'completed',
      output: [
        { type: 'reasoning', content: [{ type: 'reasoning_text', text: '想啊想' }] },
        { type: 'message', content: [{ type: 'output_text', text: '{"title":"ok"}' }] },
      ],
    };
    assert.equal(extractText('responses', data), '{"title":"ok"}');
    assert.equal(payloadError('responses', data), null);
    assert.equal(truncated('responses', data), false);
  });

  test('status=incomplete 判为截断', () => {
    assert.equal(truncated('responses', { status: 'incomplete', output: [] }), true);
  });

  test('没有 output 数组算结构不符', () => {
    assert.match(payloadError('responses', { foo: 1 }), /结构与协议不符/);
  });
});

describe('payloadError：HTTP 200 但业务失败', () => {
  test('OpenAI 风格 error 对象', () => {
    assert.equal(payloadError('openai', { error: { message: 'invalid api key' } }), 'invalid api key');
  });

  test('MiniMax 的 base_resp.status_code ≠ 0（这是最容易漏的一种）', () => {
    assert.equal(
      payloadError('openai', { base_resp: { status_code: 1004, status_msg: '鉴权失败' } }),
      '鉴权失败',
    );
  });

  test('MiniMax 正常返回（status_code = 0）不算错', () => {
    assert.equal(
      payloadError('openai', {
        base_resp: { status_code: 0, status_msg: '' },
        choices: [{ message: { content: '{"title":"x"}' } }],
      }),
      null,
    );
  });

  test('Anthropic 的 type: error', () => {
    assert.equal(payloadError('anthropic', { type: 'error', error: { message: 'overloaded' } }), 'overloaded');
  });

  test('正常响应返回 null', () => {
    assert.equal(payloadError('anthropic', { content: [{ type: 'text', text: 'hi' }] }), null);
  });
});

describe('truncated：输出被 max_tokens 截断', () => {
  test('OpenAI finish_reason = length', () => {
    assert.equal(truncated('openai', { choices: [{ finish_reason: 'length' }] }), true);
  });

  test('Anthropic stop_reason = max_tokens', () => {
    assert.equal(truncated('anthropic', { stop_reason: 'max_tokens' }), true);
  });

  test('正常结束为 false', () => {
    assert.equal(truncated('openai', { choices: [{ finish_reason: 'stop' }] }), false);
    assert.equal(truncated('anthropic', { stop_reason: 'end_turn' }), false);
  });
});

describe('extractText', () => {
  test('两种协议都能取到正文', () => {
    assert.equal(extractText('openai', { choices: [{ message: { content: ' A ' } }] }), 'A');
    assert.equal(extractText('anthropic', { content: [{ type: 'text', text: 'B' }, { type: 'tool_use' }] }), 'B');
  });
});
