/**
 * 供应商配置的读写。
 *
 * 桌面端：走 Rust 命令 `load_config` / `save_config`，落在
 *   <程序目录>\data\config.dat
 * 绿色便携：数据跟着程序走，整个文件夹拷走就是全部状态；
 * 删掉程序目录，配置与浏览器缓存一起清空，系统目录不留东西。
 * 文件由 Windows DPAPI（machine scope）加密 —— 不绑 Windows 账户，
 * 但拷到别的电脑上解不开（那边会当成"还没配置"）。
 *
 * 浏览器（npm run dev 调界面时）：退回 localStorage，只用于开发。
 */

import { isTauri } from './llm.js';

const LOCAL_KEY = 'flow-agent.state.v1';

function bridge() {
  return window.__TAURI_INTERNALS__;
}

/** @returns {Promise<{providers: Array, activeId: string|null}|null>} */
export async function loadState() {
  const raw = isTauri ? await bridge().invoke('load_config', {}) : localStorage.getItem(LOCAL_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  // 兼容早期直接存数组的格式
  if (Array.isArray(parsed)) return { providers: parsed, activeId: null };
  if (!parsed || typeof parsed !== 'object') return null;
  return { providers: Array.isArray(parsed.providers) ? parsed.providers : [], activeId: parsed.activeId ?? null };
}

export async function saveState(state) {
  const json = JSON.stringify({ version: 1, ...state });
  if (isTauri) {
    await bridge().invoke('save_config', { json });
    return;
  }
  localStorage.setItem(LOCAL_KEY, json);
}

/** 配置存在哪儿（给设置页显示用）。 */
export function describeStorage() {
  return isTauri
    ? '%APPDATA%\\com.ohworkspace.flowagent\\providers.dat（Windows DPAPI 加密）'
    : '浏览器 localStorage（开发模式）';
}
