#!/usr/bin/env node
/**
 * 回归测试：浏览器版渲染器 vs CLI 产物，逐字节比对。
 *
 * 为什么重要：flow-browser.js 是从 flow.mjs 机械转换来的（去 node 依赖 + 内联资源），
 * 一旦上游升级或转换规则调整，这里挂掉就是最早的警报。
 *
 * 跑法：npm run test:renderer（cwd 为 app/）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEverything } from '../src/renderer/flow-browser.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // 流程图agent/
const EXAMPLES = path.join(ROOT, 'datacollect-flow/examples');
const OUT = path.join(ROOT, 'out');

const CASES = ['任务单-餐饮摆台', '早会执行卡-竖版', '异常决策树-设备'];

let allPass = true;
let skipped = 0;

function cmp(label, got, want) {
  if (got === want) {
    console.log(`  PASS ${label} (${got.length}B)`);
    return true;
  }
  allPass = false;
  console.log(`  FAIL ${label} browser=${got.length}B cli=${want.length}B`);
  const n = Math.min(got.length, want.length);
  for (let i = 0; i < n; i++) {
    if (got[i] !== want[i]) {
      console.log(`       首个差异 @${i}`);
      console.log(`       browser: ${JSON.stringify(got.slice(Math.max(0, i - 30), i + 30))}`);
      console.log(`       cli    : ${JSON.stringify(want.slice(Math.max(0, i - 30), i + 30))}`);
      break;
    }
  }
  return false;
}

for (const name of CASES) {
  const specPath = path.join(EXAMPLES, `${name}.json`);
  const needed = [
    `${name}.html`,
    `${name}-竖版.svg`,
    `${name}-横版.svg`,
    `${name}.mmd`,
  ].map((f) => path.join(OUT, f));

  // 不能把 SKIP 当通过：产物缺失意味着这条断言根本没跑过。
  // 之前只检查 .html，缺 svg 时会直接抛 ENOENT 崩掉，看不出是"没验证"还是"不一致"。
  const missing = needed.filter((f) => !fs.existsSync(f));
  if (missing.length) {
    skipped += 1;
    allPass = false;
    console.log(`  SKIP ${name}：缺 ${missing.map((f) => path.basename(f)).join('、')} → 计为未验证`);
    continue;
  }
  console.log(name);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const r = renderEverything(spec, { flows: [] });
  // CLI 写 .svg 文件时会补一段 XML 声明；渲染器返回的字符串本身不带。
  // 比对前剥掉，否则永远差这 39 字节。
  const stripXml = (s) => s.replace(/^<\?xml[^>]*\?>\r?\n/, '');
  cmp('竖版 SVG', r.svgPortrait, stripXml(fs.readFileSync(path.join(OUT, `${name}-竖版.svg`), 'utf8')));
  cmp('横版 SVG', r.svgLandscape, stripXml(fs.readFileSync(path.join(OUT, `${name}-横版.svg`), 'utf8')));
  cmp('Mermaid', r.mmd, fs.readFileSync(path.join(OUT, `${name}.mmd`), 'utf8'));
  console.log(`  尺寸 ${r.portraitSize} / ${r.landscapeSize}，HTML ${r.html.length}B`);
}

if (allPass) {
  console.log('\n全部通过：浏览器渲染器与 CLI 产物逐字节一致');
} else if (skipped > 0) {
  console.log(`\n未通过：有 ${skipped} 条用例因缺产物被跳过，等于没验证。先跑 datacollect-flow 的 render 再重试。`);
} else {
  console.log('\n存在差异，见上');
}
process.exitCode = allPass ? 0 : 1;
