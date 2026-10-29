/**
 * 零依赖静态服务器，只为「没有 vite 时也能看界面」。
 *
 * 与 vite 的差异只在一处：vite 会把 public/ 挂到站点根，
 * 这里手工把 /samples/* 映射到 public/samples/*，其余按 app/ 目录直出。
 *
 * 用法：node tools/serve-dev.mjs [端口]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || 5183);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    if (rel.startsWith('/samples/')) rel = '/public' + rel;

    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404 ' + rel);
        return;
      }
      res.writeHead(200, {
        'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(buf);
    });
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`dev server → http://127.0.0.1:${PORT}/index.html`);
  });
