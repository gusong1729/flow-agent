import json, re, pathlib

# 路径一律相对本脚本定位，换机器/换盘符不用改（原先硬编码绝对路径，换机即断）
HERE = pathlib.Path(__file__).resolve().parent          # app/tools
APP = HERE.parent                                        # app
SKILL = APP.parent / "datacollect-flow"                  # 流程图agent/datacollect-flow
OUT = APP / "src" / "renderer"
OUT.mkdir(parents=True, exist_ok=True)

if not (SKILL / "scripts" / "flow.mjs").exists():
    raise SystemExit(f"找不到上游渲染器：{SKILL / 'scripts' / 'flow.mjs'}（app/ 与 datacollect-flow/ 必须同级）")

src = (SKILL / "scripts" / "flow.mjs").read_text(encoding="utf-8")

# 0. 去掉 shebang（浏览器/ESM 模块里非法）
src = re.sub(r"\A#![^\n]*\n", "", src)

# 1. 去掉 node: 与本地相对导入
src = re.sub(r"^import .*?from '(node:[^']+|\./serve\.mjs)';\n", "", src, flags=re.M)

# 2. 资源目录不再来自磁盘
src = src.replace(
    "const ASSET_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');",
    "const ASSET_DIR = '';",
)

# 3. loadAsset 改为读内联表
old_loader = """const assetCache = new Map();
const loadAsset = (name) => {
  if (!assetCache.has(name)) assetCache.set(name, readFileSync(join(ASSET_DIR, name), 'utf8'));
  return assetCache.get(name);
};"""
new_loader = """const loadAsset = (name) => {
  if (!(name in __ASSETS)) throw new Error('内联资源缺失: ' + name);
  return __ASSETS[name];
};"""
assert old_loader in src, "loadAsset 结构变了，需要重新对位"
src = src.replace(old_loader, new_loader)

# 4. 砍掉 CLI 入口（main() 顶层调用块）
# 注意：「退出码契约」注释出现两次，必须从**最后一次**切，否则会把 cmdCheck 截断
cut = src.rfind("// 退出码契约")
assert cut > 0, "找不到退出码契约注释"
src = src[:cut].rstrip() + "\n"

# 5. 内联资源（只带渲染真正用到的）
names = ["app.css", "app.js", "shell.html", "svg.css"]
assets = {n: (SKILL / "assets" / n).read_text(encoding="utf-8").replace("\r\n", "\n") for n in names}

header = (
    "/* 由 datacollect-flow/scripts/flow.mjs 机械转换而来，请勿手改。\n"
    " * 转换内容：去掉 node:fs / node:path / node:url 依赖，资源改为内联，\n"
    " * 砍掉 CLI main()，补上 export。渲染逻辑本身逐字节未改。\n"
    " * 重新生成：node app/tools/build-renderer.mjs\n"
    " */\n"
    f"const __ASSETS = {json.dumps(assets, ensure_ascii=False)};\n\n"
)

footer = """
// ── 浏览器导出面 ──
export { FLOW_VERSION, normalize, layout, renderSvg, renderHtml, toMermaid, parseMermaid, extractMermaid, analyze };

/**
 * 与 CLI `render` 的核心等价：给规格，返回两版 SVG / Mermaid / 自包含 HTML。
 * 与 CLI 的唯一差异：抽屉清单 flows 由调用方传入（浏览器没有目录可扫）。
 */
export function renderEverything(specIn, { wrap = 0, flows = [] } = {}) {
  const spec = normalize(specIn);
  const baseWrap = wrap !== undefined && wrap !== null ? wrap : (spec.wrap ?? 0);
  const Lp = layout(structuredClone(spec), { wrap: baseWrap });
  const Lw = baseWrap >= 2 || baseWrap === -1
    ? layout(structuredClone(spec), { wrap: baseWrap, targetAspect: 1.6 })
    : layout(structuredClone(spec), { wrap: -1, targetAspect: 1.6 });
  const svgP = renderSvg(Lp, 'portrait', false);
  const svgW = renderSvg(Lw, 'landscape', false);
  const svgPFile = renderSvg(Lp, 'portrait', true);
  const svgWFile = renderSvg(Lw, 'landscape', true);
  const mmd = toMermaid(spec);
  const portraitSize = `${svgP.width}x${svgP.height}`;
  const landscapeSize = `${svgW.width}x${svgW.height}`;
  const html = renderHtml(
    { portrait: svgP.svg, landscape: svgW.svg, portraitSize, landscapeSize },
    Lp, mmd, { selfFile: 'preview.html', flows },
  );
  return {
    spec, html, mmd, portraitSize, landscapeSize,
    svgPortrait: svgPFile.svg, svgLandscape: svgWFile.svg,
  };
}
"""

(OUT / "flow-browser.js").write_text(header + src + footer, encoding="utf-8")
print("written:", OUT / "flow-browser.js", (OUT / "flow-browser.js").stat().st_size, "bytes")
print("assets inlined:", {k: len(v) for k, v in assets.items()})
