/**
 * 零依赖静态构建：把 index.html + src/ + public/ 拷进 dist/。
 *
 * 为什么不用 vite build：本项目的界面是原生 ESM，没有 JSX/TS/打包需求，
 * 而 Tauri 只需要一个静态目录。少一个构建工具就少一条会断的链。
 * 需要打包压缩时再切 vite，frontendDist 指向不变。
 *
 * 产物是拷贝，不要手改 dist/。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const SKIP = new Set(['node_modules', 'dist', 'src-tauri', 'tools', '.git']);

/**
 * 递归删除。
 * 不能用 fs.rmSync —— Node 24.11.1 在 Windows 上碰到中文文件名会直接让进程崩掉
 * （0xC0000409 STATUS_STACK_BUFFER_OVERRUN，无任何报错），实测可复现。
 */
function rmTree(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) rmTree(p);
    else fs.unlinkSync(p);
  }
  fs.rmdirSync(dir);
}

function copyDir(from, to, depth = 0) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (depth === 0 && SKIP.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst, depth + 1);
    else fs.copyFileSync(src, dst);
  }
}

rmTree(DIST);
fs.mkdirSync(DIST, { recursive: true });

fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
copyDir(path.join(ROOT, 'src'), path.join(DIST, 'src'));

// public/* 挂到站点根（与 vite 行为一致）：public/samples/x.json → dist/samples/x.json
if (fs.existsSync(path.join(ROOT, 'public'))) {
  copyDir(path.join(ROOT, 'public'), DIST, 0);
}

let bytes = 0;
let files = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else {
      files += 1;
      bytes += fs.statSync(p).size;
    }
  }
})(DIST);

console.log(`dist 构建完成：${files} 个文件，${(bytes / 1024).toFixed(0)} KB`);
