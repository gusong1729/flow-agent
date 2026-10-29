import { PRESETS } from './providers.js';
import { callModel } from './llm.js';
import { SYSTEM_PROMPT } from './prompt.js';
import { renderEverything } from './renderer/flow-browser.js';
import { SAMPLE_SPECS } from './samples.generated.js';
import { loadState, saveState, describeStorage } from './store.js';

/* ── DOM ── */
const $ = (id) => document.getElementById(id);
const thread = $('thread');
const input = $('input');
const sendBtn = $('send');
const sendLabel = $('send-label');
const frame = $('frame');
const empty = $('empty');
const stage = $('stage');
const canvasName = $('canvas-name');
const canvasMeta = $('canvas-meta');
const providerLabel = $('provider-label');
const providerDot = $('provider-dot');
const providerChip = $('provider-chip');
const settings = $('settings');
const scrim = $('scrim');
const providerList = $('provider-list');

/* ── 状态 ── */

let providers = [];
let activeId = null;
let lastRender = null;
/** localStorage 读坏时的原因；非空就说明用户填过的 Key 丢了，要显式告知 */
let storeBroken = '';

/* ── 供应商存取 ──
 * 桌面端：Rust 的 load_config / save_config，落到 %APPDATA% 下的 DPAPI 加密文件。
 * 浏览器：localStorage（仅开发用）。
 * 之前用 localStorage 存，换 data 目录/清缓存就丢 Key —— 这是用户报的第二个问题。
 */
async function loadProviders() {
  let saved = null;
  try {
    const state = await loadState();
    saved = state?.providers ?? null;
    if (state?.activeId) activeId = state.activeId;
  } catch (e) {
    // 不要静默吞：读取失败意味着用户填过的 Key 读不出来，必须说出来
    storeBroken = String(e?.message ?? e);
  }

  const list = Array.isArray(saved) ? saved : [];
  providers = PRESETS.map((p) => {
    const hit = list.find((s) => s?.id === p.id);
    return {
      ...p,
      apiKey: hit?.apiKey ?? '',
      model: hit?.model ?? p.model,
      baseURL: hit?.baseURL ?? p.baseURL,
      effort: hit?.effort ?? p.effort,
    };
  }).concat(list.filter((s) => s && !PRESETS.some((p) => p.id === s.id)));

  activeId = activeId || providers[0]?.id || null;
}

/** 写入失败不能静默——用户以为存上了，其实下次打开又没了。 */
async function persist() {
  try {
    await saveState({ providers, activeId });
    if (persistBrokenShown) {
      persistBrokenShown = false;
      addTurn('assistant', '配置已恢复正常保存。', 'ok');
    }
  } catch (e) {
    if (!persistBrokenShown) {
      persistBrokenShown = true;
      addTurn('system', `配置没能保存：${e?.message ?? e}\n（这次改动只在本窗口内有效，关掉就丢）`, 'error');
    }
  }
}

let persistBrokenShown = false;

const activeProvider = () => providers.find((p) => p.id === activeId) ?? null;

/* ── 提示条 ── */
function syncChip() {
  const p = activeProvider();
  const ready = Boolean(p?.apiKey);
  providerLabel.textContent = p ? p.label : '未配置供应商';
  providerDot.parentElement.classList.toggle('is-ready', ready);
  providerChip.title = p
    ? `${p.label} · ${p.model}${ready ? '' : '（缺 API Key）'}`
    : '切换模型供应商';
}

/* ── 对话流 ── */
function addTurn(role, text, tone = '') {
  const el = document.createElement('div');
  el.className = `turn is-${role}${tone ? ` is-${tone}` : ''}`;
  const r = document.createElement('div');
  r.className = 'turn-role';
  r.textContent = role === 'user' ? '你' : role === 'assistant' ? '助手' : '系统';
  const b = document.createElement('div');
  b.className = 'turn-body';
  b.textContent = text;
  el.append(r, b);
  thread.append(el);
  thread.scrollTop = thread.scrollHeight;
  return el;
}

/* ── 渲染到画布 ── */
// 嵌进来的是完整产物页（自带顶栏/搜索/底部工具栏）。这里藏掉属于"整站"的部分：
// #home-btn 回不去首页、#flows-toggle 没有清单可切；
// 还有右侧 aside 详情栏——窄容器里它会把画布挤成一条缝（实测 145% 缩放下 #canvas 只剩 ~80px）。
// 代价：点节点不再弹时间/负责人面板，下一步把这个面板做进我们自己的画布栏。
const HIDE_CHROME = [
  '#home-btn,#flows-toggle,#panel-toggle,aside{display:none!important}',
  '#canvas{width:100%!important}',
].join('');

