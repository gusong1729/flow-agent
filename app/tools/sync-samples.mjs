/**
 * 把 datacollect-flow/examples 下的规格生成成一个 ES 模块：src/samples.generated.js。
 *
 * 为什么不再拷一份 JSON 到 public/samples 再 fetch：
 *  1. Tauri 生产包的前端资源是编译期嵌进二进制的，运行时按 URL 取子目录文件不可靠
 *     （实测 exe 里一律 404）；编进 JS 之后就没有这个依赖。
 *  2. 同一份样例曾经以「examples/ 源件 + public/samples 拷贝 + 内联 JS」三份存在，
 *     改一份不会同步 —— 这是 code review 指出的重复来源。现在只有一份源件 + 一份生成物。
 *
 * 产物是生成物，不要手改。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..'); // 流程图agent/
const SRC = path.join(ROOT, 'datacollect-flow/examples');
const OUT = path.resolve(HERE, '../src/samples.generated.js');

/** 中文源文件 → JS 里的 key。新增示例时在这里登记。key 必须是 ASCII。 */
const SLUGS = {
  '任务单-餐饮摆台': 'task-dining',
  '早会执行卡-竖版': 'morning-card',
  '异常决策树-设备': 'device-troubleshoot',
};

if (!fs.existsSync(SRC)) {
  throw new Error(`找不到样例源目录：${SRC}（app/ 与 datacollect-flow/ 必须同级）`);
}

const lines = [
  '// 生成物，勿手改。来源：datacollect-flow/examples/',
  '// 重新生成：node tools/sync-samples.mjs（npm run samples）',
  'export const SAMPLE_SPECS = {',
];

let n = 0;
for (const [stem, slug] of Object.entries(SLUGS)) {
  const file = path.join(SRC, `${stem}.json`);
  if (!fs.existsSync(file)) {
    // 缺源件不能只 warn 就过：构建会"成功"，运行期点「填示例」才发现炸
    console.error(`  ✗ 缺源件：${file}`);
    process.exitCode = 1;
    continue;
  }
  const spec = JSON.parse(fs.readFileSync(file, 'utf-8'));
  lines.push(`  ${JSON.stringify(slug)}: ${JSON.stringify(spec)},`);
  n += 1;
}
lines.push('};', '');

fs.writeFileSync(OUT, lines.join('\n'), 'utf-8');
if (process.exitCode) {
  console.error(`只生成了 ${n} 份，有缺失的源件（见上）`);
} else {
  console.log(`生成 ${n} 份样例 → src/samples.generated.js`);
}