/**
 * 把补丁样式注进产物页。
 * 找不到 </head> 时不要静默不生效——退到插在 <html> 之后，并留一条可查的警告。
 */
function injectStyle(html, css) {
  const tag = `<style>${css}</style>`;
  if (html.includes('</head>')) return html.replace('</head>', `${tag}</head>`);
  console.warn('产物页没有 </head>，样式改用前置注入');
  const m = html.match(/<html[^>]*>/i);
  if (m) return html.replace(m[0], `${m[0]}${tag}`);
  return tag + html;
}

function paint(spec, name = '任务单') {
  const r = renderEverything(spec, { flows: [] });
  const html = injectStyle(r.html, HIDE_CHROME);

  // onload 必须先挂上，再赋 srcdoc，否则可能错过 load（review 第 5 号问题：race）。
  // 强制横版：srcdoc 的 iframe 在布局稳定前就跑了 autoVariant()，那一刻视口接近
  // iframe 默认的 300×150，判成 portrait 后不再重算（实测 exe 里被挤成一条竖缝）。
  // 这里在 load 后点一下产物页自己的「横版」按钮，走它的官方 API，不做 CSS 硬覆盖。
  frame.onload = () => {
    try {
      frame.contentDocument?.querySelector('[data-variant-btn="landscape"]')?.click();
    } catch {
      /* 跨源被拒时保持产物页自身的判定 */
    }
  };
  frame.srcdoc = html;
  frame.classList.add('is-live');
  empty.hidden = true;

  canvasName.textContent = name;
  canvasMeta.textContent = `${spec.nodes.length} 环节 · ${spec.edges.length} 连线 · ${r.landscapeSize}`;
  lastRender = { ...r, name, spec };
  document.title = `${spec.title || name} · 流程图agent`;
  $('doc-title').textContent = spec.title || name;
  if (spec.subtitle) $('doc-sub').textContent = spec.subtitle;
}

function fail(message) {
  addTurn('system', message, 'error');
}

/* ── 示例 ── */
const SAMPLE = 'task-dining'; // ASCII slug，见 tools/sync-samples.mjs

async function fillSample() {
  try {
    // 样例直接来自生成模块，不走 fetch：Tauri 生产包里按 URL 取子目录资源不可靠
    const spec = SAMPLE_SPECS[SAMPLE];
    if (!spec) throw new Error(`样例 ${SAMPLE} 未生成（先跑 node tools/sync-samples.mjs）`);
    input.value = '';
    addTurn('user', `（点了「填示例」）看一下餐饮摆台的任务单长什么样`);
    paint(spec, spec.title || SAMPLE);
    addTurn(
      'assistant',
      `已用内置示例渲染：${spec.nodes.length} 个环节、${spec.groups.length} 个阶段。\n这是离线样例，不消耗任何 API 额度。要看自己的规则，直接在输入框里贴。`,
      'ok',
    );
  } catch (e) {
    fail(String(e?.message ?? e));
  }
}

/* ── 从模型回复里抠出 JSON ── */
function parseSpec(text) {
  let s = String(text).trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
  }
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0) throw new Error(`模型回复里没有 JSON 对象。原文前 120 字：${s.slice(0, 120)}`);
  if (end <= start) throw new Error('模型回复里的 JSON 只开了头没收尾（多半被截断了，见上一条 max_tokens 提示）');
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch (e) {
    throw new Error(`JSON 解析失败：${e.message}。原文前 120 字：${s.slice(start, start + 120)}`);
  }
}

/* ── 主闭环 ── */
async function generate() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const p = activeProvider();
  if (!p) {
    fail('先在右上角设置里选一个供应商。');
    return;
  }
  if (!p.apiKey) {
    fail(`「${p.label}」还没填 API Key。右上角设置 → 填入 Key，或者先点「填示例」看离线样例。`);
    openSettings();
    return;
  }

  addTurn('user', text);
  input.value = '';
  sendBtn.disabled = true;
  sendLabel.textContent = '生成中…';
  const pending = addTurn('system', `正在调用 ${p.label} / ${p.model} …`);

  try {
    const res = await callModel(p, { system: SYSTEM_PROMPT, user: text });
    pending.remove();
    if (!res.ok) {
      fail(`${p.label} 调用失败：${res.error}`);
      return;
    }
    const spec = parseSpec(res.text);
    paint(spec, spec.title || '任务单');
    addTurn('assistant', `已渲染「${spec.title || '任务单'}」：${spec.nodes.length} 个环节、${spec.edges.length} 条连线。\n要改哪一步，直接说，比如「撤台那步时间改成 90 秒」。`, 'ok');
  } catch (e) {
    pending.remove();
    fail(`生成失败：${e?.message ?? e}`);
  } finally {
    sendBtn.disabled = false;
    sendLabel.textContent = '生成任务单';
  }
}

/* ── 导出 ── */
function exportSvg() {
  if (!lastRender) return;
  const blob = new Blob([lastRender.svgLandscape], { type: 'image/svg+xml;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${(lastRender.spec?.title || lastRender.name || '流程图').replace(/[\\/:*?"<>|]/g, '-')}-横版.svg`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ── 设置 ── */
function renderProviderList() {
  providerList.innerHTML = '';
  for (const p of providers) {
    const item = document.createElement('div');
    item.className = 'provider-item' + (p.id === activeId ? ' is-active' : '');

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.label;

    const use = document.createElement('button');
    use.className = 'use';
    use.type = 'button';
    use.textContent = p.id === activeId ? '当前' : '使用';
    use.addEventListener('click', () => {
      activeId = p.id;
      persist();
      syncChip();
      renderProviderList();
    });

    const meta = document.createElement('div');
    meta.className = 'meta';
    // 文案只在这里生成一次，改字段不用再来回找（原先是逐字重复的两份）
    const metaText = () =>
      `${p.protocol} · ${p.model} · ${p.baseURL} · ${p.apiKey ? 'Key 已填' : '无 Key'}`;
    meta.textContent = metaText();

    item.append(name, use, meta);

    const keyRow = document.createElement('div');
    keyRow.className = 'meta key-row';
    const inputEl = document.createElement('input');
    inputEl.type = 'password';
    inputEl.className = 'key-input';
    inputEl.placeholder = '填 API Key（只存本机）';
    inputEl.value = p.apiKey || '';
    inputEl.addEventListener('change', () => {
      p.apiKey = inputEl.value.trim();
      persist();
      syncChip();
      meta.textContent = metaText();
    });
    keyRow.append(inputEl);
    item.append(keyRow);

    providerList.append(item);
  }
}

function openSettings() {
  settings.classList.add('is-open');
  settings.setAttribute('aria-hidden', 'false');
  scrim.hidden = false;
}

function closeSettings() {
  settings.classList.remove('is-open');
  settings.setAttribute('aria-hidden', 'true');
  scrim.hidden = true;
}

/* ── 事件 ── */
$('composer').addEventListener('submit', (e) => {
  e.preventDefault();
  generate();
});
$('fill-sample').addEventListener('click', fillSample);
$('export-svg').addEventListener('click', exportSvg);
$('open-settings').addEventListener('click', openSettings);
providerChip.addEventListener('click', openSettings);
$('close-settings').addEventListener('click', closeSettings);
scrim.addEventListener('click', closeSettings);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSettings();
});

$('provider-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const id = 'custom-' + Date.now().toString(36);
  providers.push({
    id,
    label: String(fd.get('label') || '').trim() || '自定义供应商',
    protocol: ['anthropic', 'responses'].includes(String(fd.get('protocol')))
      ? String(fd.get('protocol'))
      : 'openai',
    baseURL: String(fd.get('baseURL') || '').trim(),
    apiKey: String(fd.get('apiKey') || '').trim(),
    model: String(fd.get('model') || '').trim(),
  });
  activeId = id;
  persist();
  syncChip();
  renderProviderList();
  e.currentTarget.reset();
  closeSettings();
});

/* ── 启动 ── */
// 注意：这里**不能**先调一次 loadProviders() 再同步判断 storeBroken——
// 它是 async，Promise 还没解析时 storeBroken 一定是空串，提示永远不会显示，
// 而且会多读一次配置。统一放到 boot() 里 await 之后判断。
async function boot() {
  await loadProviders();
  if (storeBroken) {
    addTurn(
      'system',
      `配置读取失败（${storeBroken}）——你之前填的 API Key 可能读不出来了，需要重新填一次。`,
      'error',
    );
  }
  syncChip();
  renderProviderList();
  const storeLine = document.getElementById('store-hint');
  if (storeLine) storeLine.textContent = `配置保存在：${describeStorage()}`;
  addTurn(
    'assistant',
    '这里是数采任务统筹的工作台。贴一段客户采集规则，我把它变成现场能执行的拍摄任务单；右边直接出图，点节点能看负责人和拍摄要求。\n\n没有 API Key 也能先看效果——点左下角「填示例」。',
    'ok',
  );
}

boot();

// 开发自检开关：必须显式带 dev=1 才生效，避免正式用户误触进调试态。
//   ?dev=1&sample=1   启动即渲染内置示例
//   ?dev=1&settings=1 启动即打开供应商抽屉
const flags = new URLSearchParams(location.search);
if (flags.get('dev') === '1') {
  if (flags.has('sample')) fillSample();
  if (flags.has('settings')) openSettings();
}
