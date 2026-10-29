/* 由 datacollect-flow/scripts/flow.mjs 机械转换而来，请勿手改。
 * 转换内容：去掉 node:fs / node:path / node:url 依赖，资源改为内联，
 * 砍掉 CLI main()，补上 export。渲染逻辑本身逐字节未改。
 * 重新生成：node app/tools/build-renderer.mjs
 */
const __ASSETS = {"app.css": "\n  :root{--ff:'Segoe UI','Microsoft YaHei',system-ui,-apple-system,sans-serif;\n    --bg:#12161d;--panel:#171d26;--panel2:#1d242f;--panel3:#232b37;--text:#eaeef5;--muted:#9aa5b8;--line:#2a3341;--line2:#35404f;\n    --accent:#5aa9ff;--accent-soft:#5aa9ff24;--warn:#eab24a;--risk:#f4676c;--ok:#46c886;\n    /* --hit 必须在这里也定义一份：搜索命中清单在 <aside> 里，拿不到 svg.css 里定义在 <svg> 上的同名变量\n       （原来只定义在 SVG 作用域 → .hit-row 的三条规则全部失效：关键词没底色、当前行没描边、序号圆点没底色） */\n    --hit:#4a9dff;\n    /* 文字用途令牌：深色主题下与原色相同（只为浅色提供可加深的落点） */\n    --accent-text:var(--accent);--ok-text:var(--ok);--warn-text:var(--warn);--risk-text:var(--risk);\n    --shadow:0 1px 2px rgba(0,0,0,.36),0 10px 26px rgba(0,0,0,.22)}\n  html[data-theme='light']{--bg:#e8dbc4;--panel:#f7efdf;--panel2:#f2e8d6;--panel3:#e2d3b8;--text:#2b2721;--muted:#6f6553;--line:#dccbaa;--line2:#c6b28e;\n    --accent:#bf6b3a;--accent-soft:#bf6b3a1f;--warn:#b8801a;--risk:#c2403f;--ok:#35935f;\n    /* 浅色下页面用的命中色比 SVG 里的 #2b7fe0 更深：#2b7fe0 对 panel3 只有 2.73:1（非文本需 ≥3:1），\n       #1a5fb0 对 panel3 4.31、panel2 5.23、panel 5.55（对比度由 tools/contrast.py 复算） */\n    --hit:#1a5fb0;\n    /* 小字对比度：--muted 3.89→4.54；下面四个是\"文字专用\"深色（圆点/描边/填充仍用原色）\n       数值由 tools/tests/contrast.mjs 复算（阈值 4.5:1，取三种面板底最差的那个） */\n    --muted:#645b4b;--accent-text:#884c29;--ok-text:#256843;--warn-text:#795411;--risk-text:#a43534;\n    --shadow:0 1px 2px rgba(93,74,45,.13),0 10px 26px rgba(93,74,45,.13)}\n  /* 缩小时画布也跟着加深一档，让近白色的方块浮出来（节点底/画布 1.34→1.40，刻意只加一点点） */\n  html[data-theme='light'] body:has(svg.zoomed-out){--bg:#e4d7bb;--panel3:#ddcdab}\n  *{box-sizing:border-box}\n  html,body{margin:0;height:100%;background:var(--bg);color:var(--text);font-family:var(--ff);-webkit-font-smoothing:antialiased;transition:background .22s ease}\n  body{display:flex;flex-direction:column;overflow:hidden}\n  header{display:flex;align-items:center;gap:12px;padding:9px 14px;background:var(--panel);border-bottom:1px solid var(--line);flex-wrap:wrap;z-index:3}\n  .brand{display:flex;align-items:center;gap:8px;min-width:0}\n  .brand-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);flex:0 0 auto}\n  .brand-name{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:44vw}\n  .search{display:flex;align-items:center;gap:7px;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:5px 10px;transition:border-color .15s}\n  .search:focus-within{border-color:var(--accent);background:var(--panel3)}\n  .search svg{width:14px;height:14px;flex:0 0 auto;stroke:var(--muted);fill:none;stroke-width:1.6;stroke-linecap:round}\n  .search input{background:none;border:0;color:var(--text);font-size:12.5px;width:200px;outline:none;font-family:var(--ff)}\n  #search-count{font-size:11.5px;color:var(--muted);min-width:58px}\n  button{background:var(--panel2);border:1px solid var(--line);color:var(--text);border-radius:9px;padding:6px 10px;font-size:12.5px;cursor:pointer;font-family:var(--ff);display:inline-flex;align-items:center;gap:6px;transition:all .14s}\n  button:hover{border-color:var(--accent);color:var(--accent-text);background:var(--panel3)}\n  button.on{border-color:var(--accent);color:var(--accent-text);background:var(--panel3)}\n  button.locked{opacity:.5}\n  #toast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,14px);max-width:86vw;text-align:center;\n    background:var(--panel3);color:var(--text);border:1px solid var(--line2);border-radius:12px;padding:9px 15px;\n    font-size:12.5px;box-shadow:var(--shadow);opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:40}\n  #toast.show{opacity:1;transform:translate(-50%,0)}\n  button.off{opacity:.38;text-decoration:line-through}\n  button svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}\n  a.icon-btn{background:var(--panel2);border:1px solid var(--line);color:var(--text);border-radius:9px;padding:6px 10px;\n    font-size:12.5px;display:inline-flex;align-items:center;gap:6px;text-decoration:none;transition:all .14s}\n  a.icon-btn:hover{border-color:var(--accent);color:var(--accent-text);background:var(--panel3)}\n  a.icon-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}\n  .legend{display:flex;gap:6px;align-items:center;margin-left:auto;flex-wrap:wrap}\n  .legend button{padding:5px 9px;border-radius:999px;font-size:12px}\n  .dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex:0 0 auto}\n  .dot.st-done{background:var(--ok)}.dot.st-doing{background:var(--accent)}.dot.st-todo{background:#7c8798}\n  .dot.st-risk{background:var(--risk)}.dot.st-hold{background:var(--warn)}\n  main{flex:1;display:flex;min-height:0}\n  #canvas{flex:1;min-width:0;position:relative;overflow:hidden;transition:background .22s ease;\n    background:radial-gradient(1100px 620px at 50% -8%, color-mix(in srgb,var(--panel3) 70%,var(--bg)) 0%, var(--bg) 72%)}\n  #canvas > svg{width:100%;height:100%;display:none;touch-action:none}\n  #canvas[data-show='portrait'] #flow-svg-portrait,\n  #canvas[data-show='landscape'] #flow-svg-landscape{display:block}\n  .seg{display:flex;align-items:center;gap:2px;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:2px}\n  .seg button{border:0;background:none;padding:5px 9px;border-radius:8px;font-size:12px}\n  .seg button.on{background:var(--panel3);color:var(--accent-text);box-shadow:inset 0 0 0 1px var(--accent-soft)}\n  aside{width:330px;flex:0 0 330px;background:var(--panel);border-left:1px solid var(--line);overflow:auto;padding:16px}\n  aside::-webkit-scrollbar{width:9px}aside::-webkit-scrollbar-thumb{background:var(--line2);border-radius:9px}\n  .ov-kicker{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}\n  .ov-title{margin:7px 0 6px;font-size:17px;line-height:1.35;font-weight:600;letter-spacing:.1px}\n  .ov-sub{margin:0 0 14px;font-size:12.5px;line-height:1.65;color:var(--muted)}\n  .stats{display:flex;gap:8px;margin-bottom:16px}\n  .stat{flex:1;background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:9px 10px;text-align:center}\n  .stat b{display:block;font-size:19px;font-weight:600;line-height:1.15}\n  .stat span{font-size:10.5px;color:var(--muted)}\n  .sec{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:16px 0 8px}\n  .pillcol{display:flex;flex-direction:column;gap:5px}\n  .ov-status,.ov-focus{width:100%;justify-content:flex-start;padding:7px 10px;font-size:12.5px;background:var(--panel2)}\n  .ov-status em,.ov-focus em{margin-left:auto;font-style:normal;font-size:11px;color:var(--muted)}\n  .ov-focus{text-align:left}\n  .ov-focus .of-dot{width:7px;height:7px;border-radius:50%}\n  .of-dot.st-risk{background:var(--risk)}.of-dot.st-hold{background:var(--warn)}\n  .of-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .klegend{display:flex;gap:6px;flex-wrap:wrap}\n  .kchip{font-size:11.5px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:3px 9px;background:var(--panel2)}\n  .d-id{font-size:11px;color:var(--muted);font-family:ui-monospace,Consolas,monospace}\n  .d-title{margin:6px 0 10px;font-size:16px;line-height:1.4;font-weight:600}\n  .hint{font-size:11.5px;color:var(--muted);line-height:1.75;margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}\n  .chips{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}\n  .chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;padding:3px 9px;border-radius:999px;border:1px solid var(--line);color:var(--muted);background:var(--panel2)}\n  .chip.st-done{color:var(--ok-text);border-color:color-mix(in srgb,var(--ok) 40%,transparent)}\n  .chip.st-doing{color:var(--accent-text);border-color:color-mix(in srgb,var(--accent) 40%,transparent)}\n  .chip.st-todo{color:var(--muted)}\n  .chip.st-risk{color:var(--risk-text);border-color:color-mix(in srgb,var(--risk) 40%,transparent)}\n  .chip.st-hold{color:var(--warn-text);border-color:color-mix(in srgb,var(--warn) 40%,transparent)}\n  .kv{font-size:12.5px;line-height:1.7;margin:10px 0}\n  .kv b{display:block;color:var(--muted);font-weight:600;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}\n  .kv.note{border-left:2px solid var(--warn);padding:2px 0 2px 10px;background:color-mix(in srgb,var(--warn) 7%,transparent);border-radius:0 8px 8px 0}\n  .jump{display:inline-flex;padding:3px 8px;margin:0 4px 4px 0;font-size:11.5px;border-radius:7px;background:var(--panel2);border:1px solid var(--line);color:var(--text);cursor:pointer}\n  .jump:hover{border-color:var(--accent);color:var(--accent-text)}\n  button.back{margin-bottom:12px;font-size:12px;padding:5px 9px}\n  /* 搜索结果：说明/备注这类\"看不见的命中\"单独一栏，点一下定位 */\n  .hit-head{display:flex;align-items:center;gap:8px;margin:16px 0 8px}\n  .hit-nav{display:flex;align-items:center;gap:4px;margin-left:auto}\n  .hit-nav button{padding:2px 9px;font-size:13px;line-height:1.5;width:26px;justify-content:center}\n  .hit-pos{font-size:11.5px;color:var(--muted);min-width:30px;text-align:center;font-variant-numeric:tabular-nums}\n  .focus-toggle{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted);margin:9px 0 0;cursor:pointer}\n  .focus-toggle input{accent-color:var(--accent)}\n  .hits{display:flex;flex-direction:column;gap:5px}\n  .hit-row{width:100%;text-align:left;justify-content:flex-start;gap:9px;padding:7px 10px;font-size:12.5px;background:var(--panel2);align-items:flex-start}\n  .hit-row .hr-n{flex:0 0 auto;width:18px;height:18px;border-radius:50%;background:var(--panel3);color:var(--muted);\n    font-size:11px;display:inline-flex;align-items:center;justify-content:center;margin-top:1px}\n  .hit-row.cur{border-color:var(--hit);background:var(--panel3)}\n  .hit-row.cur .hr-n{background:transparent;color:var(--text);box-shadow:inset 0 0 0 1.5px var(--hit)}\n  .hit-row .hr-main{display:flex;flex-direction:column;min-width:0}\n  .hit-row em{font-style:normal;font-size:10.5px;color:var(--muted);margin-left:6px;white-space:nowrap}\n  .hit-row .hr-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}\n  .hit-row .hr-snip{display:block;font-size:11px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .hit-row.soft .hr-snip{color:var(--warn-text)}\n  .hit-row mark{background:color-mix(in srgb,var(--hit) 30%,transparent);color:inherit;border-radius:3px;padding:0 2px}\n  .hit-row.soft mark{background:color-mix(in srgb,var(--warn) 30%,transparent)}\n  .hit-tip{font-size:11px;color:var(--muted);margin:2px 0 7px}\n  /* 搜索中：非命中整体淡出，命中描边加粗；#vp 在程序化移动时加过渡 */\n  svg.searching .node:not(.is-hit):not(.is-hit-soft){opacity:.14}\n  svg.searching .edge:not(.is-hit){opacity:.1}\n  svg.searching .edge-label-g:not(.is-hit){opacity:.1}\n  svg.searching .band{opacity:.35}\n  svg.searching .node.is-hit .node-bg{stroke:var(--hit);stroke-width:3}\n  svg.searching .node.is-hit-soft .node-bg{stroke-width:2.8}\n  #vp-portrait.vp-anim,#vp-landscape.vp-anim{transition:transform .28s ease}\n  /* 全部流程图：右侧抽屉 */\n  #flows-drawer{position:fixed;top:0;right:0;width:330px;max-width:88vw;height:100%;background:var(--panel);\n    border-left:1px solid var(--line);box-shadow:-14px 0 34px rgba(0,0,0,.28);transform:translateX(102%);\n    transition:transform .18s ease;z-index:20;display:flex;flex-direction:column}\n  #flows-drawer.open{transform:none}\n  .fd-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line);font-size:13px;font-weight:600}\n  .fd-head button{margin-left:auto;padding:4px 9px}\n  #flows-list{padding:10px 12px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:6px}\n  .flow-row{display:block;padding:9px 11px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);\n    color:var(--text);text-decoration:none;font-size:12.5px;line-height:1.5}\n  .flow-row:hover{border-color:var(--accent);color:var(--accent-text)}\n  .flow-row.cur{border-color:var(--accent);background:var(--panel3);cursor:default}\n  .flow-row.cur:hover{border-color:var(--accent);color:var(--text)}\n  .flow-row .fr-name{font-weight:600;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .flow-row .fr-meta{color:var(--muted);font-size:11px}\n  .flow-row .fr-cur{color:var(--accent-text);font-size:11px;margin-left:6px}\n  .fd-hint{margin:0;padding:10px 14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted);line-height:1.6}\n  #drawer-scrim{position:fixed;inset:0;background:rgba(0,0,0,.42);opacity:0;pointer-events:none;transition:opacity .18s ease;z-index:19}\n  #drawer-scrim.open{opacity:1;pointer-events:auto}\n  @media (max-width:600px){ #flows-drawer{width:100%;max-width:100%} }\n  #mmd-panel{display:none;border-top:1px solid var(--line);background:var(--panel);padding:12px 14px}\n  #mmd-panel.open{display:block}\n  #mmd-src{width:100%;height:150px;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:10px;font:12px/1.65 ui-monospace,Consolas,monospace;padding:10px;resize:vertical;outline:none}\n  /* 键盘焦点环：鼠标点击不显示（:focus-visible），浅色用 accent-text（原 accent 对画布只有 2.86:1） */\n  :focus-visible{outline:2px solid var(--accent-text,var(--accent));outline-offset:2px}\n  .search input:focus-visible{outline:none}\n  .search:focus-within{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent-text,var(--accent)) 55%,transparent)}\n  #mmd-src:focus-visible{outline:2px solid var(--accent-text,var(--accent))}\n  footer{display:flex;gap:8px;padding:8px 14px;border-top:1px solid var(--line);background:var(--panel);font-size:12px;color:var(--muted);align-items:center;flex-wrap:wrap}\n  .zoom-group{display:flex;align-items:center;gap:2px;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:2px}\n  .zoom-group button{border:0;background:none;padding:5px 7px}\n  .zoom-group button span{display:none}\n  #zoom-label{font-size:11.5px;color:var(--muted);min-width:44px;text-align:center;font-variant-numeric:tabular-nums}\n  .sep{width:1px;height:20px;background:var(--line);margin:0 3px}\n  .foot-hint{margin-left:auto;font-size:11.5px}\n  /* 按「触屏还是鼠标」给不同操作提示：别在手机上教人用滚轮、在电脑上教人双指 */\n  .only-touch{display:none}\n  @media (hover:none),(pointer:coarse){\n    .only-pc{display:none}\n    .only-touch{display:inline}\n  }\n  @media (max-width:960px){ main{flex-direction:column} aside{width:auto;flex:0 0 auto;border-left:none;border-top:1px solid var(--line);max-height:40vh} .brand-name{max-width:60vw} }\n  @media (max-width:600px){\n    header{padding:8px 10px;gap:8px}\n    .brand-name{max-width:52vw;font-size:13px}\n    .search{order:3;width:100%}\n    .search input{width:100%}\n    #search-count{order:4;min-width:0}\n    .legend{order:5;width:100%;margin-left:0}\n    .legend button{padding:4px 8px;font-size:11.5px}\n    /* A4：窄屏上把可点面积做大（手指比鼠标粗；WCAG 2.2 AA 最低 24×24，这里给 34–40） */\n    .icon-btn,a.icon-btn{min-height:40px;min-width:40px;padding:8px 10px;justify-content:center}\n    .seg button{min-height:38px;min-width:40px}\n    .legend button{min-height:34px;padding:7px 10px}\n    /* 手机上概览/详情收成**覆盖式**底部抽屉：脱离 flex 流，画布尺寸不变，\n       就不会出现\"开面板→画布变矮→重新适配→图被裁掉\"的连锁反应 */\n    aside{display:none;position:fixed;left:0;right:0;bottom:0;top:auto;width:auto;flex:0 0 auto;\n      max-height:58vh;padding:14px;border-left:none;border-top:1px solid var(--line);\n      border-radius:16px 16px 0 0;box-shadow:0 -14px 34px rgba(0,0,0,.42);z-index:15}\n    body.panel-open aside{display:block}\n    .panel-btn{display:inline-flex !important}\n    .ov-title{font-size:15px}.d-title{font-size:15px}\n    footer{padding:7px 10px;gap:6px}\n    .foot-hint{display:none}\n    .seg button span,.icon-btn span{display:none}\n    .seg button{padding:6px 8px}\n  }\n  .panel-btn{display:none}\n  @media print{ header,aside,footer,#mmd-panel{display:none} #canvas{background:#fff} }\n\n  /* B6：系统开了\"减少动态效果\"就不做过渡/动画（抽屉、主题切换、缩放仍然可用，只是瞬时到位） */\n  @media (prefers-reduced-motion: reduce){\n    *,*::before,*::after{transition:none!important;animation:none!important}\n  }\n", "app.js": "(function(){\n  'use strict';\n  var data=JSON.parse(document.getElementById('flow-data').textContent);\n  var meta={}; data.nodes.forEach(function(n){meta[n.id]=n;});\n  var statusKeys=[], statusCount={};\n  data.nodes.forEach(function(n){ if(!n.status) return; if(!statusCount[n.status]){statusCount[n.status]=0; statusKeys.push(n.status);} statusCount[n.status]++; });\n  var hidden={};\n  var zoomLabel=document.getElementById('zoom-label');\n  // 同一页携带两版布局（竖版/横版）。SVG 的 viewBox 自身会做一次 meet 缩放，\n  // 所以每版各自在元素像素空间维护 view{K,TX,TY}，apply 时再反解成 user 单位的 transform。\n  var VN=['portrait','landscape'], V={};\n  VN.forEach(function(n){\n    var s=document.getElementById('flow-svg-'+n);\n    if(!s) return;\n    var b=s.viewBox.baseVal;\n    V[n]={n:n, svg:s, vp:document.getElementById('vp-'+n), vw:b.width, vh:b.height, view:{K:1,TX:0,TY:0}, map:{s:1,cx:0,cy:0}, w:0, h:0};\n  });\n  var active='portrait', manual=false, sel=null, hits=0, drag=null, lastQuery='', searchHits=null;\n  // 触屏与鼠标的\"最近一次触摸时间\"：必须放在外层 —— window 上的 mouseup/mousemove 也要用它，\n  // 放在每个版式的循环里会让循环外的处理器抛 ReferenceError（点节点没反应、drag 清不掉）\n  var lastTouch=0;\n  function cur(){ return V[active]||V[VN[0]]; }\n  function measure(v){ var r=v.svg.getBoundingClientRect(); if(r.width<2||r.height<2) return false; v.w=r.width; v.h=r.height; v.map.s=Math.min(v.w/v.vw, v.h/v.vh); v.map.cx=(v.w-v.vw*v.map.s)/2; v.map.cy=(v.h-v.vh*v.map.s)/2; return true; }\n  function paint(v){ var k=v.view.K/v.map.s, tx=(v.view.TX-v.map.cx)/v.map.s, ty=(v.view.TY-v.map.cy)/v.map.s; v.vp.setAttribute('transform','translate('+tx+','+ty+') scale('+k+')');\n    // 自动简化 + 加深：只有**比\"适配\"再缩小到 85% 以下**才触发（适配时保持原样）\n    // 用相对值而不是\"文字 8.5px\"：大图的适配本身就已经很小，绝对阈值会让它一进页面就变深\n    v.svg.classList.toggle('zoomed-out', v.view.K < v.map.s * 0.85);\n  }\n  function paintActive(){ var v=cur(); paint(v); zoomLabel.textContent=Math.round(v.view.K/(v.map.s||1)*100)+'%'; }\n  function variantKey(v){ return (V.portrait===v)?'portrait':'landscape'; }\n  // A1：捏合/滚轮每一帧都会调到这里；直接写 localStorage 在手机上很卡，改成 300ms 防抖 + 关页面前补写一次\n  var zoomSaveTimer=null;\n  function rememberZoom(v){\n    var key='flowviz-zoom:'+SELF+':'+variantKey(v), k=v.view.K;\n    if(zoomSaveTimer) clearTimeout(zoomSaveTimer);\n    zoomSaveTimer=setTimeout(function(){ zoomSaveTimer=null; lsSet(key, {k:k, ts:Date.now()}); }, 300);\n  }\n  window.addEventListener('pagehide',function(){ if(zoomSaveTimer){ clearTimeout(zoomSaveTimer); zoomSaveTimer=null; } });\n  function fitAll(v){ v=v||cur(); if(!measure(v)) return; v.view.K=v.map.s; v.view.TX=v.map.cx; v.view.TY=v.map.cy; paintActive(); rememberZoom(v); }\n  function initial(v){\n    v=v||cur(); if(!measure(v)) return;\n    var contentAspect=v.vw/v.vh;\n    // ?zoom=0.45 固定缩放（截图/检查小比例下的可读性时用），默认仍按下面规则自动选\n    var zq=/[?&]zoom=([\\d.]+)/.exec(location.search);\n    if(zq&&Number(zq[1])>0){ var Kz=v.map.s*Number(zq[1]); v.view.K=Kz; v.view.TX=(v.w-v.vw*Kz)/2; v.view.TY=16; paintActive(); return; }\n    // ?fitcap=2.0 可临时改「竖版默认缩放上限」（默认 1.45 = 整幅适配的 1.45 倍）\n    var fc=/[?&]fitcap=([\\d.]+)/.exec(location.search);\n    var fcap=(fc&&Number(fc[1])>0)?Number(fc[1]):1.45;\n    var kAll=v.map.s, kWidth=v.w/v.vw*0.99, K;\n    // 横而扁的图（分栏后的横版）在窄屏上不要宽度撑满，否则会放大到只看得见一角；直接整幅适配\n    if(v.w/v.vw <= v.map.s*1.8 || contentAspect > 1.2){ K=kAll; }\n    // 竖版长流程：铺满宽度一屏只能看到四五个环节，所以给个上限（手机上更想先看清整体走向）\n    else { K=Math.min(kWidth, kAll*fcap); }\n    var zk=lsGet('flowviz-zoom:'+SELF+':'+variantKey(v));   // 上次手动缩放过的档位（换文件各记各的）\n    if(zk&&zk.k>0) K=Math.min(kAll*10, Math.max(kAll*0.08, zk.k));\n    v.view.K=K;\n    v.view.TX=(v.w-v.vw*K)/2;\n    v.view.TY=(v.vh*K<=v.h)?(v.h-v.vh*K)/2:16;\n    paintActive();\n  }\n  function zoomAt(v,mx,my,f){ if(!measure(v)) return; var K=Math.min(v.map.s*10, Math.max(v.map.s*0.08, v.view.K*f)); var s=K/v.view.K; v.view.TX=mx-(mx-v.view.TX)*s; v.view.TY=my-(my-v.view.TY)*s; v.view.K=K; paintActive(); rememberZoom(v); }\n  function zoomBy(f){ var v=cur(); if(!measure(v)) return; zoomAt(v, v.w/2, v.h/2, f); }\n  function autoVariant(){ var w=window.innerWidth, h=window.innerHeight; return (w<760 || w/h<1.08) ? 'portrait' : 'landscape'; }\n  function setVariant(name, refit, byUser){\n    if(!V[name]) return;\n    if(byUser) manual=true;\n    active=name;\n    document.getElementById('canvas').setAttribute('data-show', name);\n    document.querySelectorAll('[data-variant-btn]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-variant-btn')===name); });\n    if(refit) initial(); else { measure(cur()); paintActive(); }\n  }\n  window.addEventListener('resize',function(){\n    if(!manual){ var a=autoVariant(); if(a!==active){ setVariant(a,true); return; } }\n    initial();\n  });\n  function touchDist(e){ var a=e.touches[0], b=e.touches[1]; return Math.sqrt((a.clientX-b.clientX)*(a.clientX-b.clientX)+(a.clientY-b.clientY)*(a.clientY-b.clientY)); }\n  VN.forEach(function(n){\n    var v=V[n]; if(!v) return;\n    var pinch=null;\n    v.svg.addEventListener('wheel',function(e){ e.preventDefault(); var r=v.svg.getBoundingClientRect(); zoomAt(v, e.clientX-r.left, e.clientY-r.top, e.deltaY<0?1.12:1/1.12); },{passive:false});\n    v.svg.addEventListener('mousedown',function(e){\n      if(Date.now()-lastTouch<700) return;          // 触屏刚结束：这是浏览器补发的合成事件\n      drag={n:n,x:e.clientX,y:e.clientY,ox:v.view.TX,oy:v.view.TY,moved:false};\n    });\n    v.svg.addEventListener('dblclick',function(e){ if(!(e.target.closest&&e.target.closest('.node'))) fitAll(v); });\n    // 触屏：单指平移 / 双指缩放 / 轻点选中（手机上没有鼠标事件，必须单独处理）\n    v.svg.addEventListener('touchstart',function(e){\n      lastTouch=Date.now();\n      if(e.touches.length===1){ pinch=null; drag={n:n,x:e.touches[0].clientX,y:e.touches[0].clientY,ox:v.view.TX,oy:v.view.TY,moved:false}; }\n      else if(e.touches.length===2){ drag=null; pinch={d:touchDist(e)}; }\n    },{passive:true});\n    v.svg.addEventListener('touchmove',function(e){\n      if(!e.touches.length){ drag=null; pinch=null; return; }   // 手指都抬了还在收 move？直接结束\n      if(e.touches.length===2){\n        if(!measure(v)) return;\n        var r=v.svg.getBoundingClientRect();\n        var d=touchDist(e);\n        if(pinch&&pinch.d>0) zoomAt(v, (e.touches[0].clientX+e.touches[1].clientX)/2-r.left, (e.touches[0].clientY+e.touches[1].clientY)/2-r.top, d/pinch.d);\n        pinch={d:d}; e.preventDefault(); return;\n      }\n      if(drag&&drag.n===n&&e.touches.length===1){\n        var t=e.touches[0], dx=t.clientX-drag.x, dy=t.clientY-drag.y;\n        if(Math.abs(dx)+Math.abs(dy)>6) drag.moved=true;\n        v.view.TX=drag.ox+dx; v.view.TY=drag.oy+dy; paintActive(); e.preventDefault();\n      }\n    },{passive:false});\n    v.svg.addEventListener('touchend',function(e){\n      lastTouch=Date.now();\n      var wasPinch=!!pinch;\n      if(drag&&drag.n===n&&!drag.moved&&!wasPinch&&e.changedTouches.length){\n        var t=e.changedTouches[0], el=document.elementFromPoint(t.clientX,t.clientY);\n        var g=el&&el.closest?el.closest('.node'):null;\n        if(g) select(g.getAttribute('data-id')); else select(null);\n      }\n      if(!e.touches.length){ drag=null; pinch=null; }\n      else if(e.touches.length===1){\n        // A2：双指缩放时松开一根手指 —— 把拖动重新锚定到剩下的那根，\n        // 否则要么拖不动、要么用旧坐标算位移导致画面\"跳\"一下\n        pinch=null;\n        drag={n:n,x:e.touches[0].clientX,y:e.touches[0].clientY,ox:v.view.TX,oy:v.view.TY,moved:true};\n      }\n    });\n  });\n  // A3：触屏抬手后浏览器会补发一套 mousedown/mouseup，若不忽略，\"轻点\"会跑两遍（还会顺带起一次拖动）\n  window.addEventListener('mousemove',function(e){\n    if(!drag) return;\n    // 鼠标在动、但没有任何键被按住：\n    //   · 已经拖过（moved=true）→ 说明 mouseup 丢了/在窗口外松的手，直接结束拖动（治\"黏鼠标\"）\n    //   · 还没拖过 → 这是一个\"点击\"的中途，**不能**清 drag，否则随后的 mouseup 选不中节点（点节点没反应）\n    if(typeof e.buttons==='number' && e.buttons===0){\n      if(drag.moved) drag=null;\n      return;\n    }\n    var v=V[drag.n]; var dx=e.clientX-drag.x, dy=e.clientY-drag.y; if(Math.abs(dx)+Math.abs(dy)>6) drag.moved=true; v.view.TX=drag.ox+dx; v.view.TY=drag.oy+dy; paintActive(); });\n  window.addEventListener('mouseup',function(e){\n    // 注意：`drag=null` 必须无条件执行。之前把\"触屏后的合成事件\"判断写成了提前 return，\n    // 结果拖拽状态永远清不掉 —— 表现就是\"点一下图以后，图黏在鼠标上跟着走\"。\n    var synth = Date.now()-lastTouch<700;\n    if(!synth && drag&&!drag.moved&&drag.n===active){\n      var g=e.target.closest?e.target.closest('.node'):null;\n      if(g) select(g.getAttribute('data-id'));\n      else if(e.target.closest&&e.target.closest('svg')) select(null);\n    }\n    drag=null;\n  });\n  // 拖到窗口外松手 / 切走窗口时也要松开，否则回来还在\"黏着\"\n  window.addEventListener('blur',function(){ drag=null; });\n  document.addEventListener('visibilitychange',function(){ if(document.hidden) drag=null; });\n  window.addEventListener('pointercancel',function(){ drag=null; });\n  function esc(s){ return String(s==null?'':s).replace(/[&<>\"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]; }); }\n  function eachSvg(fn){ VN.forEach(function(n){ if(V[n]) fn(V[n].svg, n); }); }\n  // 节点键盘可达：给每个 node 加 tabindex/role/aria-label，Enter/空格＝点击选中\n  function wireNodeKeyboard(){\n    eachSvg(function(s,n){\n      s.querySelectorAll('.node').forEach(function(g){\n        var m=meta[g.getAttribute('data-id')]||{};\n        g.setAttribute('tabindex','0');\n        g.setAttribute('role','button');\n        g.setAttribute('aria-label', (m.label||m.id||'')+(m.statusLabel?'，'+m.statusLabel:'')+(m.time?'，'+m.time:''));\n      });\n      s.addEventListener('keydown',function(e){\n        var g=e.target.closest?e.target.closest('.node'):null;\n        if(g&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); select(g.getAttribute('data-id')); }\n      });\n    });\n  }\n  function relayout(){ VN.forEach(function(n){ if(V[n]) measure(V[n]); }); paintActive(); }\n  function setPanel(open){ document.body.classList.toggle('panel-open', !!open); relayout(); }\n  // C3：右栏画什么只由 sel 决定，统一从这里进（原来是 5 处各自写 renderPanel(null / meta[sel])）\n  function refreshPanel(){ renderPanel(sel ? meta[sel] : null); }\n  function select(id){\n    sel=id;\n    if(id) setPanel(true); else if(document.body.classList.contains('panel-open') && window.innerWidth<=600) setPanel(false);\n    eachSvg(function(s,n){\n      s.querySelectorAll('.node').forEach(function(x){ x.classList.remove('is-sel','is-dim'); });\n      s.querySelectorAll('.edge').forEach(function(p){ p.classList.remove('is-hi','is-dim'); p.setAttribute('marker-end','url(#arrow-'+n+')'); });\n      s.querySelectorAll('.edge-label-g').forEach(function(p){ p.classList.remove('is-hi','is-dim'); });\n    });\n    if(!id){ refreshPanel(); return; }\n    eachSvg(function(s,n){\n      s.querySelectorAll('.node').forEach(function(x){ if(x.getAttribute('data-id')!==id) x.classList.add('is-dim'); });\n      var g=s.querySelector('.node[data-id=\"'+CSS.escape(id)+'\"]'); if(g) g.classList.add('is-sel');\n      s.querySelectorAll('.edge').forEach(function(p){ var a=p.getAttribute('data-from'),b=p.getAttribute('data-to'); if(a===id||b===id){ p.classList.add('is-hi'); p.setAttribute('marker-end','url(#arrow-hi-'+n+')'); } else p.classList.add('is-dim'); });\n      s.querySelectorAll('.edge-label-g').forEach(function(p){ var a=p.getAttribute('data-from'),b=p.getAttribute('data-to'); if(a===id||b===id) p.classList.add('is-hi'); else p.classList.add('is-dim'); });\n    });\n    refreshPanel();\n  }\n  function renderOverview(){\n    var el=document.getElementById('detail');\n    var h='<div class=\"ov-kicker\">流程概览</div>';\n    if(searchHits&&searchHits.length){\n      h='<div class=\"hit-head\"><span class=\"sec\" style=\"margin:0\">搜索「'+esc(lastQuery)+'」命中 '+searchHits.length+' 处</span>';\n      h+='<span class=\"hit-nav\"><button data-hit-nav=\"-1\" title=\"上一个（↑ / Shift+Enter）\">↑</button>';\n      h+='<span class=\"hit-pos\">'+(hitIdx+1)+'/'+searchHits.length+'</span>';\n      h+='<button data-hit-nav=\"1\" title=\"下一个（↓ / Enter）\">↓</button></span></div>';\n      h+='<div class=\"hit-tip only-pc\">键盘 ↑ ↓（或 Enter / Shift+Enter）连着翻命中，Esc 清空</div>';\n      h+='<div class=\"hits\">'+searchHits.map(hitRow).join('')+'</div>';\n      h+='<label class=\"focus-toggle\"><input type=\"checkbox\" id=\"focus-on\"'+(focusOn?' checked':'')+'> 自动聚焦命中</label>';\n      h+='<div class=\"sec\">流程概览</div>';\n    }\n    h+='<h2 class=\"ov-title\">'+esc(data.title||'未命名流程')+'</h2>';\n    if(data.subtitle) h+='<p class=\"ov-sub\">'+esc(data.subtitle)+'</p>';\n    h+='<div class=\"stats\"><div class=\"stat\"><b>'+data.nodes.length+'</b><span>环节</span></div><div class=\"stat\"><b>'+data.edges.length+'</b><span>连接</span></div><div class=\"stat\"><b>'+data.groups.length+'</b><span>分组</span></div></div>';\n    if(statusKeys.length){\n      h+='<div class=\"sec\">按状态筛选</div><div class=\"pillcol\">';\n      statusKeys.forEach(function(s){ h+='<button class=\"ov-status'+(hidden[s]?' off':'')+'\" data-status=\"'+s+'\"><i class=\"dot st-'+s+'\"></i><span>'+esc(labelOf(s))+'</span><em>'+statusCount[s]+'</em></button>'; });\n      h+='</div>';\n    }\n    var focus=data.nodes.filter(function(n){ return n.status==='risk'||n.status==='hold'; });\n    if(focus.length){\n      h+='<div class=\"sec\">需关注（点击定位）</div>';\n      focus.forEach(function(n){ h+='<button class=\"ov-focus\" data-goto=\"'+esc(n.id)+'\"><span class=\"of-dot st-'+esc(n.status)+'\"></span><span class=\"of-label\">'+esc(n.label)+'</span><em>'+esc(n.statusLabel)+'</em></button>'; });\n    }\n    h+='<div class=\"sec\">图例</div><div class=\"klegend\">'+data.kinds.map(function(k){ return '<span class=\"kchip k-'+k.key+'\">'+esc(k.label)+'</span>'; }).join('')+'</div>';\n    h+='<p class=\"hint\"><span class=\"only-pc\">点节点看详情 · 滚轮缩放 · 拖拽平移 · 双击空白适配 · 搜索后 ↑↓ 翻命中 · Esc 取消选中</span><span class=\"only-touch\">点环节看详情 · 单指拖动 · 双指缩放 · 底部按钮可切竖/横版</span></p>';\n    el.innerHTML=h;\n    el.querySelectorAll('.ov-status').forEach(function(b){ b.onclick=function(){ toggleStatus(b.getAttribute('data-status')); }; });\n    el.querySelectorAll('[data-goto]').forEach(function(b){ b.onclick=function(){ select(b.getAttribute('data-goto')); }; });\n    el.querySelectorAll('[data-hit]').forEach(function(b){ b.onclick=function(){ hitIdx=Number(b.getAttribute('data-hit'))||0; focusHits(); renderPanel(null); }; });\n    el.querySelectorAll('[data-hit-nav]').forEach(function(b){ b.onclick=function(){ jumpHit(Number(b.getAttribute('data-hit-nav'))); }; });\n    var fo=document.getElementById('focus-on');\n    if(fo) fo.onchange=function(){ focusOn=fo.checked; if(focusOn) focusHits(); };\n  }\n  function labelOf(s){ return data.statusLabels[s]||s; }\n  function renderPanel(n){\n    var el=document.getElementById('detail');\n    if(!n){ renderOverview(); return; }\n    var h='<button class=\"back\" id=\"panel-back\">← 返回概览</button>';\n    h+='<div class=\"d-id\">'+esc(n.id)+'</div>';\n    h+='<h2 class=\"d-title\">'+esc(n.label)+'</h2>';\n    h+='<div class=\"chips\"><span class=\"chip k-'+esc(n.kind)+'\">'+esc(n.kindLabel||n.kind)+'</span>';\n    if(n.status) h+='<span class=\"chip st-'+esc(n.status)+'\"><i class=\"dot st-'+esc(n.status)+'\"></i>'+esc(n.statusLabel||n.status)+'</span>';\n    h+='</div>';\n    if(n.time) h+='<div class=\"kv\"><b>时间</b><span>'+esc(n.time)+'</span></div>';\n    if(n.owner) h+='<div class=\"kv\"><b>负责</b><span>'+esc(n.owner)+'</span></div>';\n    if(n.detail) h+='<div class=\"kv\"><b>说明</b><span>'+esc(n.detail).replace(/\\n/g,'<br>')+'</span></div>';\n    if(n.note) h+='<div class=\"kv note\"><b>注意</b><span>'+esc(n.note).replace(/\\n/g,'<br>')+'</span></div>';\n    h+='<div class=\"kv\"><b>上游</b><span>'+(n.preds.length?n.preds.map(linkOf).join(' '):'—')+'</span></div>';\n    h+='<div class=\"kv\"><b>下游</b><span>'+(n.succs.length?n.succs.map(linkOf).join(' '):'—')+'</span></div>';\n    el.innerHTML=h;\n    var b=document.getElementById('panel-back'); if(b) b.onclick=function(){ select(null); };\n    el.querySelectorAll('[data-goto]').forEach(function(x){ x.onclick=function(){ select(x.getAttribute('data-goto')); }; });\n  }\n  function linkOf(id){ var n=meta[id]; var t=n?n.label:id; return '<button class=\"jump\" data-goto=\"'+esc(id)+'\" title=\"'+esc(id)+'\">'+esc(t)+'</button>'; }\n  function toggleStatus(s){ if(hidden[s]){ delete hidden[s]; } else { hidden[s]=1; } applyFilter(); }\n  function applyFilter(){\n    eachSvg(function(s){ s.setAttribute('data-hide-status', Object.keys(hidden).join(' ')); });\n    document.querySelectorAll('.legend button').forEach(function(b){ if(hidden[b.getAttribute('data-status')]) b.classList.add('off'); else b.classList.remove('off'); });\n    if(!sel) renderOverview();\n  }\n  document.querySelectorAll('.legend button').forEach(function(b){ b.onclick=function(){ toggleStatus(b.getAttribute('data-status')); }; });\n  document.querySelectorAll('[data-variant-btn]').forEach(function(b){ b.onclick=function(){ setVariant(b.getAttribute('data-variant-btn'), true, true); }; });\n  document.getElementById('zoom-in').onclick=function(){ zoomBy(1.2); };\n  document.getElementById('zoom-out').onclick=function(){ zoomBy(1/1.2); };\n  document.getElementById('zoom-fit').onclick=function(){ fitAll(); };\n  var panelBtn=document.getElementById('panel-toggle');\n  if(panelBtn) panelBtn.onclick=function(){ var open=!document.body.classList.contains('panel-open'); setPanel(open); if(open) renderPanel(sel ? meta[sel] : null); };\n  var hitIdx=0, focusOn=true;\n  document.getElementById('search').addEventListener('input',function(e){\n    var q=e.target.value.trim().toLowerCase(); lastQuery=q; hits=0; hitIdx=0;\n    var shownSet={}, softSet={}, order=[];\n    eachSvg(function(s){\n      s.classList.toggle('searching', !!q);\n      s.querySelectorAll('.node').forEach(function(g){\n        var n=meta[g.getAttribute('data-id')]||{};\n        g.classList.remove('is-hit','is-hit-soft');\n        if(!q) return;\n        var shown=[n.label,n.id,n.time,n.owner].join(' ').toLowerCase();\n        var rest=[n.detail,n.note].join(' ').toLowerCase();\n        if(shown.indexOf(q)>=0){ g.classList.add('is-hit'); if(!shownSet[n.id]){ shownSet[n.id]=1; order.push(n.id); } }\n        else if(rest.indexOf(q)>=0){ g.classList.add('is-hit-soft'); if(!shownSet[n.id]&&!softSet[n.id]){ softSet[n.id]=1; order.push(n.id); } }\n      });\n    });\n    hits=order.length;\n    searchHits=q?order:null;\n    var softOnly=Object.keys(softSet).filter(function(id){ return !shownSet[id]; }).length;\n    document.getElementById('search-count').textContent=q?(hits+' 个匹配'+(softOnly?'（'+softOnly+' 个只在说明/备注里）':'')):'';\n    // 手机端结果清单默认藏在收起的抽屉里，搜到东西就自动弹出来（这是'搜了等于没提示'的根因）\n    // 产品决策：一旦开始搜索就回到\"命中清单\" —— 否则之前选中的节点详情会把命中清单挡住，只剩顶栏计数\n    if(q&&hits>0){\n      if(sel) select(null);       // 清掉选中态（手机上下面的 setPanel 会再把面板打开）\n      setPanel(true);\n      refreshPanel();\n    } else if(!sel) refreshPanel();\n    if(q&&hits>0&&focusOn) focusHits();\n  });\n  // 节点在画布(user)坐标系里的矩形。注意 getBBox() 返回的是节点自身局部坐标（0,0~w,h），\n  // 必须再加上该 <g> 的 translate(x,y)，否则聚焦会跳到画布左上角附近（踩过）。\n  function nodeBox(g){\n    var bb=g.getBBox();\n    var m=/translate\\(\\s*([-\\d.]+)[ ,]+([-\\d.]+)/.exec(g.getAttribute('transform')||'');\n    var tx=m?parseFloat(m[1]):0, ty=m?parseFloat(m[2]):0;\n    return {x:tx+bb.x, y:ty+bb.y, w:bb.width, h:bb.height};\n  }\n  function hitBox(ids){\n    var svg=cur().svg, x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;\n    ids.forEach(function(id){ var g=svg.querySelector('.node[data-id=\"'+CSS.escape(id)+'\"]'); if(!g) return;\n      var b=nodeBox(g); x0=Math.min(x0,b.x); y0=Math.min(y0,b.y); x1=Math.max(x1,b.x+b.w); y1=Math.max(y1,b.y+b.h); });\n    return isFinite(x0)?{x0:x0,y0:y0,x1:x1,y1:y1}:null;\n  }\n  function animateVp(){ var v=cur(); v.vp.classList.add('vp-anim'); clearTimeout(v._animT); v._animT=setTimeout(function(){ v.vp.classList.remove('vp-anim'); },320); }\n  function centerOn(id,scale){\n    var v=cur(); if(!measure(v)) return;\n    var g=v.svg.querySelector('.node[data-id=\"'+CSS.escape(id)+'\"]'); if(!g) return;\n    var b=nodeBox(g); var K=(scale||v.view.K);\n    animateVp();\n    v.view.K=K;\n    v.view.TX=v.w/2-((b.x+b.w/2)*K);\n    v.view.TY=v.h/2-((b.y+b.h/2)*K);\n    paintActive();\n  }\n  function focusHits(){\n    if(!searchHits||!searchHits.length) return;\n    var v=cur(); if(!measure(v)) return;\n    var box=hitBox(searchHits); if(!box) return;\n    var bw=box.x1-box.x0, bh=box.y1-box.y0;\n    var pad=90;\n    var kFit=Math.min((v.w-pad*2)/Math.max(bw,1), (v.h-pad*2)/Math.max(bh,1));\n    // 命中离得太远时不要为了'全都装下'把字缩没：低于当前 60% 就只居中到当前命中\n    if(searchHits.length===1 || kFit>=v.view.K*0.6){\n      var K=Math.min(kFit, v.view.K*2.2);\n      animateVp();\n      v.view.K=K;\n      v.view.TX=v.w/2-((box.x0+bw/2)*K);\n      v.view.TY=v.h/2-((box.y0+bh/2)*K);\n      paintActive();\n    } else {\n      centerOn(searchHits[hitIdx]||searchHits[0], v.view.K);\n    }\n  }\n  function jumpHit(d){\n    if(!searchHits||!searchHits.length) return;\n    hitIdx=(hitIdx+d+searchHits.length)%searchHits.length;\n    focusHits();\n    centerOn(searchHits[hitIdx], cur().view.K);\n    if(!sel) refreshPanel();\n    else select(searchHits[hitIdx]);\n    var row=document.querySelector('.hit-row.cur');\n    if(row&&row.scrollIntoView) row.scrollIntoView({block:'nearest'});\n  }\n  document.getElementById('search').addEventListener('keydown',function(e){\n    if(e.key==='ArrowDown'){ e.preventDefault(); jumpHit(1); }\n    else if(e.key==='ArrowUp'){ e.preventDefault(); jumpHit(-1); }\n    else if(e.key==='Enter'){ e.preventDefault(); jumpHit(e.shiftKey?-1:1); }\n    else if(e.key==='Escape'){ e.target.value=''; e.target.dispatchEvent(new Event('input')); e.target.blur(); }\n  });\n  function mark(text,q){ var i=String(text).toLowerCase().indexOf(q); if(i<0) return esc(text); return esc(String(text).slice(0,i))+'<mark>'+esc(String(text).slice(i,i+q.length))+'</mark>'+esc(String(text).slice(i+q.length)); }\n  function hitRow(id,i){\n    var n=meta[id]||{}, q=lastQuery;\n    var fields=[['标题',n.label],['id',n.id],['时间',n.time],['负责',n.owner],['说明',n.detail],['注意',n.note]];\n    var field='标题', text=n.label||'', soft=false;\n    for(var k=0;k<fields.length;k++){\n      var v=fields[k][1]||'';\n      if(String(v).toLowerCase().indexOf(q)>=0){ field=fields[k][0]; text=v; soft=(field==='说明'||field==='注意'); break; }\n    }\n    var idx=String(text).toLowerCase().indexOf(q);\n    var snip=(idx>26?'…':'')+String(text).slice(Math.max(0,idx-22), Math.max(0,idx-22)+54);\n    return '<button class=\"hit-row'+(soft?' soft':'')+(i===hitIdx?' cur':'')+'\" data-hit=\"'+i+'\"><span class=\"hr-n\">'+(i+1)+'</span>'\n      +'<span class=\"hr-main\"><span class=\"hr-label\">'+esc(n.label||id)+'<em>'+field+'</em></span>'\n      +'<span class=\"hr-snip\">'+mark(snip,q)+'</span></span></button>';\n  }\n  /* ── 全部流程图抽屉 ── */\n  var flows=(data.flows||[]).slice(), selfFile=data.selfFile||'';\n  function renderFlows(){\n    var el=document.getElementById('flows-list');\n    if(!flows.length){ el.innerHTML='<p class=\"hint\">同目录下还没找到其它由本 skill 生成的流程图。</p>'; return; }\n    el.innerHTML=flows.map(function(f){\n      var cur=(f.file===selfFile);\n      // 当前页不是链接：误点也不会原地不动，让人以为坏了\n      if(cur) return '<div class=\"flow-row cur\"><span class=\"fr-name\">'+esc(f.title||f.file)+'<span class=\"fr-cur\">当前</span></span>'\n        +'<span class=\"fr-meta\">'+f.nodes+' 环节 · '+f.edges+' 连接 · '+esc(f.mtime||'')+'</span></div>';\n      return '<a class=\"flow-row\" href=\"'+encodeURI(f.file)+'\"><span class=\"fr-name\">'+esc(f.title||f.file)+'</span>'\n        +'<span class=\"fr-meta\">'+f.nodes+' 环节 · '+f.edges+' 连接 · '+esc(f.mtime||'')+'</span></a>';\n    }).join('');\n  }\n  function openFlows(open){\n    var dr=document.getElementById('flows-drawer');\n    dr.classList.toggle('open', !!open);\n    dr.setAttribute('aria-hidden', open?'false':'true');\n    // inert 立刻生效（visibility 的过渡延迟会让\"打开即聚焦\"失效），关闭时整棵子树不可 Tab / 不可点\n    if('inert' in dr) dr.inert = !open;\n    document.getElementById('flows-toggle').setAttribute('aria-expanded', open?'true':'false');\n    document.getElementById('drawer-scrim').classList.toggle('open', !!open);\n    if(open){ renderFlows(); refreshFlows(); document.getElementById('flows-close').focus(); }\n    else if(document.activeElement&&dr.contains(document.activeElement)) document.getElementById('flows-toggle').focus();\n  }\n  function refreshFlows(){\n    if(location.protocol.indexOf('http')!==0) return;\n    fetch('流程索引.json?t='+Date.now()).then(function(r){ return r.ok?r.json():null; }).then(function(j){\n      if(j&&j.flows&&j.flows.length){ flows=j.flows; renderFlows(); }\n    }).catch(function(){});\n  }\n  document.getElementById('flows-toggle').onclick=function(){ openFlows(true); };\n  document.getElementById('flows-close').onclick=function(){ openFlows(false); };\n  document.getElementById('drawer-scrim').onclick=function(){ openFlows(false); };\n  function download(name,blob){ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500); }\n  function variantTag(){ return active==='portrait' ? '-竖版' : '-横版'; }\n  function svgSource(){\n    var v=cur(); var c=v.svg.cloneNode(true);\n    c.setAttribute('xmlns','http://www.w3.org/2000/svg'); c.removeAttribute('id');\n    // 导出件不带交互用的无障碍属性，保持与以前一致\n    c.querySelectorAll('[tabindex],[role],[aria-label]').forEach(function(x){ x.removeAttribute('tabindex'); x.removeAttribute('role'); x.removeAttribute('aria-label'); });\n    return '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n'+c.outerHTML;\n  }\n  document.getElementById('export-svg').onclick=function(){ download(data.slug+variantTag()+'.svg', new Blob([svgSource()],{type:'image/svg+xml'})); };\n  document.getElementById('export-png').onclick=function(){\n    var v=cur(); var src=svgSource(); var img=new Image(); var scale=2;\n    img.onload=function(){ var cv=document.createElement('canvas'); cv.width=v.vw*scale; cv.height=v.vh*scale; var cx=cv.getContext('2d'); cx.fillStyle=(document.documentElement.getAttribute('data-theme')==='light')?'#edf1f7':'#0e1116'; cx.fillRect(0,0,cv.width,cv.height); cx.drawImage(img,0,0,cv.width,cv.height); cv.toBlob(function(b){ if(b) download(data.slug+variantTag()+'.png',b); }); };\n    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(src);\n  };\n  var THEME_KEY='flowviz-theme', SELF=data.selfFile||decodeURIComponent(location.pathname.split('/').pop());\n  function lsGet(k){ try{ var v=localStorage.getItem(k); if(!v) return null; try{ return JSON.parse(v); }catch(e){ return {mode:v,ts:0}; } }catch(e){ return null; } }\n  function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }\n  function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }\n  function globalPref(){ return lsGet(THEME_KEY)||{mode:'system',ts:0}; }\n  function selfPref(){ return lsGet(THEME_KEY+':'+SELF); }\n  function lockPref(){ return lsGet('flowviz-lock:'+SELF); }\n  function systemTheme(){ return (window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark'; }\n  function effective(){\n    var lock=lockPref(); if(lock&&lock.locked) return {mode:lock.mode, src:'locked'};\n    var g=globalPref(), p=selfPref();\n    if(p&&p.ts>(g.ts||0)) return {mode:p.mode, src:'self'};\n    return {mode:g.mode||'system', src:'global'};\n  }\n  var toastTimer=null;\n  function toast(msg){\n    var el=document.getElementById('toast'); if(!el) return;\n    el.textContent=msg; el.classList.add('show');\n    if(toastTimer) clearTimeout(toastTimer);\n    toastTimer=setTimeout(function(){ el.classList.remove('show'); },2800);\n  }\n  function modeLabel(e){ return e.src==='locked' ? '已锁定' : (e.mode==='system'?'跟随系统':(e.mode==='dark'?'深色':'浅色')) + (e.src==='self'?'（这张图单独设的）':'（跟着首页「外观」设置）'); }\n  function applyTheme(){\n    var e=effective(); var d=(e.mode==='system')?systemTheme():e.mode;\n    document.documentElement.setAttribute('data-theme',d);\n    eachSvg(function(s){ s.setAttribute('data-theme',d); });\n    var locked=(e.src==='locked');\n    var lb=document.getElementById('lock');\n    if(lb){ lb.classList.toggle('on',locked); lb.title=locked?'这张图的颜色已锁定，点一下解锁':'锁定这张图的颜色（锁定后首页「外观」改不动它）';\n      var sp=lb.querySelector('span'); if(sp) sp.textContent=locked?'已锁定':'锁定颜色'; }\n    var b=document.getElementById('theme');\n    if(b){ b.classList.toggle('locked',locked); b.title=locked?'颜色已锁定：先点「锁定颜色」解锁，才能改':('当前：'+modeLabel(e)+'　点一下在这张图上切明/暗'); }\n  }\n  document.getElementById('theme').onclick=function(){\n    var e=effective();\n    if(e.src==='locked'){ toast('这张图的颜色已锁定，先点「锁定颜色」解锁'); return; }\n    var next=(document.documentElement.getAttribute('data-theme')==='light')?'dark':'light';\n    lsSet(THEME_KEY+':'+SELF,{mode:next,ts:Date.now()});\n    applyTheme();\n    toast('这张图已设为'+(next==='light'?'浅色':'深色')+'（后改的优先；改首页「显示设置」会再覆盖它）');\n  };\n  // 本地文件模式（双击打开）下浏览器只给纯文件名目录列表，所以指向生成的静态首页\n  var homeBtn=document.getElementById('home-btn');\n  if(homeBtn && location.protocol==='file:') homeBtn.setAttribute('href','./index.html');\n  var lockBtn=document.getElementById('lock');\n  if(lockBtn) lockBtn.onclick=function(){\n    var lock=lockPref();\n    if(lock&&lock.locked){ lsDel('flowviz-lock:'+SELF); toast('已解锁：这张图重新跟着首页「外观」走'); }\n    else { var cur=document.documentElement.getAttribute('data-theme'); lsSet('flowviz-lock:'+SELF,{locked:true,mode:cur,ts:Date.now()}); toast('已锁定当前颜色：改总设置或别处的颜色都不会影响这张图'); }\n    applyTheme();\n  };\n  if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').addEventListener){\n    matchMedia('(prefers-color-scheme: light)').addEventListener('change',function(){ applyTheme(); });\n  }\n  applyTheme();\n  // C2：首页/别的标签页改了外观设置 → 这个标签页立刻跟着变（localStorage 的 storage 事件只在别的标签页触发）\n  window.addEventListener('storage',function(e){ if(!e.key||e.key.indexOf('flowviz-')===0) applyTheme(); });\n  document.getElementById('mmd-toggle').onclick=function(){ document.getElementById('mmd-panel').classList.toggle('open'); };\n  document.getElementById('mmd-copy').onclick=function(){ var t=document.getElementById('mmd-src'); t.select(); var b=this; try{ document.execCommand('copy'); b.textContent='已复制'; }catch(err){ b.textContent='请手动复制'; } setTimeout(function(){ b.textContent='复制'; },1500); };\n  window.addEventListener('keydown',function(e){\n    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;\n    // 搜索出结果后，焦点不在输入框里（比如刚点过某条命中）也能用 ↑↓ 连续翻看\n    if((e.key==='ArrowDown'||e.key==='ArrowUp')&&searchHits&&searchHits.length){ e.preventDefault(); jumpHit(e.key==='ArrowDown'?1:-1); return; }\n    if(e.key==='+'||e.key==='='){ zoomBy(1.2); }\n    if(e.key==='-'){ zoomBy(1/1.2); }\n    if(e.key==='0'){ fitAll(); }\n    if(e.key==='Escape'){\n      var dr=document.getElementById('flows-drawer');\n      if(dr.classList.contains('open')){ openFlows(false); return; }\n      if(document.getElementById('mmd-panel').classList.contains('open')){ document.getElementById('mmd-panel').classList.remove('open'); return; }\n      select(null);\n    }\n  });\n  // 抽屉首屏就是关闭态：立刻 inert，免得 Tab 一上来就钻进屏外的链接\n  (function(){ var dr=document.getElementById('flows-drawer'); if(dr&&('inert' in dr)) dr.inert=true; })();\n  // B4：把\"开关态\"同步成 aria-pressed，读屏才念得出当前选中的版式 / 筛选项 / 是否锁定\n  function syncAria(){\n    document.querySelectorAll('[data-variant-btn]').forEach(function(b){\n      b.setAttribute('aria-pressed', b.classList.contains('on')?'true':'false');\n    });\n    document.querySelectorAll('.legend button[data-status]').forEach(function(b){\n      b.setAttribute('aria-pressed', b.classList.contains('off')?'false':'true');\n    });\n    var lk=document.getElementById('lock-btn');\n    if(lk) lk.setAttribute('aria-pressed', lk.classList.contains('on')?'true':'false');\n  }\n  document.addEventListener('click',function(){ setTimeout(syncAria,0); });\n  syncAria();\n  wireNodeKeyboard();\n  setVariant(autoVariant(), true);\n  refreshPanel();\n})();", "shell.html": "<!DOCTYPE html>\n<html lang=\"zh-CN\" data-theme=\"dark\" data-flow-viz=\"1\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<meta name=\"flow-viz\" content=\"1\">\n<meta name=\"flow-title\" content=\"{{titleMeta}}\">\n<meta name=\"flow-stats\" content=\"{{stats}}\">\n<meta name=\"flow-version\" content=\"{{flowVersion}}\">\n<title>{{titleTag}}</title>\n<script>\n/* 主题引导：必须在首帧前跑，否则会闪一下深色。\n   规则（后改的优先，与页面里 JS 完全一致）：\n     flowviz-theme          = {mode:'system|dark|light', ts}   总设置（首页「显示设置」写）\n     flowviz-theme:<文件名>  = {mode:'dark|light', ts}          单张图（页面上的明暗键写）\n     flowviz-lock:<文件名>   = {locked:true, mode:'dark|light'} 锁定后冻结该图颜色\n   有效值：锁定 → 冻结值；否则比较两张表的时间戳，谁新听谁的。*/\n(function(){try{\n  var SELF=decodeURIComponent(location.pathname.split('/').pop());\n  function g(k){ var v=localStorage.getItem(k); if(!v) return null; try{ return JSON.parse(v); }catch(e){ return {mode:v,ts:0}; } }\n  var lock=g('flowviz-lock:'+SELF), mode;\n  if(lock&&lock.locked) mode=lock.mode;\n  else {\n    var gp=g('flowviz-theme')||{mode:'system',ts:0};\n    var sp=g('flowviz-theme:'+SELF);\n    mode=(sp&&sp.ts>(gp.ts||0))?sp.mode:(gp.mode||'system');\n  }\n  var d=(mode==='system')?((window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark'):mode;\n  document.documentElement.setAttribute('data-theme', d==='light'?'light':'dark');\n}catch(e){}})();\n</script>\n<style>{{css}}</style>\n</head>\n<body>\n<header>\n  <div class=\"brand\"><span class=\"brand-dot\"></span><span class=\"brand-name\">{{brandName}}</span></div>\n  <label class=\"search\"><svg viewBox=\"0 0 16 16\"><circle cx=\"7.2\" cy=\"7.2\" r=\"4.2\"/><path d=\"M10.4 10.4L13.6 13.6\"/></svg><input id=\"search\" type=\"search\" aria-label=\"搜索环节 / 负责人 / 说明\" placeholder=\"搜索环节 / 负责人 / 说明\"></label>\n  <span id=\"search-count\" role=\"status\" aria-live=\"polite\"></span>\n  <a id=\"home-btn\" class=\"icon-btn\" href=\"./\" title=\"回到首页（流程图清单）\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M2.6 7.4L8 2.8l5.4 4.6\"/><path d=\"M4.2 7.2v5.9h7.6V7.2\"/><path d=\"M6.8 13.1V9.6h2.4v3.5\"/></svg><span>首页</span></a>\n  <button id=\"flows-toggle\" class=\"icon-btn flows-btn\" title=\"全部流程图\" aria-controls=\"flows-drawer\" aria-expanded=\"false\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 2.4l5.6 3-5.6 3-5.6-3z\"/><path d=\"M2.4 8.6l5.6 3 5.6-3M2.4 11.6l5.6 3 5.6-3\"/></svg><span>全部流程图</span></button>\n  <div class=\"legend\">{{legend}}</div>\n</header>\n<main>\n  <div id=\"canvas\" data-show=\"portrait\">{{svgPortrait}}{{svgLandscape}}</div>\n  <aside><div id=\"detail\"></div></aside>\n</main>\n<footer>\n  <div class=\"seg\">\n    <button data-variant-btn=\"portrait\" class=\"on\" title=\"竖版：适合手机，纵向滚动\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"4.6\" y=\"2.2\" width=\"6.8\" height=\"11.6\" rx=\"1.6\"/><path d=\"M7.4 11.6h1.2\"/></svg><span>竖版</span></button>\n    <button data-variant-btn=\"landscape\" title=\"横版：适合电脑，长流程自动分栏\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"2.2\" y=\"3\" width=\"11.6\" height=\"8\" rx=\"1.4\"/><path d=\"M6 13.4h4M8 11v2.4\"/></svg><span>横版</span></button>\n  </div>\n  <button id=\"panel-toggle\" class=\"icon-btn panel-btn\" title=\"概览\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"2.4\" y=\"3\" width=\"11.2\" height=\"10\" rx=\"1.4\"/><path d=\"M9.6 3v10\"/></svg><span>概览</span></button>\n  <div class=\"zoom-group\">\n    <button id=\"zoom-out\" class=\"icon-btn\" title=\"缩小\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3 8h10\"/></svg><span>缩小</span></button>\n    <span id=\"zoom-label\">100%</span>\n    <button id=\"zoom-in\" class=\"icon-btn\" title=\"放大\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3 8h10M8 3v10\"/></svg><span>放大</span></button>\n  </div>\n  <button id=\"zoom-fit\" class=\"icon-btn\" title=\"适配\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M3 6.5V3h3.5M13 9.5V13H9.5M10 3h3v3.5M6 13H3V9.5\"/></svg><span>适配</span></button>\n  <span class=\"sep\"></span>\n  <button id=\"export-svg\" class=\"icon-btn\" title=\"SVG\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 2.5v7.5M5.2 7.4L8 10.2l2.8-2.8M2.8 12.6h10.4\"/></svg><span>SVG</span></button>\n  <button id=\"export-png\" class=\"icon-btn\" title=\"PNG\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 2.5v7.5M5.2 7.4L8 10.2l2.8-2.8M2.8 12.6h10.4\"/></svg><span>PNG</span></button>\n  <span class=\"sep\"></span>\n  <button id=\"theme\" class=\"icon-btn\" title=\"明/暗\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 2.6a5.4 5.4 0 100 10.8A5.4 5.4 0 008 2.6z\"/><path d=\"M8 2.6v10.8\"/></svg><span>明/暗</span></button>\n  <button id=\"lock\" class=\"icon-btn lock-btn\" title=\"锁定颜色\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><rect x=\"3.4\" y=\"7.2\" width=\"9.2\" height=\"6.6\" rx=\"1.4\"/><path d=\"M5.6 7.2V5.4a2.4 2.4 0 014.8 0v1.8\"/></svg><span>锁定颜色</span></button>\n  <button id=\"mmd-toggle\" class=\"icon-btn\" title=\"Mermaid\"><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M6.2 4.4L3 8l3.2 3.6M9.8 4.4L13 8l-3.2 3.6\"/></svg><span>Mermaid</span></button>\n  <span class=\"foot-hint\"><span class=\"only-pc\">按屏幕自动选竖/横版 · 滚轮缩放 · 拖拽平移 · 双击空白适配 · Esc 取消选中 · 生成器 v{{flowVersion}} · 由 jimku233 制作 · B 站 @jimi绝不吐槽</span><span class=\"only-touch\">按屏幕自动选竖/横版 · 单指拖动 · 双指缩放 · 点环节看详情 · 生成器 v{{flowVersion}}</span></span>\n</footer>\n<div id=\"mmd-panel\">\n  <div style=\"display:flex;gap:8px;align-items:center;margin-bottom:8px\">\n    <b style=\"font-size:12.5px\">Mermaid 源码（可直接粘进飞书/语雀/GitHub/Typora）</b>\n    <button id=\"mmd-copy\" style=\"margin-left:auto\">复制</button>\n  </div>\n  <textarea id=\"mmd-src\" spellcheck=\"false\">{{mmd}}</textarea>\n</div>\n<div id=\"drawer-scrim\"></div>\n<div id=\"flows-drawer\" role=\"dialog\" aria-modal=\"true\" aria-label=\"全部流程图\" aria-hidden=\"true\">\n  <div class=\"fd-head\">本机的流程图<button id=\"flows-close\">✕</button></div>\n  <div id=\"flows-list\"></div>\n  <p class=\"fd-hint\">这里是同一目录下由本 skill 生成的所有流程图（按修改时间倒序）。用 HTTP 打开时会实时刷新；直接双击本地文件时用的是生成当时的清单。<b>如果这个 HTML 是被单独拷出来的</b>（同目录没有 index.html 与清单），右上角「首页」和这里会 404 —— 把整个目录一起拷/发过去就正常。</p>\n</div>\n<div id=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n<script id=\"flow-data\" type=\"application/json\">{{json}}</script>\n<script>\n{{js}}\n</script>\n</body>\n</html>\n", "svg.css": "\n    svg{--edge:#94a0b3;--edge-soft:#55627a;--edge-dim:#39424f;--grid:#2b3646;--card:#1c2431;\n      --hit:#4a9dff;\n      --t-label:#f3f6fb;--t-meta:#a3aec2;--t-title:#f7fafd;--t-sub:#a3aec2;\n      --n-task:#212a38;--n-task-s:#46536a;--n-dec:#2f2716;--n-dec-s:#c3a044;\n      --n-se:#173226;--n-se-s:#4aa06f;--n-risk:#311a1d;--n-risk-s:#b85c60;--n-mile:#1f2839;--n-mile-s:#7c90b8;\n      --dot-done:#46c886;--dot-doing:#5aa9ff;--dot-todo:#7b8698;--dot-risk:#f4676c;--dot-hold:#eab24a;--accent:#5aa9ff}\n    svg[data-theme='light']{--edge:#7d6c52;--edge-soft:#a8946f;--edge-dim:#b8a37c;--grid:#c6b28e;--card:#fffdf7;\n      --hit:#2b7fe0;\n      --t-label:#2b2721;--t-meta:#6f6553;--t-title:#221f1a;--t-sub:#6f6553;\n      --n-task:#fffdf7;--n-task-s:#8a7448;--n-dec:#fdf3da;--n-dec-s:#a8761a;\n      --n-se:#eef7ea;--n-se-s:#3f8556;--n-risk:#fbeae8;--n-risk-s:#b04e4e;--n-mile:#f6f0e3;--n-mile-s:#8f8168;\n      --dot-done:#35935f;--dot-doing:#2b7fe0;--dot-todo:#948a78;--dot-risk:#c9424a;--dot-hold:#bd7f16;--accent:#bf6b3a}\n    /* 浅色主题在\"缩小到看不清\"时自动再加深一档线条（笔迹 3.29→4.22、连线 3.71→4.28，只加一档、不跳到深色） */\n    svg[data-theme='light'].zoomed-out{--edge:#6f6049;--edge-soft:#8a7550;--edge-dim:#a08a63;\n      --n-task-s:#75603c;--n-dec-s:#96691a;--n-se-s:#357a4c;--n-risk-s:#a84848;--n-mile-s:#7f7156}\n    .canvas-grid{opacity:.9}\n    .grid-dot{fill:var(--grid)}\n    .t-accent{fill:var(--accent)}\n    .t-title{font:600 21px/1.25 var(--ff);fill:var(--t-title)}\n    .t-sub{font:400 12.5px/1.4 var(--ff);fill:var(--t-sub)}\n    .node{cursor:pointer}\n    .node .node-bg{stroke-width:1.5}\n    .node:hover .node-bg{stroke-width:2.3}\n  .node:focus{outline:none}\n  .node:focus-visible .node-bg{stroke:var(--accent);stroke-width:3;stroke-dasharray:none}\n    .node.k-task .node-bg,.node.k-milestone .node-bg{fill:var(--n-task);stroke:var(--n-task-s)}\n    .node.k-decision .node-bg{fill:var(--n-dec);stroke:var(--n-dec-s)}\n    .node.k-start .node-bg,.node.k-end .node-bg{fill:var(--n-se);stroke:var(--n-se-s)}\n    .node.k-risk .node-bg{fill:var(--n-risk);stroke:var(--n-risk-s);stroke-dasharray:6 4}\n    .node.k-milestone .node-bg{stroke-width:2}\n    .node .t-label{font:500 15px/1.35 var(--ff);fill:var(--t-label)}\n    .node .t-meta{font:400 11.5px/1.2 var(--ff);fill:var(--t-meta)}\n    .node .t-time{font:500 11px/1.2 var(--ff);fill:var(--t-meta)}\n    .node .time-pill{fill:var(--card);stroke:var(--edge-soft);stroke-width:1;opacity:.85}\n    .node .kind-glyph{font:600 10.5px/1 var(--ff);text-anchor:middle;dominant-baseline:central}\n    .node .kind-chip{stroke:none;opacity:.16}\n    .node .kind-ring{fill:none;stroke-width:1.2}\n    .node .accent{stroke:none}\n    .st-done .accent,.st-done .kind-chip{fill:var(--dot-done)} .st-done .kind-ring{stroke:var(--dot-done)} .st-done .kind-glyph{fill:var(--dot-done)}\n    .st-doing .accent,.st-doing .kind-chip{fill:var(--dot-doing)} .st-doing .kind-ring{stroke:var(--dot-doing)} .st-doing .kind-glyph{fill:var(--dot-doing)}\n    .st-todo .accent,.st-todo .kind-chip{fill:var(--dot-todo)} .st-todo .kind-ring{stroke:var(--dot-todo)} .st-todo .kind-glyph{fill:var(--dot-todo)}\n    .st-risk .accent,.st-risk .kind-chip{fill:var(--dot-risk)} .st-risk .kind-ring{stroke:var(--dot-risk)} .st-risk .kind-glyph{fill:var(--dot-risk)}\n    .st-hold .accent,.st-hold .kind-chip{fill:var(--dot-hold)} .st-hold .kind-ring{stroke:var(--dot-hold)} .st-hold .kind-glyph{fill:var(--dot-hold)}\n    .st-none .accent,.st-none .kind-chip{fill:var(--edge-soft)} .st-none .kind-ring{stroke:var(--edge-soft)} .st-none .kind-glyph{fill:var(--t-meta)}\n    .edge{fill:none;stroke:var(--edge);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n    .edge.dashed{stroke-dasharray:5 5}\n    .edge-label-bg{fill:var(--card);stroke:var(--edge-soft);stroke-width:1}\n    .edge-label{font:500 11.5px/1.2 var(--ff);fill:var(--t-meta);text-anchor:middle}\n    .band-bg{stroke-width:1.2}\n  /* 分组带标题/步数：深色沿用组色（亮色在深底上清楚）；浅色把组色混到 53% 才够 4.5:1\n     （原色对 7.5% 组色浅底只有 1.31–2.08:1；混深后六个调色板色 4.53–4.58:1） */\n  svg[data-theme='light'] .band-label,\n  svg[data-theme='light'] .band-count{fill:color-mix(in srgb, var(--c, currentColor) 53%, #241f19)}\n  /* 分组带标题/步数：深色沿用组色（亮色在深底上清楚）；浅色把组色混到 41% 才够 4.5:1\n     （原色对 7.5% 组色浅底只有 1.31–2.08:1；混深后六个调色板色 4.53–4.58:1） */\n  svg[data-theme='light'] .band-label,\n  svg[data-theme='light'] .band-count{fill:color-mix(in srgb, var(--c, currentColor) 41%, #241f19);opacity:1}\n    .band-pill{stroke:none;opacity:.16}\n    .band-label{font:600 12px/1.2 var(--ff)}\n    .band-count{font:400 11px/1.2 var(--ff)}\n    .node.is-dim,.edge.is-dim,.edge-label-g.is-dim{opacity:.12}\n    /* 缩小到看不清小字时自动\"简化\"：藏掉药丸/小字/底纹，加粗描边，只留框+标题+线 */\n    svg.zoomed-out .time-pill,svg.zoomed-out .t-time,svg.zoomed-out .t-meta{display:none}\n    svg.zoomed-out .canvas-grid{display:none}\n    svg.zoomed-out .node .node-bg{stroke-width:2.6}\n    svg.zoomed-out .node.k-milestone .node-bg{stroke-width:3}\n    svg.zoomed-out .node.k-risk .node-bg{stroke-width:2.6;stroke-dasharray:7 5}\n    svg.zoomed-out .band-bg{fill-opacity:.05}\n    svg.zoomed-out .edge{stroke-width:2.2}\n    svg.zoomed-out .edge-label-bg{display:none}\n    svg.zoomed-out .edge-label{font-size:13px}\n    .node.is-sel .node-bg{stroke-width:2.4;filter:url(#selGlow-{{vid}})}\n    svg[data-theme='light'] .node.is-sel .node-bg{filter:url(#selGlowWarm-{{vid}})}\n    .node.is-hit .node-bg{stroke:var(--hit);stroke-width:2.4}\n    /* D2：软命中改成\"点线\"，避免和风险点节点的虚线（6 4）看起来是一回事 */\n  .node.is-hit-soft .node-bg{stroke:var(--dot-hold);stroke-width:2.2;stroke-dasharray:2 3.5;stroke-linecap:round}\n    .edge.is-hi{stroke:var(--accent);stroke-width:2.4}\n    .edge-label-g.is-hi .edge-label{fill:var(--accent)}\n    svg[data-hide-status~='done'] .node.st-done,\n    svg[data-hide-status~='doing'] .node.st-doing,\n    svg[data-hide-status~='todo'] .node.st-todo,\n    svg[data-hide-status~='risk'] .node.st-risk,\n    svg[data-hide-status~='hold'] .node.st-hold{opacity:.12;filter:grayscale(1)}\n  "};

/**
 * flow.mjs — 把业务流程渲染成「Mermaid 源码 + 自包含交互式 HTML 流程图」。
 *
 * 设计约束（重要）：
 *   1. 零依赖：只用 node: 内置模块，不需要 npm install。
 *   2. 纯离线：不引用任何 CDN。布局与渲染都是本文件自己实现的 SVG，
 *      不依赖 mermaid.js —— 所以断网、内网、无外网环境下都能出图。
 *   3. 产物自包含：导出的 .svg 内含 <style>，单独发给别人也能正确显示。
 *
 * 用法：
 *   node flow.mjs render  <spec.json|spec.mmd> [--out x.html] [--svg x.svg] [--mmd x.mmd] [--all]
 *   node flow.mjs mermaid <spec.json> [--out x.mmd]
 *   node flow.mjs check   <spec.json|spec.mmd>
 *   node flow.mjs sample  [--out sample.json]
 *   node flow.mjs help
 */


/** 渲染器版本：写进产物与清单，首页据此标出"旧版渲染"的文件。改了渲染/前端行为就+1。 */
const FLOW_VERSION = '1.2.3';

// ── 前端资源：放在 ../assets/，渲染时内联回产物，保证产物仍是**自包含单文件 HTML** ──
const ASSET_DIR = '';
const loadAsset = (name) => {
  if (!(name in __ASSETS)) throw new Error('内联资源缺失: ' + name);
  return __ASSETS[name];
};

/** 同目录流程图清单的文件名：页面里的「全部流程图」抽屉会读它。 */
const FLOW_MANIFEST = '流程索引.json';

// ─────────────────────────────────────────────────────────────
// 常量
// ─────────────────────────────────────────────────────────────

const CHAR_W = 15;          // 一个全角字 = 15px（font-size 15 时）
const LINE_H = 21;          // 正文行高
const NODE_PAD_X = 24;      // 节点左右内边距（单侧）
const V_GAP = 84;           // 层与层之间的垂直间距（含分组标题所需的呼吸感）
const H_GAP = 34;           // 同层节点之间的水平间距
const MAX_W = 420;
const MIN_W = 150;
const WRAP_UNITS = 16;      // 正文折行宽度（全角字数）
const WRAP_UNITS_DECISION = 12;  // 菱形会按文字自动放大，这里给宽一些避免「问题?」这种断行

const KINDS = new Set(['task', 'decision', 'start', 'end', 'risk', 'milestone']);
const STATUSES = new Set(['done', 'doing', 'todo', 'risk', 'hold']);

const STATUS_LABEL = {
  done: '已完成',
  doing: '进行中',
  todo: '待开始',
  risk: '需人工把关',
  hold: '阻塞/等素材',
};

const KIND_LABEL = {
  task: '环节',
  decision: '判断',
  start: '起点',
  end: '终点',
  risk: '风险点',
  milestone: '关键检查点',
};

const GROUP_PALETTE = ['#4aa3ff', '#3fbf7f', '#e0a030', '#c084fc', '#ef6b6b', '#2dd4bf'];

// ─────────────────────────────────────────────────────────────
// 小工具
// ─────────────────────────────────────────────────────────────

const isCJK = (ch) =>
  /[\u1100-\u115F\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch);

/** 文本的显示宽度，单位：全角字。 */
function units(s) {
  let u = 0;
  for (const ch of String(s)) u += isCJK(ch) ? 1 : 0.55;
  return u;
}

/** 估算一段文字的实际像素宽度（用于"把药丸+计数整组居中"这类对位计算，全角=字号、半角≈0.56、空格≈0.3）。 */
function textW(s, size) {
  let w = 0;
  for (const ch of String(s)) w += isCJK(ch) ? size : (ch === ' ' ? size * 0.3 : size * 0.56);
  return w;
}

/** 按全角字宽折行；先按显式 \n 分段。 */
function wrapText(text, maxUnits) {
  const out = [];
  for (const para of String(text ?? '').split('\n')) {
    if (para === '') { out.push(''); continue; }
    let line = '';
    let w = 0;
    for (const ch of para) {
      const cw = isCJK(ch) ? 1 : 0.55;
      if (w + cw > maxUnits && line !== '') { out.push(line); line = ch; w = cw; }
      else { line += ch; w += cw; }
    }
    out.push(line);
  }
  return out.length ? out : [''];
}

const clamp = (lo, hi, v) => Math.min(hi, Math.max(lo, v));

function xml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fail(msg) {
  process.stderr.write('flow: ' + msg + '\n');
  process.exit(2);
}

// ─────────────────────────────────────────────────────────────
// 输入解析
// ─────────────────────────────────────────────────────────────

/**
 * 解析 Mermaid 的 flowchart/graph 子集。
 * 支持：flowchart TD|TB|LR、A[文本]、A(文本)、A{判断}、A((圆))、A[[子程序]]、
 *      -->、-.->、==>、---、-->|标签|、链式 A --> B --> C、subgraph ... end、%% 注释。
 */
// 当前 CLI 一次只处理一个输入；保留原文用于 JSON 结构错误的行列定位。
let activeSource = { file: '<输入>', text: '' };

function locAt(text, offset, baseLine = 1, baseCol = 1) {
  let line = baseLine, col = baseCol;
  const end = Math.max(0, Math.min(Number.isFinite(offset) ? offset : 0, text.length));
  for (let i = 0; i < end; i++) {
    if (text[i] === '\n') { line++; col = 1; }
    else col++;
  }
  return { line, col };
}

function failAt(file, line, col, message) {
  fail(`${file || '<输入>'}:${line}:${col}: ${message}`);
}

function sourceFail(message, hint = {}) {
  const src = activeSource || { file: '<输入>', text: '' };
  const text = src.text || '';
  let offset = 0;
  if (hint.offset !== undefined) offset = hint.offset;
  else if (hint.property) {
    const escaped = hint.property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('"' + escaped + '"\\s*:\\s*', 'g');
    let m;
    while ((m = re.exec(text))) {
      const value = hint.value === undefined ? null : JSON.stringify(hint.value);
      if (value === null || text.startsWith(value, re.lastIndex)) { offset = m.index; break; }
    }
  } else if (hint.value !== undefined) {
    const needle = JSON.stringify(hint.value);
    const found = text.indexOf(needle);
    if (found >= 0) offset = found;
  }
  const at = locAt(text, offset, 1, 1);
  failAt(src.file, at.line, at.col, message);
}

function scanStatements(source, file, lineOffset = 0) {
  const statements = [];
  let buffer = '', hasStart = false;
  let line = 1 + lineOffset, col = 1;
  let startLine = line, startCol = col;
  let quote = null, quoteOffset = -1, escaped = false;
  let pipeLabel = false, pipeLabelOffset = -1;
  const stack = [];
  const append = (ch) => {
    if (!hasStart) { hasStart = true; startLine = line; startCol = col; }
    buffer += ch;
  };
  const emit = () => {
    if (buffer.trim()) statements.push({ text: buffer, line: startLine, col: startCol });
    buffer = '';
    hasStart = false;
  };
  const matching = { '(': ')', '[': ']', '{': '}' };
  const isOpen = (ch) => Object.prototype.hasOwnProperty.call(matching, ch);
  const canStartQuote = (i) => {
    let j = i - 1;
    while (j >= 0 && /[ \t\r]/.test(source[j])) j--;
    if (j < 0 || source[j] === '\n' || source[j] === '|' || isOpen(source[j])) return true;
    // subgraph "带空格的标题"：引号前是空白，且本段还没出现节点形状。
    return /[ \t]/.test(source[i - 1] || '') && /(?:^|\s)subgraph\s*$/i.test(buffer.trimEnd());
  };

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (pipeLabel) {
      append(ch);
      if (ch === '|') pipeLabel = false;
      if (ch === '\n') { line++; col = 1; } else col++;
      continue;
    }
    if (!quote && stack.length === 0 && ch === '|' && /(?:-->|-\.->|==>|---|-\.-|--x|--o)\s*$/.test(buffer.trimEnd())) {
      append(ch); pipeLabel = true; pipeLabelOffset = i; col++; continue;
    }
    if (quote) {
      append(ch);
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      if (ch === '\n') { line++; col = 1; } else col++;
      continue;
    }

    if (!quote && stack.length === 0 && buffer.trim() === '' && source.startsWith('%%', i)) {
      const nl = source.indexOf('\n', i);
      if (nl < 0) { emit(); break; }
      emit(); i = nl; line++; col = 1; continue;
    }
    if ((ch === '"' || ch === "'") && canStartQuote(i)) {
      append(ch); quote = ch; quoteOffset = i;
      col++;
      continue;
    }
    if (ch === '\n') {
      if (stack.length === 0) emit();
      else append(ch);
      line++; col = 1;
      continue;
    }
    if (ch === ';' && stack.length === 0) {
      emit(); col++;
      continue;
    }
    append(ch);
    if (isOpen(ch)) stack.push({ close: matching[ch], line, col, offset: i });
    else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.length && stack[stack.length - 1].close === ch) stack.pop();
    }
    col++;
  }

  if (pipeLabel) {
    const at = locAt(source, pipeLabelOffset, 1 + lineOffset, 1);
    failAt(file, at.line, at.col, '未闭合的连线标签');
  }
  if (quote) {
    const at = locAt(source, quoteOffset, 1 + lineOffset, 1);
    failAt(file, at.line, at.col, '未闭合的引号');
  }
  if (stack.length) {
    const open = stack[0];
    failAt(file, open.line, open.col, '未闭合的节点/语法形状括号');
  }
  emit();
  return statements;
}

const NODE_ID_RE = /^[A-Za-z0-9_\u4e00-\u9fff][\w\u4e00-\u9fff.\-]*/;
const LINK_TOKENS = ['-.->', '==>', '-->', '---', '-.-', '--x', '--o'];

function offsetLoc(stmt, offset) {
  return locAt(stmt.text, offset, stmt.line, stmt.col);
}

function syntaxFail(file, stmt, offset, message) {
  const actualOffset = offset === 0 ? Math.max(0, stmt.text.search(/\S/)) : offset;
  const at = offsetLoc(stmt, actualOffset);
  failAt(file, at.line, at.col, message);
}

function unquoteLabel(label) {
  const t = String(label).trim();
  if (t.length >= 2 && ((t[0] === '"' && t.at(-1) === '"') || (t[0] === "'" && t.at(-1) === "'"))) {
    return t.slice(1, -1).replace(/\\(["'\\])/g, '$1').replace(/&quot;/g, '"').trim();
  }
  return t.replace(/&quot;/g, '"');
}

function splitLinks(stmt, file) {
  const text = stmt.text;
  const segments = [];
  const links = [];
  const stack = [];
  const matching = { '(': ')', '[': ']', '{': '}' };
  let quote = null, escaped = false, start = 0, pipeLabel = false;
  const canStartQuote = (i) => {
    let j = i - 1;
    while (j >= 0 && /[ \t\r]/.test(text[j])) j--;
    return j < 0 || text[j] === '|' || Object.prototype.hasOwnProperty.call(matching, text[j]) || (/[ \t]/.test(text[i - 1] || '') && /(?:^|\s)subgraph\s*$/i.test(text.slice(0, i).trimEnd()));
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (pipeLabel) { if (ch === '|') pipeLabel = false; continue; }
    if (!quote && stack.length === 0 && ch === '|' && /(?:-->|-\.->|==>|---|-\.-|--x|--o)\s*$/.test(text.slice(0, i).trimEnd())) { pipeLabel = true; continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if ((ch === '"' || ch === "'") && canStartQuote(i)) { quote = ch; continue; }
    if (Object.prototype.hasOwnProperty.call(matching, ch)) { stack.push(matching[ch]); continue; }
    if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.length && stack[stack.length - 1] === ch) stack.pop();
      continue;
    }
    if (stack.length) continue;
    const op = LINK_TOKENS.find((token) => text.startsWith(token, i));
    if (op) {
      segments.push({ text: text.slice(start, i), offset: start });
      links.push({ text: op, offset: i });
      i += op.length - 1;
      start = i + 1;
    }
  }
  segments.push({ text: text.slice(start), offset: start });
  if (!links.length) return { segments, links };
  if (segments.length !== links.length + 1) syntaxFail(file, stmt, 0, '不完整的连线语句');
  return { segments, links };
}

function parseNodeExpr(raw, stmt, file, baseOffset) {
  const lead = raw.length - raw.trimStart().length;
  const text = raw.trim();
  const offset = baseOffset + lead;
  if (!text) syntaxFail(file, stmt, offset, '缺少节点');
  const idMatch = NODE_ID_RE.exec(text);
  if (!idMatch) syntaxFail(file, stmt, offset, '不支持的语法：节点必须以合法 id 开始');
  const id = idMatch[0];
  let pos = id.length;
  while (pos < text.length && /\s/.test(text[pos])) pos++;
  if (pos === text.length) return { id, label: undefined, kind: undefined };

  const rest = text.slice(pos);
  let open = '', close = '', kind = 'task';
  if (rest.startsWith('[[')) { open = '[['; close = ']]'; }
  else if (rest.startsWith('{{')) { open = '{{'; close = '}}'; }
  else if (rest.startsWith('((')) { open = '(('; close = '))'; kind = 'circle'; }
  else if (rest.startsWith('[')) { open = '['; close = ']'; }
  else if (rest.startsWith('(')) { open = '('; close = ')'; }
  else if (rest.startsWith('{')) { open = '{'; close = '}'; kind = 'decision'; }
  else syntaxFail(file, stmt, offset + pos, '不支持的节点语法（形状后存在多余内容）');

  const closers = { '(': ')', '[': ']', '{': '}' };
  const shapeStack = [...open].map((ch) => closers[ch]).reverse();
  let quote = null, escaped = false, end = -1;
  for (let i = open.length; i < rest.length; i++) {
    const ch = rest[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    let j = i - 1;
    while (j >= 0 && /[ \t\r]/.test(rest[j])) j--;
    if ((ch === '"' || ch === "'") && (j < 0 || Object.prototype.hasOwnProperty.call(closers, rest[j]) || /\s/.test(rest[i - 1] || ''))) {
      quote = ch; continue;
    }
    if (Object.prototype.hasOwnProperty.call(closers, ch)) { shapeStack.push(closers[ch]); continue; }
    if (ch === ')' || ch === ']' || ch === '}') {
      if (shapeStack.at(-1) !== ch) syntaxFail(file, stmt, offset + pos + i, '节点形状括号不匹配');
      shapeStack.pop();
      if (!shapeStack.length) { end = i; break; }
    }
  }
  if (quote) syntaxFail(file, stmt, offset + pos + rest.length - 1, '未闭合的节点标签引号');
  if (end < 0) syntaxFail(file, stmt, offset + pos, '未闭合的节点形状');
  if (rest.slice(end + 1).trim()) syntaxFail(file, stmt, offset + pos + end + 1, '节点形状后存在多余内容');

  const closeStart = end - close.length + 1;
  let label = rest.slice(open.length, closeStart).trim();
  // Mermaid 的圆括号单层形式按普通环节处理；只有 ((...)) 走圆形节点语义。
  if (open === '(') kind = 'task';
  label = unquoteLabel(label);
  return { id, label, kind };
}

function parseMermaid(text, file = '<输入>', lineOffset = 0) {
  const source = String(text);
  const spec = { title: '', subtitle: '', direction: 'TD', nodes: [], edges: [], groups: [] };
  const nodes = new Map();
  const groupStack = [];

  const touch = (id, label, kind) => {
    let n = nodes.get(id);
    if (!n) {
      n = { id, label: id, kind: undefined };
      nodes.set(id, n);
      spec.nodes.push(n);
    }
    if (label !== undefined && label !== '') n.label = label;
    if (kind !== undefined) n.kind = kind;
    return n;
  };
  const addToGroup = (id) => {
    const g = groupStack.at(-1);
    if (g && !g.members.includes(id)) g.members.push(id);
  };
  const statements = scanStatements(source, file, lineOffset);
  const ignoredDirectives = [];

  for (const stmt of statements) {
    const line = stmt.text.trim();
    if (!line || line.startsWith('%%')) continue;
    let m;

    if (/^(?:flowchart|graph)\b/i.test(line)) {
      m = /^(?:flowchart|graph)\s+(TD|TB|BT|LR|RL)?\s*$/i.exec(line);
      if (!m) syntaxFail(file, stmt, 0, '无效的 flowchart/graph 声明；方向应为 TD、TB、BT、LR 或 RL');
      const d = (m[1] || 'TD').toUpperCase();
      spec.direction = d === 'LR' || d === 'RL' ? 'LR' : 'TD';
      continue;
    }
    // 对渲染语义无影响的真实 Mermaid 指令：忽略（并计数提示），不当语法错误。
    // 这样从别处粘来的片段（常带 classDef / style / click）也能直接渲染。
    if (/^(?:classDef|class|style|linkStyle|click|direction|accTitle|accDescr)\b/i.test(line)) {
      ignoredDirectives.push(line.split(/\s+/)[0].replace(/:$/, ''));
      continue;
    }
    if (/^subgraph\b/i.test(line)) {
      m = /^subgraph\s+(.+?)\s*$/i.exec(line);
      if (!m) syntaxFail(file, stmt, 0, 'subgraph 必须提供分组名称');
      const label = unquoteLabel(m[1]);
      const g = { id: 'g' + (spec.groups.length + 1), label, members: [], _loc: offsetLoc(stmt, stmt.text.search(/subgraph/i)) };
      spec.groups.push(g);
      groupStack.push(g);
      continue;
    }
    if (/^end$/i.test(line)) {                       // 只有**光杆** end 才是分组结束
      if (!groupStack.length) syntaxFail(file, stmt, 0, '存在没有匹配 subgraph 的 end');
      groupStack.pop();
      continue;
    }
    // 注意：`end((终点))` 这种是「节点 id 恰好叫 end」（真实流程里很常见），要继续往下按节点解析

    const { segments, links } = splitLinks(stmt, file);
    if (!segments.length) continue;
    if (segments.length === 1 && !segments[0].text.trim()) syntaxFail(file, stmt, 0, '空语句');

    let previous = null;
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      let nodeText = segment.text;
      let nodeOffset = segment.offset;
      let edgeLabel;
      const leading = nodeText.length - nodeText.trimStart().length;
      const trimmed = nodeText.trim();
      if (i > 0) {
        const labelMatch = /^\|([^|]*)\|\s*/.exec(trimmed);
        if (labelMatch) {
          edgeLabel = unquoteLabel(labelMatch[1]).replace(/\u2223/g, '|');
          nodeOffset += leading + labelMatch[0].length;
          nodeText = trimmed.slice(labelMatch[0].length);
        }
      } else if (trimmed.startsWith('|')) {
        syntaxFail(file, stmt, segment.offset + leading, '连线标签必须跟在连线操作符后面');
      }
      const node = parseNodeExpr(nodeText, stmt, file, nodeOffset);
      touch(node.id, node.label, node.kind);
      addToGroup(node.id);
      if (previous) {
        const link = links[i - 1];
        if (!link) syntaxFail(file, stmt, segment.offset, '缺少连线操作符');
        spec.edges.push({
          from: previous.id,
          to: node.id,
          label: edgeLabel || undefined,
          style: link.text.includes('.') ? 'dashed' : 'solid',
        });
      }
      previous = node;
    }
  }

  if (groupStack.length) {
    const g = groupStack.at(-1);
    const loc = g._loc || { line: 1 + lineOffset, col: 1 };
    failAt(file, loc.line, loc.col, 'subgraph 未与 end 配对：缺少 end');
  }
  spec.edges = spec.edges || [];
  if (ignoredDirectives.length) {
    spec.ignoredDirectives = [...new Set(ignoredDirectives)];
  }
  return spec;
}
/** 从 .md 中抽出 ```mermaid 代码块；没有就整篇当 mermaid。保留原文行偏移。 */
function extractMermaid(text) {
  const m = /```mermaid[ \t]*\r?\n([\s\S]*?)```/i.exec(text);
  if (!m) return { text, lineOffset: 0 };
  const contentAt = m.index + m[0].indexOf('\n') + 1;
  return { text: m[1], lineOffset: (text.slice(0, contentAt).match(/\n/g) || []).length };
}

function loadSpec(file) {
  if (!existsSync(file)) failAt(file, 1, 1, '输入文件不存在');
  const text = readFileSync(file, 'utf8');
  const ext = extname(file).toLowerCase();
  activeSource = { file, text };
  if (ext === '.json') {
    try {
      return JSON.parse(text);
    } catch (e) {
      let offset;
      const pos = /position\s+(\d+)/i.exec(String(e?.message || ''));
      if (pos) offset = Number(pos[1]);
      const lc = /line\s+(\d+)\s+column\s+(\d+)/i.exec(String(e?.message || ''));
      if (offset === undefined && lc) {
        const lines = text.split(/\n/);
        offset = 0;
        for (let i = 0; i < Number(lc[1]) - 1 && i < lines.length; i++) offset += lines[i].length + 1;
        offset += Math.max(0, Number(lc[2]) - 1);
      }
      const at = locAt(text, offset === undefined ? 0 : offset, 1, 1);
      failAt(file, at.line, at.col, 'JSON 解析失败：' + e.message);
    }
  }
  if (ext === '.md' || ext === '.markdown') {
    const extracted = extractMermaid(text);
    const parsed = parseMermaid(extracted.text, file, extracted.lineOffset);
    activeSource = { file, text };
    noteIgnored(parsed);
    return parsed;
  }
  const parsed = parseMermaid(text, file, 0);
  activeSource = { file, text };
  noteIgnored(parsed);
  return parsed;
}

/** 解析时忽略掉的"无害 Mermaid 指令"提示一句——在 loadSpec 里说，避免被 normalize 重建对象时丢掉。 */
function noteIgnored(spec) {
  if (spec && spec.ignoredDirectives && spec.ignoredDirectives.length) {
    process.stdout.write('  · 已忽略对渲染无影响的 Mermaid 指令：' + spec.ignoredDirectives.join(' / ') + '\n');
  }
}

// ─────────────────────────────────────────────────────────────
// 规格归一化 + 校验
// ─────────────────────────────────────────────────────────────

function normalize(specIn) {
  const src = activeSource || { file: '<输入>', text: '' };
  const bad = (message, hint = {}) => sourceFail(message, hint);
  if (!specIn || typeof specIn !== 'object' || Array.isArray(specIn)) {
    bad('规格根必须是对象', { offset: 0 });
  }

  for (const key of ['nodes', 'edges', 'groups']) {
    if (specIn[key] !== undefined && !Array.isArray(specIn[key])) {
      bad(key + ' 必须是数组', { property: key });
    }
  }
  const rawNodes = specIn.nodes ?? [];
  const rawEdges = specIn.edges ?? [];
  const rawGroups = specIn.groups ?? [];
  const spec = {
    title: specIn.title || '',
    subtitle: specIn.subtitle || '',
    direction: String(specIn.direction || 'TD').toUpperCase() === 'LR' ? 'LR' : 'TD',
    wrap: specIn.wrap === undefined ? 0 : Number(specIn.wrap),
    nodes: [],
    edges: [],
    groups: [],
  };

  const seen = new Set();
  for (let i = 0; i < rawNodes.length; i++) {
    const raw = rawNodes[i];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      bad('nodes[' + i + '] 必须是对象', { property: 'nodes' });
    }
    const id = String(raw.id ?? '').trim();
    if (!id) bad('存在没有 id 的节点', { property: 'id', value: raw.id });
    if (seen.has(id)) bad('节点 id 重复：' + id, { property: 'id', value: id });
    seen.add(id);

    let kind = raw.kind == null || raw.kind === '' ? 'task' : String(raw.kind).toLowerCase();
    if (kind === 'subroutine') kind = 'task';
    // circle 是 Mermaid 的内部节点类型，需保留给入/出度推断起点或终点。
    if (!KINDS.has(kind) && kind !== 'circle') bad('未知 kind：' + kind + '（节点 ' + id + '）', { property: 'kind', value: raw.kind });
    const status = raw.status ? String(raw.status).toLowerCase() : undefined;
    if (status && !STATUSES.has(status)) bad('未知 status：' + status + '（节点 ' + id + '）', { property: 'status', value: raw.status });
    spec.nodes.push({
      id,
      label: raw.label !== undefined ? String(raw.label) : id,
      kind,
      status,
      time: raw.time ? String(raw.time) : '',
      owner: raw.owner ? String(raw.owner) : '',
      detail: raw.detail ? String(raw.detail) : '',
      note: raw.note ? String(raw.note) : '',
      color: raw.color ? String(raw.color) : '',
    });
  }

  const ids = new Set(spec.nodes.map((n) => n.id));
  for (let i = 0; i < rawEdges.length; i++) {
    const raw = rawEdges[i];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) bad('edges[' + i + '] 必须是对象', { property: 'edges' });
    const from = String(raw.from ?? '').trim();
    const to = String(raw.to ?? '').trim();
    if (!ids.has(from)) bad('连线起点不存在：' + from, { property: 'from', value: raw.from });
    if (!ids.has(to)) bad('连线终点不存在：' + to, { property: 'to', value: raw.to });
    spec.edges.push({ from, to, label: raw.label !== undefined ? String(raw.label) : '', style: raw.style === 'dashed' ? 'dashed' : 'solid' });
  }

  const groupIds = new Set();
  for (let i = 0; i < rawGroups.length; i++) {
    const g = rawGroups[i];
    if (!g || typeof g !== 'object' || Array.isArray(g)) bad('groups[' + i + '] 必须是对象', { property: 'groups' });
    const gid = String(g.id || 'g' + i).trim();
    if (!gid) bad('分组 id 不能为空', { property: 'id', value: g.id });
    if (groupIds.has(gid)) bad('分组 id 重复：' + gid, { property: 'id', value: gid });
    groupIds.add(gid);
    if (g.members !== undefined && !Array.isArray(g.members)) bad('分组 members 必须是数组（分组 ' + gid + '）', { property: 'members', value: g.members });
    const membersIn = g.members ?? [];
    const members = [];
    const memberSet = new Set();
    for (const memberRaw of membersIn) {
      const member = String(memberRaw ?? '').trim();
      if (!ids.has(member)) bad('分组 ' + gid + ' 引用了不存在的节点：' + member, { value: memberRaw });
      if (memberSet.has(member)) bad('分组 ' + gid + ' 中节点重复：' + member, { value: memberRaw });
      memberSet.add(member);
      members.push(member);
    }
    if (members.length) spec.groups.push({ id: gid, label: String(g.label || ''), members });
  }

  // 圆形节点若没有入边 = 起点，没有出边 = 终点。
  const hasIn = new Set(spec.edges.map((e) => e.to));
  const hasOut = new Set(spec.edges.map((e) => e.from));
  for (const n of spec.nodes) {
    if (n.kind === 'start') continue;
    const raw = rawNodes.find((r) => String(r.id) === n.id) || {};
    if (String(raw.kind || '').toLowerCase() === 'circle' && !hasIn.has(n.id)) n.kind = 'start';
    else if (String(raw.kind || '').toLowerCase() === 'circle' && !hasOut.has(n.id)) n.kind = 'end';
  }

  if (!spec.nodes.length) bad('没有任何节点', { property: 'nodes' });
  // normalize 会重建规格对象，解析阶段记下的"已忽略指令"要带过去，否则提示会丢
  if (specIn.ignoredDirectives) spec.ignoredDirectives = specIn.ignoredDirectives;
  return spec;
}
/** 分组标题（药丸 + "N 步"计数）的尺寸。布局阶段算包围盒、SVG 阶段画药丸，必须共用同一套算法。 */
function bandTitleMetrics(label, countText) {
  const labelW = units(label) * 12.4 + 26;
  const countW = textW(countText, 11) + 2;
  return { labelW, countW, gap: 8, totalW: labelW + 8 + countW, minBandW: 26 + labelW + 8 + countW };
}

function analyze(spec) {
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const out = new Map(spec.nodes.map((n) => [n.id, []]));
  const inc = new Map(spec.nodes.map((n) => [n.id, []]));
  for (const e of spec.edges) { out.get(e.from).push(e); inc.get(e.to).push(e); }
  const back = new Set();
  const color = new Map();
  const visit = (id) => {
    color.set(id, 1);
    for (const e of out.get(id)) {
      const c = color.get(e.to) || 0;
      if (c === 1) back.add(e);
      else if (c === 0) visit(e.to);
    }
    color.set(id, 2);
  };
  for (const n of spec.nodes) if (!color.get(n.id)) visit(n.id);
  return { byId, out, inc, back };
}

// ─────────────────────────────────────────────────────────────
// 布局（TD 空间计算，LR 最后转置）
// ─────────────────────────────────────────────────────────────

function layout(spec, opts = {}) {
  const { byId, out, inc, back } = analyze(spec);
  const layers = new Map();

  const depth = new Map();
  const forward = (e) => !back.has(e);
  const compute = (id, stack) => {
    if (depth.has(id)) return depth.get(id);
    if (stack.has(id)) return 0;
    stack.add(id);
    let d = 0;
    for (const e of inc.get(id)) if (forward(e)) d = Math.max(d, compute(e.from, stack) + 1);
    stack.delete(id);
    depth.set(id, d);
    return d;
  };
  for (const n of spec.nodes) compute(n.id, new Set());

  for (const n of spec.nodes) {
    const d = depth.get(n.id);
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d).push(n);
  }
  const layerKeys = [...layers.keys()].sort((a, b) => a - b);

  // 节点尺寸
  for (const n of spec.nodes) {
    const isDecision = n.kind === 'decision';
    const maxUnits = isDecision ? WRAP_UNITS_DECISION : WRAP_UNITS;
    const lines = wrapText(n.label, maxUnits);
    const textW = Math.max(...lines.map(units)) * CHAR_W;
    const metaParts = [];
    if (n.time) metaParts.push(n.time);
    if (n.owner) metaParts.push(n.owner);
    n._lines = lines;
    n._meta = metaParts.join(' · ');   // 判断节点没有左上图标行，时间并入 meta
    n._metaNoTime = n.owner;           // 普通节点的时间走右上角药丸，meta 只留负责人
    const labelH = lines.length * LINE_H;
    if (isDecision) {
      // 菱形内接矩形条件：a/W + b/H ≤ 1/2（a、b 为文字块半宽半高）
      const blockH = labelH + (n._meta ? 18 : 0);
      n.h = Math.round(blockH * 2.6);
      n.w = clamp(MIN_W, MAX_W, Math.round(Math.max(labelH > LINE_H ? 2 * textW * 1.15 : 1.9 * textW, 190)));
    } else {
      // 宽度要同时容得下：左侧图标(18+9) + 间距 + 右上时间药丸 + 右内边距
      const timeW = n.time ? units(n.time) * 11 + 20 : 0;
      const minW = n.time ? Math.max(MIN_W, 27 + 10 + timeW + 14) : MIN_W;
      n.w = clamp(minW, MAX_W, Math.round(textW + NODE_PAD_X * 2));
      n.h = Math.round(48 + labelH + (n._metaNoTime ? 18 : 0) + 18);
    }
  }

  // 同层次序：以入边邻居重心排序，迭代 3 轮
  const orderIndex = new Map();
  layerKeys.forEach((k) => layers.get(k).forEach((n, i) => orderIndex.set(n.id, i)));
  for (let pass = 0; pass < 3; pass++) {
    for (const k of layerKeys) {
      const row = layers.get(k);
      const score = new Map();
      row.forEach((n, i) => {
        const preds = inc.get(n.id).filter(forward).map((e) => orderIndex.get(e.from)).filter((v) => v !== undefined);
        score.set(n.id, preds.length ? preds.reduce((a, b) => a + b, 0) / preds.length : i);
      });
      row.sort((a, b) => score.get(a.id) - score.get(b.id) || orderIndex.get(a.id) - orderIndex.get(b.id));
      row.forEach((n, i) => orderIndex.set(n.id, i));
    }
  }

  // ── 定位：支持分栏换行（长链折成多列，读向仍统一向下）────────────────
  const L = layerKeys.length;
  const rowWidths = layerKeys.map((k) => {
    const row = layers.get(k);
    return row.reduce((a, n) => a + n.w, 0) + H_GAP * (row.length - 1);
  });
  const rowHeights = layerKeys.map((k) => Math.max(...layers.get(k).map((n) => n.h)));

  // wrapRows = 每栏行数：0/未指定 → L（单栏竖排）；-1 → 自动挑；N≥2 → 固定 N 行
  const wrapRows = (opts.wrap === -1) ? pickWrapRows(L, rowWidths, rowHeights, opts.targetAspect ?? 1.6)
    : (opts.wrap >= 2 ? Math.min(opts.wrap, L) : L);
  const R = Math.max(1, Math.min(wrapRows, L));
  const C = Math.ceil(L / R);

  const colW = new Array(C).fill(0);
  for (let i = 0; i < L; i++) colW[Math.floor(i / R)] = Math.max(colW[Math.floor(i / R)], rowWidths[i]);
  const rowHmax = new Array(R).fill(0);
  for (let i = 0; i < L; i++) rowHmax[i % R] = Math.max(rowHmax[i % R], rowHeights[i]);

  const COL_GAP = 118;
  const colX = []; const rowY = [];
  let accX = 0;
  for (let c = 0; c < C; c++) { colX.push(accX); accX += colW[c] + COL_GAP; }
  const contentW = Math.max(accX - COL_GAP, 1);
  let accY = 0;
  for (let r = 0; r < R; r++) { rowY.push(accY); accY += rowHmax[r] + V_GAP; }
  const contentH = Math.max(accY - V_GAP, 1);
  const colBottom = accY - V_GAP;

  layerKeys.forEach((k, i) => {
    const row = layers.get(k);
    const c = Math.floor(i / R);
    const r = i % R;
    const y = rowY[r] + rowHmax[r] / 2;
    let x = colX[c] + (colW[c] - rowWidths[i]) / 2;
    for (const n of row) {
      n._cx = x + n.w / 2;
      n._cy = y;
      n._col = c;
      n._row = r;
      n._rowCount = row.length;
      x += n.w + H_GAP;
    }
  });

  // 边路点
  const edgePaths = [];
  let backIdx = 0;
  let busIdx = 0;
  for (const e of spec.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (e.from === e.to) {
      const x = a._cx + a.w / 2;
      edgePaths.push({ edge: e, kind: 'cubic', pts: [[x, a._cy - 8], [x + 46, a._cy - 34], [x + 46, a._cy + 34], [x, a._cy + 8]] });
      continue;
    }
    const isBack = back.has(e);
    const sameCol = a._col === b._col;
    const sameLayer = Math.abs(a._cy - b._cy) < 1;
    if (sameCol && !isBack && !sameLayer && b._cy > a._cy) {
      const p0 = [a._cx, a._cy + a.h / 2];
      const p3 = [b._cx, b._cy - b.h / 2];
      const dy = p3[1] - p0[1];
      edgePaths.push({ edge: e, kind: 'cubic', pts: [p0, [p0[0], p0[1] + dy * 0.42], [p3[0], p3[1] - dy * 0.42], p3] });
    } else if (sameCol) {
      // 同列回边 / 同层：走本列右侧旁路
      const laneX = colX[a._col] + colW[a._col] + 20 + backIdx++ * 22;
      const yTop = Math.min(a._cy, b._cy);
      const yBot = Math.max(a._cy, b._cy);
      edgePaths.push({
        edge: e, kind: 'ortho', laneTop: yTop, laneBot: yBot,
        pts: [[a._cx + a.w / 2, a._cy], [laneX, a._cy], [laneX, b._cy], [b._cx + b.w / 2, b._cy]],
      });
    } else {
      // 跨列：短路径走列间空隙；行内有多节点时改走底部走廊，避免横穿节点
      const gutter = b._col > a._col ? colX[b._col] - 34 - busIdx * 20 : colX[b._col] + colW[b._col] + 34 + busIdx * 20;
      const shortRoute = a._rowCount === 1 && b._rowCount === 1;
      busIdx++;
      let pts;
      if (shortRoute) {
        const xa = b._col > a._col ? a._cx + a.w / 2 : a._cx - a.w / 2;
        const xb = b._col > a._col ? b._cx - b.w / 2 : b._cx + b.w / 2;
        pts = [[xa, a._cy], [gutter, a._cy], [gutter, b._cy], [xb, b._cy]];
      } else {
        const corridor = colBottom + 30 + (busIdx - 1) * 20;
        pts = [[a._cx, a._cy + a.h / 2], [a._cx, corridor], [gutter, corridor], [gutter, b._cy], [b._cx - b.w / 2, b._cy]];
        if (b._col < a._col) pts[4] = [b._cx + b.w / 2, b._cy];
      }
      edgePaths.push({ edge: e, kind: 'ortho', pts });
    }
  }
  void out;

  // 分组带（跨列时按列切成多段，避免把不相干节点圈进来）
  const bands = [];
  spec.groups.forEach((g, gi) => {
    const color = g.color || GROUP_PALETTE[gi % GROUP_PALETTE.length];
    const byCol = new Map();
    for (const id of g.members) {
      const n = byId.get(id);
      const c = n._col ?? 0;
      if (!byCol.has(c)) byCol.set(c, []);
      byCol.get(c).push(n);
    }
    let part = 0;
    for (const c of [...byCol.keys()].sort((a, b) => a - b)) {
      const members = byCol.get(c);
      const label = part === 0 ? g.label : g.label + '（续）';
      const cxMin = Math.min(...members.map((n) => n._cx - n.w / 2));
      const cxMax = Math.max(...members.map((n) => n._cx + n.w / 2));
      // 分组框至少要装得下自己的标题（药丸 + 计数，二者居中后左右各留 13）
      const needW = bandTitleMetrics(label, members.length + ' 步').minBandW;
      // 标题比节点列还宽时**左右对称外扩**：只往右长会让节点列贴在左边，小节看着不居中
      const extra = Math.max(0, needW - (cxMax - cxMin + 40));      const x0 = cxMin - 20 - Math.floor(extra / 2);
      let x1 = cxMax + 20 + Math.ceil(extra / 2);
      const y0 = Math.min(...members.map((n) => n._cy - n.h / 2)) - 54;   // 54：给分组标题药丸留出空间，别贴着第一个节点
      const y1 = Math.max(...members.map((n) => n._cy + n.h / 2)) + 18;
      bands.push({
        id: g.id + '-' + c,
        label,
        members: members.map((n) => n.id),
        x: x0, y: y0, w: x1 - x0, h: y1 - y0, color,
      });
      part++;
    }
  });

  const result = { spec, nodes: spec.nodes, edgePaths, bands, contentW, contentH, wrapRows: R, cols: C };

  // LR：整体转置（坐标与宽高互换）
  if (spec.direction === 'LR') {
    const swap = (n) => {
      const cx = n._cx, cy = n._cy, w = n.w, h = n.h;
      n._cx = cy; n._cy = cx; n.w = h; n.h = w;
    };
    for (const n of spec.nodes) swap(n);
    for (const ep of result.edgePaths) ep.pts = ep.pts.map(([x, y]) => [y, x]);
    for (const b of result.bands) { const x = b.x, y = b.y, w = b.w, h = b.h; b.x = y; b.y = x; b.w = h; b.h = w; }
    const t = result.contentW; result.contentW = result.contentH; result.contentH = t;
  }

  return result;
}

/** 自动选择「每栏行数」：让画布宽高比尽量接近目标（默认 1.6，横向阅读舒适区）。 */
function pickWrapRows(L, rowWidths, rowHeights, targetAspect) {
  if (L < 5) return L;
  let best = L;
  let bestScore = Infinity;
  for (let R = 1; R <= L; R++) {
    const C = Math.ceil(L / R);
    const colW = new Array(C).fill(0);
    for (let i = 0; i < L; i++) colW[Math.floor(i / R)] = Math.max(colW[Math.floor(i / R)], rowWidths[i]);
    const rowH = new Array(R).fill(0);
    for (let i = 0; i < L; i++) rowH[i % R] = Math.max(rowH[i % R], rowHeights[i]);
    const W = colW.reduce((a, b) => a + b, 0) + 118 * (C - 1);
    const H = rowH.reduce((a, b) => a + b, 0) + V_GAP * (R - 1);
    const score = Math.abs(Math.log((W / H) / targetAspect));
    if (score < bestScore - 1e-9) { bestScore = score; best = R; }
  }
  return best;
}

// ─────────────────────────────────────────────────────────────
// SVG 渲染（含内联样式，保证 .svg 单独可用）
// ─────────────────────────────────────────────────────────────

function svgStyle(vid) {
  return loadAsset('svg.css').replace(/\{\{vid\}\}/g, vid);
}

const KIND_GLYPH = { start: '▶', end: '■', milestone: '✓', risk: '!', decision: '', task: '' };

/** 正交折线转成带圆角的路径。 */
function orthoPath(pts, r = 9) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    if (rr < 1) { d += ` L${cx.toFixed(1)},${cy.toFixed(1)}`; continue; }
    const a = [cx - ((cx - px) / inLen) * rr, cy - ((cy - py) / inLen) * rr];
    const b = [cx + ((nx - cx) / outLen) * rr, cy + ((ny - cy) / outLen) * rr];
    d += ` L${a[0].toFixed(1)},${a[1].toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0].toFixed(1)},${last[1].toFixed(1)}`;
}

// ── 角标定位：把类型图标圆环完整放进节点形状里（含描边宽度），避免"出框" ──
function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
  let t = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function distToRect(px, py, x0, y0, x1, y1) {
  const dx = Math.max(x0 - px, 0, px - x1), dy = Math.max(y0 - py, 0, py - y1);
  return Math.hypot(dx, dy);
}

/** 点到节点边界的距离（正=在形状内）。rect=圆角 12 卡片；stadium=起点/终点胶囊（半径 h/2）；diamond=判断菱形。 */
function shapeClearance(shape, w, h, x, y) {
  if (shape === 'stadium') { const rad = h / 2; return rad - distToSeg(x, y, rad, rad, Math.max(rad, w - rad), rad); }
  if (shape === 'diamond') {
    const a = w / 2, b = h / 2;
    return ((1 - Math.abs(x - a) / a - Math.abs(y - b) / b) * a * b) / Math.hypot(a, b);
  }
  return 12 - distToRect(x, y, 12, 12, Math.max(12, w - 12), Math.max(12, h - 12));
}

/** 角标圆周上离节点边界最近的距离。 */
function badgeClearance(shape, w, h, gx, gy, r) {
  let m = Infinity;
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    m = Math.min(m, shapeClearance(shape, w, h, gx + r * Math.cos(a), gy + r * Math.sin(a)));
  }
  return m;
}

/** 把角标推进形状内。留 4.5px：圆环描边 0.6 + 节点描边最多 1.3，再剩 ~2.6px 视觉空隙。 */
function fitBadge(shape, w, h, gx, gy, r) {
  const MARGIN = 4.5;
  let best = { gx, gy, cl: badgeClearance(shape, w, h, gx, gy, r) };
  if (best.cl >= MARGIN || shape === 'diamond') return best;   // 菱形角标在正中，本来就是最内的位置
  for (let x = gx; x <= Math.max(gx, w - r - 2); x += 0.5) {
    const cl = badgeClearance(shape, w, h, x, gy, r);
    if (cl > best.cl) best = { gx: x, gy, cl };
    if (cl >= MARGIN) return best;
  }
  return best;
}

/** 时间药丸本身是"高 21 的胶囊"（两端半圆 + 上下直边），同样要整块落在节点形状内。 */
function pillClearance(shape, w, h, tx, ty, tw, th) {
  const r = th / 2, cy = ty + r;
  const ax = tx + r, bx = Math.max(ax, tx + tw - r);
  let m = Infinity;
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    m = Math.min(m, shapeClearance(shape, w, h, ax + r * Math.cos(a), cy + r * Math.sin(a)));
    m = Math.min(m, shapeClearance(shape, w, h, bx + r * Math.cos(a), cy + r * Math.sin(a)));
    const x = ax + (bx - ax) * (i / 32);
    m = Math.min(m, shapeClearance(shape, w, h, x, cy - r), shapeClearance(shape, w, h, x, cy + r));
  }
  return m;
}

/** 药丸右上角最容易顶出胶囊的右弧：往左推（不够再往下挪一点），取位移最小的解。 */
function fitPill(shape, w, h, tx, ty, tw, th) {
  const MARGIN = 3.5;   // 药丸描边 0.5 + 节点描边最多 1.3，再留 ~1.7px 视觉空隙
  let best = { tx, ty, cl: pillClearance(shape, w, h, tx, ty, tw, th) };
  if (best.cl >= MARGIN || shape === 'diamond') return best;
  for (let x = tx; x >= 2; x -= 0.5) {
    for (const dy of [0, 1, 2, 3]) {
      const cl = pillClearance(shape, w, h, x, ty + dy, tw, th);
      if (cl > best.cl) best = { tx: x, ty: ty + dy, cl };
      if (cl >= MARGIN) return { tx: x, ty: ty + dy, cl };
    }
  }
  return best;
}

function renderSvg(L, vid = 'v', head = true) {
  const pad = 40;
  const hasHead = Boolean(L.spec.title || L.spec.subtitle) && head !== false;
  const titleBand = (L.spec.title && hasHead ? 36 : 0) + (L.spec.subtitle && hasHead ? 22 : 0) + (hasHead ? 18 : 0);
  // 分组带可能比节点列更宽（标题长）而对称外扩，甚至到负数：把分组带的包围盒也算进原点与画布尺寸，避免被裁掉
  const bMinX = L.bands.length ? Math.min(0, ...L.bands.map((b) => b.x)) : 0;
  const bMaxX = L.bands.length ? Math.max(L.contentW, ...L.bands.map((b) => b.x + b.w)) : L.contentW;
  const bMinY = L.bands.length ? Math.min(0, ...L.bands.map((b) => b.y)) : 0;
  const bMaxY = L.bands.length ? Math.max(L.contentH, ...L.bands.map((b) => b.y + b.h)) : L.contentH;
  const W = Math.round(bMaxX - bMinX + pad * 2 + 120);
  const H = Math.round(bMaxY - bMinY + pad * 2 + titleBand);
  const ox = pad - bMinX;
  const oy = pad - bMinY + titleBand;
  const ff = "'Segoe UI','Microsoft YaHei',system-ui,sans-serif";

  const parts = [];
  parts.push(`<svg id="flow-svg-${vid}" data-variant="${vid}" data-theme="dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`);
  parts.push('<defs>');
  parts.push('<style>' + svgStyle(vid).replace(/var\(--ff\)/g, ff) + '</style>');
  parts.push(`<filter id="nShadow-${vid}" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="3.2" flood-color="#05070c" flood-opacity="0.34"/></filter>`);
  parts.push(`<filter id="selGlow-${vid}" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#4a9dff" flood-opacity="0.8"/></filter>`);
  parts.push(`<filter id="selGlowWarm-${vid}" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#bf6b3a" flood-opacity="0.65"/></filter>`);
  parts.push(`<pattern id="grid-${vid}" width="26" height="26" patternUnits="userSpaceOnUse"><circle class="grid-dot" cx="2" cy="2" r="1.15"/></pattern>`);
  const mk = (id, color) => `<marker id="${id}-${vid}" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path d="M1.5 2.2 L10 6 L1.5 9.8 z" fill="${color}"/></marker>`;
  parts.push(mk('arrow', 'var(--edge)'));
  parts.push(mk('arrow-hi', 'var(--accent)'));
  parts.push(mk('arrow-dim', 'var(--edge-dim)'));
  parts.push('</defs>');

  // 画布点阵底纹：放在 #vp 里、范围放大到 ±1 倍画布，
  // 这样缩放/平移时底纹跟着走，且不会在视野里露出"底纹矩形"的硬边。
  parts.push(`<g id="vp-${vid}">`);
  parts.push(`<rect class="canvas-grid" x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}" fill="url(#grid-${vid})"/>`);

  // 标题块（页面外壳已经有标题，所以 HTML 版不画，避免缩放时压住节点；导出的 .svg 才画）
  if (hasHead) {
    const ty = pad + 4;
    parts.push(`<rect class="t-accent" x="${ox}" y="${ty}" width="4.5" height="${L.spec.title ? 22 : 14}" rx="2.25"/>`);    if (L.spec.title) parts.push(`<text class="t-title" x="${ox + 16}" y="${ty + 18}">${xml(L.spec.title)}</text>`);
    if (L.spec.subtitle) parts.push(`<text class="t-sub" x="${ox + 16}" y="${ty + (L.spec.title ? 42 : 13)}">${xml(L.spec.subtitle)}</text>`);
  }

  // 分组带
  for (const b of L.bands) {
    parts.push(`<g class="band">`);
    parts.push(`<rect class="band-bg" x="${(ox + b.x).toFixed(1)}" y="${(oy + b.y).toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="16" fill="${b.color}" fill-opacity="0.075" stroke="${b.color}" stroke-opacity="0.46"/>`);
    if (b.label) {
      const countText = b.members.length + ' 步';
      const bm = bandTitleMetrics(b.label, countText);
      const lw = bm.labelW;
      const cw = bm.countW;
      // 药丸 + 计数 靠**左上角**对齐（左内边距 13）：带宽变化时标题位置稳定，
      // 长标题也不会被居中拱到带中间；早期是整组水平居中。
      const lx = ox + b.x + 13;
      const ly = oy + b.y + 10;
      parts.push(`<rect class="band-pill" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" width="${lw.toFixed(1)}" height="23" rx="11.5" fill="${b.color}"/>`);
      parts.push(`<text class="band-label" x="${(lx + 13).toFixed(1)}" y="${(ly + 16).toFixed(1)}" fill="${b.color}" style="--c:${b.color}">${xml(b.label)}</text>`);
      parts.push(`<text class="band-count" x="${(lx + lw + 8).toFixed(1)}" y="${(ly + 16).toFixed(1)}" fill="${b.color}" style="--c:${b.color}" opacity="0.8">${countText}</text>`);
    }
    parts.push('</g>');
  }

  // 边
  const labelGroups = [];
  for (const ep of L.edgePaths) {
    const e = ep.edge;
    const pts = ep.pts.map(([x, y]) => [ox + x, oy + y]);
    let d;
    if (ep.kind === 'cubic') {
      const dy = pts[3][1] - pts[0][1];
      const off = Math.max(26, Math.abs(dy) * 0.38);
      const c1 = [pts[0][0], pts[0][1] + off];
      const c2 = [pts[3][0], pts[3][1] - off];
      d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${pts[3][0].toFixed(1)},${pts[3][1].toFixed(1)}`;
    } else {
      d = orthoPath(pts);
    }
    const cls = 'edge' + (e.style === 'dashed' ? ' dashed' : '');
    parts.push(`<path class="${cls}" data-from="${xml(e.from)}" data-to="${xml(e.to)}" marker-end="url(#arrow-${vid})" d="${d}"/>`);
    if (e.label) {
      let mid = ep.kind === 'cubic'
        ? [(pts[0][0] + pts[3][0]) / 2, (pts[0][1] + pts[3][1]) / 2]
        : pts[1];
      // 别压住分组带的标题行（标题靠左上后，正好落在带顶那里）：落到标题行里的标签整体下移
      for (const b of L.bands) {
        const bTop = oy + b.y;
        const inRow = (mid[1] - 10.5 < bTop + 36) && (mid[1] + 10.5 > bTop - 6);
        const inBandX = mid[0] > ox + b.x && mid[0] < ox + b.x + b.w;
        if (inRow && inBandX) { mid = [mid[0], bTop + 46]; break; }
      }
      const w = Math.max(32, units(e.label) * 11.5 + 18);
      labelGroups.push(`<g class="edge-label-g" data-from="${xml(e.from)}" data-to="${xml(e.to)}"><rect class="edge-label-bg" x="${(mid[0] - w / 2).toFixed(1)}" y="${(mid[1] - 10.5).toFixed(1)}" width="${w.toFixed(1)}" height="21" rx="10.5"/><text class="edge-label" x="${mid[0].toFixed(1)}" y="${(mid[1] + 4).toFixed(1)}">${xml(e.label)}</text></g>`);
    }
  }
  parts.push(...labelGroups);

  // 节点
  for (const n of L.spec.nodes) {
    const x = ox + n._cx - n.w / 2;
    const y = oy + n._cy - n.h / 2;
    const isDec = n.kind === 'decision';
    const cls = ['node', 'k-' + n.kind, n.status ? 'st-' + n.status : 'st-none'].join(' ');
    parts.push(`<g class="${cls}" data-id="${xml(n.id)}" data-status="${xml(n.status || '')}" data-kind="${xml(n.kind)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">`);

    if (isDec) {
      parts.push(`<polygon class="node-bg" filter="url(#nShadow-${vid})" points="${(n.w / 2).toFixed(1)},0 ${n.w.toFixed(1)},${(n.h / 2).toFixed(1)} ${(n.w / 2).toFixed(1)},${n.h.toFixed(1)} 0,${(n.h / 2).toFixed(1)}"/>`);
    } else if (n.kind === 'start' || n.kind === 'end') {
      parts.push(`<rect class="node-bg" filter="url(#nShadow-${vid})" x="0" y="0" width="${n.w}" height="${n.h}" rx="${(n.h / 2).toFixed(1)}"/>`);
    } else {
      parts.push(`<rect class="node-bg" filter="url(#nShadow-${vid})" x="0" y="0" width="${n.w}" height="${n.h}" rx="12"/>`);
      parts.push(`<rect class="accent" x="0" y="10" width="3.5" height="${n.h - 20}" rx="1.75"/>`);
    }

    // 类型图标（起点/终点/检查点/风险/判断）；普通环节没有图标，保持清爽
    const capsule = n.kind === 'start' || n.kind === 'end';
    const shape = isDec ? 'diamond' : (capsule ? 'stadium' : 'rect');
    const glyph = KIND_GLYPH[n.kind] || '';
    if (glyph) {
      const R = 9;
      // 圆角卡片/胶囊要把角标推离左边和上边的弧，否则圆环会压在节点轮廓上（胶囊最明显）
      const fit = fitBadge(shape, n.w, n.h, isDec ? n.w / 2 : 18.5, isDec ? 23 : 20, R);
      const gx = fit.gx, gy = fit.gy;
      parts.push(`<circle class="kind-chip" cx="${gx.toFixed(1)}" cy="${gy}" r="${R}"/>`);
      parts.push(`<circle class="kind-ring" cx="${gx.toFixed(1)}" cy="${gy}" r="${R}"/>`);
      parts.push(`<text class="kind-glyph" x="${gx.toFixed(1)}" y="${gy + 0.5}">${xml(glyph)}</text>`);
    }

    // 时间药丸（判断节点没有图标行，时间并入 meta 行）；胶囊右上角是圆角，药丸同样要内推
    if (n.time && !isDec) {
      const tw = units(n.time) * 11 + 18;
      const fit = fitPill(shape, n.w, n.h, n.w - 12 - tw, 8.5, tw, 21);
      const tx = fit.tx, pillY = fit.ty;
      parts.push(`<rect class="time-pill" x="${tx.toFixed(1)}" y="${pillY.toFixed(1)}" width="${tw.toFixed(1)}" height="21" rx="10.5"/>`);
      parts.push(`<text class="t-time" x="${(tx + tw / 2).toFixed(1)}" y="${(pillY + 14.5).toFixed(1)}" text-anchor="middle">${xml(n.time)}</text>`);
    }

    let ty;
    if (isDec) {
      const blockH = n._lines.length * LINE_H + (n._meta ? 18 : 0);
      ty = Math.round(n.h / 2 - blockH / 2 + 15);   // 菱形内文字垂直居中
    } else ty = 47;
    for (const line of n._lines) {
      parts.push(`<text class="t-label" x="${(n.w / 2).toFixed(1)}" y="${ty}" text-anchor="middle">${xml(line)}</text>`);
      ty += LINE_H;
    }
    const metaText = isDec ? n._meta : n._metaNoTime;
    if (metaText) parts.push(`<text class="t-meta" x="${(n.w / 2).toFixed(1)}" y="${ty + 2}" text-anchor="middle">${xml(metaText)}</text>`);
    parts.push('</g>');
  }

  parts.push('</g></svg>');
  return { svg: parts.join('\n'), width: W, height: H };
}

// ─────────────────────────────────────────────────────────────
// HTML 外壳（页面 chrome 的 CSS/JS 也全部内联）
// ─────────────────────────────────────────────────────────────

const CLIENT_JS = loadAsset('app.js');

/** assets/shell.html 是页面骨架，里面的 {{名字}} 是占位符，由 renderHtml 传进来的内容填上。
 *  只扫描模板一遍、用函数式替换：填进去的内容（Mermaid 源码、JSON、标题……）里即使有 {{…}} 或 $&，也不会被二次展开或吞字符。
 *  读取时统一成 LF、去 BOM（这些文本原来写在模板字符串里，换行天然是 LF）。 */
const loadShell = () => {
  const t = loadAsset('shell.html');
  return (t.charCodeAt(0) === 0xFEFF ? t.slice(1) : t).replace(/\r\n/g, '\n');
};
const fillShell = (tpl, slots) => {
  for (const k of Object.keys(slots)) if (!tpl.includes('{{' + k + '}}')) throw new Error('shell.html 缺少占位符 {{' + k + '}}');
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in slots)) throw new Error('shell.html 里有未知占位符 {{' + k + '}}');
    return slots[k];
  });
};

function renderHtml(svgs, L, mmd, meta = {}) {
  const spec = L.spec;
  const predsOf = new Map(spec.nodes.map((n) => [n.id, []]));
  const succsOf = new Map(spec.nodes.map((n) => [n.id, []]));
  for (const e of spec.edges) { succsOf.get(e.from).push(e.to); predsOf.get(e.to).push(e.from); }
  const slug = (spec.title || 'workflow').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 60);
  const data = {
    slug,
    title: spec.title,
    subtitle: spec.subtitle,
    direction: spec.direction,
    groups: spec.groups,
    statusLabels: STATUS_LABEL,
    kinds: [...new Set(spec.nodes.map((n) => n.kind))].map((k) => ({ key: k, label: KIND_LABEL[k] || k })),
    nodes: spec.nodes.map((n) => ({
      id: n.id, label: n.label, kind: n.kind,
      kindLabel: KIND_LABEL[n.kind] || n.kind,
      status: n.status || '', statusLabel: n.status ? (STATUS_LABEL[n.status] || n.status) : '',
      time: n.time, owner: n.owner, detail: n.detail, note: n.note,
      preds: predsOf.get(n.id), succs: succsOf.get(n.id),
    })),
    edges: spec.edges.map((e) => ({ from: e.from, to: e.to, label: e.label, style: e.style })),
    selfFile: meta.selfFile || '',
    flows: meta.flows || [],
  };
  const json = JSON.stringify(data).replace(/<\//g, '<\\/');
  const statusesPresent = [...new Set(spec.nodes.map((n) => n.status).filter(Boolean))];
  const statusCounts = {};
  for (const n of spec.nodes) if (n.status) statusCounts[n.status] = (statusCounts[n.status] || 0) + 1;
  // 第 6 段是状态汇总（done:4,risk:1…）：首页据此显示"全部图里共多少处需关注"
  const stats = [
    spec.nodes.length, spec.edges.length, spec.groups.length,
    svgs.portraitSize, svgs.landscapeSize,
    Object.entries(statusCounts).map(([k, v]) => `${k}:${v}`).join(','),
  ].join('|');

  const legend = statusesPresent.map((s) => `<button data-status="${s}"><i class="dot st-${s}"></i>${STATUS_LABEL[s] || s}</button>`).join('');
  return fillShell(loadShell(), {
    titleMeta: xml(spec.title || ''),
    flowVersion: FLOW_VERSION,
    stats: xml(stats),
    titleTag: xml(spec.title || '工作流图'),
    brandName: xml(spec.title || '工作流'),
    legend,
    svgPortrait: svgs.portrait,
    svgLandscape: svgs.landscape,
    mmd: xml(mmd),
    json,
    css: loadAsset('app.css'),
    js: CLIENT_JS,
  });
}

// ─────────────────────────────────────────────────────────────
// Mermaid 导出
// ─────────────────────────────────────────────────────────────

/** Mermaid 标签转义：含分隔符时用双引号包起来（与 parseMermaid 的反解规则配套）。 */
const MMD_SPECIAL = /[\[\]{}()|"]/;
function mmdLabel(s) {
  const t = String(s ?? '');
  return MMD_SPECIAL.test(t) ? '"' + t.replace(/"/g, '&quot;') + '"' : t;
}

/** 边标签里的竖线用视觉等价的 U+2223 表示，避免冲突于 |标签| 分隔符；解析往返时还原。 */
function mmdEdgeLabel(s) {
  return mmdLabel(String(s ?? '').replace(/\|/g, '\u2223'));
}

const MMD_RESERVED = new Set(['end', 'subgraph', 'graph', 'flowchart', 'class', 'classdef', 'style',
  'linkstyle', 'click', 'direction', 'acctitle', 'accdescr']);

/** Mermaid 的关键字不能当节点 id：`end((终点))` 在真实 Mermaid 里也会被当成分组结束，导出时统一改名。 */
function safeId(id) {
  const s = String(id);
  return MMD_RESERVED.has(s.trim().toLowerCase()) ? s + '_' : s;
}

/** 导出件首行的标记：告诉 refresh「这是产物、不是源」，别拿它重渲染（会丢 time/owner/detail/note） */
const MMD_EXPORT_MARK = '%% workflow-visualizer 导出件（不是源文件；要改流程请改 .json，或直接改这个 .mmd 并删掉本行）';

function toMermaid(spec) {
  const out = [];
  out.push(MMD_EXPORT_MARK);
  out.push('flowchart ' + (spec.direction === 'LR' ? 'LR' : 'TD'));
  const shapeOf = (n) => {
    const t = mmdLabel(n.label);
    if (n.kind === 'decision') return `{${t}}`;
    if (n.kind === 'start' || n.kind === 'end') return `((${t}))`;
    return `[${t}]`;
  };
  const nodeById = new Map(spec.nodes.map((n) => [n.id, n]));
  const inGroup = new Map();
  spec.groups.forEach((g, i) => g.members.forEach((m) => inGroup.set(m, i)));
  const emitted = new Set();
  spec.groups.forEach((g, gi) => {
    out.push('  subgraph ' + mmdLabel(g.label || g.id));
    for (const m of g.members) {
      out.push('    ' + safeId(m) + shapeOf(nodeById.get(m)));
      emitted.add(m);
    }
    out.push('  end');
    void gi;
  });
  for (const n of spec.nodes) if (!emitted.has(n.id)) out.push('  ' + safeId(n.id) + shapeOf(n));
  for (const e of spec.edges) {
    const arrow = e.style === 'dashed' ? '-.->' : '-->';
    out.push('  ' + safeId(e.from) + ' ' + arrow + (e.label ? '|' + mmdEdgeLabel(e.label) + '|' : '') + ' ' + safeId(e.to));
  }
  return out.join('\n') + '\n';
}

// ─────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────

const BOOL_FLAGS = new Set(['all', 'help', 'debug', 'single']);
const VALUE_FLAGS = new Set(['out', 'svg', 'mmd', 'wrap', 'port']);

function parseArgs(argv) {
  const flags = {};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      if (BOOL_FLAGS.has(key)) { flags[key] = true; continue; }
      if (!VALUE_FLAGS.has(key)) {
        fail('未知参数：--' + key + '（可用：' + [...BOOL_FLAGS, ...VALUE_FLAGS].map((k) => '--' + k).join(' / ') + '）');
      }
      const val = argv[i + 1];
      if (val === undefined || val.startsWith('--')) fail('参数 --' + key + ' 缺少取值');
      flags[key] = val;
      i++;
    } else rest.push(a);
  }
  if (rest.length > 1) fail('多余的位置参数：' + rest.slice(1).join(' ') + '（每个命令只接受一个输入路径）');
  return { flags, rest };
}

function writeOut(file, content) {
  const dir = dirname(resolve(file));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(file, content, 'utf8');
}

/** 反转义 meta 里的实体，用于把标题还原成可读文本。 */
function unxml(s) {
  return String(s ?? '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/**
 * 扫描目录里由本 skill 生成的流程图页面（靠 HTML 上的 data-flow-viz="1" 标记识别），
 * 供页面里的「全部流程图」抽屉使用。按修改时间倒序。
 */
function scanFlows(dir) {
  const flows = [];
  let names = [];
  try { names = readdirSync(dir); } catch { return { version: 1, updated: '', flows }; }
  for (const name of names) {
    if (!/\.html?$/i.test(name) || name.startsWith('【') || name.startsWith('.')) continue;
    const full = join(dir, name);
    let text = '';
    let st = null;
    try {
      st = statSync(full);
      if (!st.isFile() || st.size > 4 * 1024 * 1024) continue;
      text = readFileSync(full, 'utf8');
    } catch { continue; }
    if (!/data-flow-viz="1"/.test(text)) continue;
    const title = unxml((/<meta name="flow-title" content="([^"]*)"/.exec(text) || [, ''])[1]);
    const statsRaw = unxml((/<meta name="flow-stats" content="([^"]*)"/.exec(text) || [, ''])[1]);
    const [nodes = '0', edges = '0', groups = '0', portrait = '', landscape = '', status = ''] = String(statsRaw).split('|');
    flows.push({
      file: name,
      title: title || name.replace(/\.html?$/i, ''),
      nodes: Number(nodes) || 0,
      edges: Number(edges) || 0,
      groups: Number(groups) || 0,
      portrait, landscape, status,
      mtime: new Date(st.mtimeMs).toLocaleString('zh-CN', { hour12: false }),
      mtimeMs: st.mtimeMs,
    });
  }
  // 固定按文件名排序（不用 mtime）：这样页面内嵌快照与「流程索引.json」顺序永远一致，
  // 打开抽屉后 fetch 回来也不会重排——列表在手指底下跳位置会点错条目。
  flows.sort((a, b) => a.file.localeCompare(b.file, 'zh'));
  return { version: 1, updated: new Date().toLocaleString('zh-CN', { hour12: false }), flows };
}

async function cmdRender(input, flags) {
  const spec = normalize(loadSpec(input));
  // 0=关闭分栏；N=横版每栏 N 行（N=1 合法，表示每栏一个节点），负数/非整数直接报错
  if (flags.wrap !== undefined && !/^\d+$/.test(String(flags.wrap).trim())) {
    fail('--wrap 需要 ≥0 的整数：0=关闭分栏，N=横版每栏 N 行');
  }
  const baseWrap = flags.wrap !== undefined ? Number(flags.wrap) : (spec.wrap ?? 0);

  // 两个版式各自独立布局（structuredClone 隔离坐标，避免互相覆盖）
  const Lp = layout(structuredClone(spec), { wrap: baseWrap });
  const Lw = baseWrap >= 2 || baseWrap === -1
    ? layout(structuredClone(spec), { wrap: baseWrap, targetAspect: 1.6 })
    : layout(structuredClone(spec), { wrap: -1, targetAspect: 1.6 });
  const svgP = renderSvg(Lp, 'portrait', false);          // HTML 版：不画标题块
  const svgW = renderSvg(Lw, 'landscape', false);
  const svgPFile = renderSvg(Lp, 'portrait', true);       // 导出的 .svg：自带标题
  const svgWFile = renderSvg(Lw, 'landscape', true);
  const mmd = toMermaid(spec);

  if (flags.debug) {
    for (const [tag, L] of [['竖版', Lp], ['横版', Lw]]) {
      process.stderr.write(`debug ${tag}: cols=${L.cols} rows=${L.wrapRows} 画布 ${L.contentW.toFixed(0)}x${L.contentH.toFixed(0)}\n`);
      const rows = new Map();
      for (const n of L.spec.nodes) {
        const key = (n._col ?? 0) + ':' + (n._row ?? 0);
        if (!rows.has(key)) rows.set(key, []);
        rows.get(key).push(n.id);
      }
      for (const [k, ids] of rows) process.stderr.write(`    col:row ${k} → ${ids.join(' ')}\n`);
    }
  }

  const stem = basename(input).replace(/\.(json|mmd|mermaid|md|markdown)$/i, '');
  const outDir = flags.out ? dirname(resolve(flags.out)) : dirname(resolve(input));
  const htmlPath = flags.out ? resolve(flags.out) : join(outDir, stem + '.html');
  const selfFile = basename(htmlPath);
  const portraitSize = `${svgP.width}x${svgP.height}`;
  const landscapeSize = `${svgW.width}x${svgW.height}`;

  // 页面内嵌一份清单快照（file:// 下打不开 fetch，用它兜底）。
  // 顺序与「流程索引.json」完全一致（都按文件名），且**包含当前页自己**——
  // 抽屉里要能标出「当前」，也不能因为 fetch 回来而重排（那会导致手指底下的条目换位、点错）。
  const listed = scanFlows(outDir).flows;
  const snapshot = listed.slice();
  if (!listed.some((f) => f.file === selfFile)) {
    snapshot.push({
      file: selfFile,
      title: spec.title || stem,
      nodes: spec.nodes.length,
      edges: spec.edges.length,
      groups: spec.groups.length,
      portrait: portraitSize,
      landscape: landscapeSize,
      mtime: '本次生成',
      mtimeMs: 0,
    });
    snapshot.sort((a, b) => a.file.localeCompare(b.file, 'zh'));
  }

  writeOut(htmlPath, renderHtml(
    { portrait: svgP.svg, landscape: svgW.svg, portraitSize, landscapeSize },
    Lp, mmd, { selfFile, flows: snapshot },
  ));
  writeOut(join(outDir, FLOW_MANIFEST), JSON.stringify(scanFlowsWithVersion(outDir), null, 2) + '\n');

  // 静态首页：本地 file:// 打开时浏览器只会给"纯文件名列表"，
  // 这份 index.html 就是它的替代品（🏠 按钮在 file:// 下指向它）。
  try {
    const homeHtml = await buildHome({
      dir: outDir,
      baseHref: '',
      rootPath: outDir,
      port: Number(flags.port) || 8765,
      fileMode: true,
    });
    writeOut(join(outDir, 'index.html'), homeHtml);
  } catch (err) {
    process.stderr.write('flow: 静态首页生成失败（不影响流程图）：' + err.message + '\n');
  }

  const written = [htmlPath, join(outDir, FLOW_MANIFEST), join(outDir, 'index.html')];
  if (flags.all || flags.mmd) {
    const p = flags.mmd ? resolve(flags.mmd) : join(outDir, stem + '.mmd');
    writeOut(p, mmd);
    written.push(p);
  }
  if (flags.all || flags.svg) {
    const pP = flags.svg ? resolve(flags.svg) : join(outDir, stem + '-竖版.svg');
    const pW = flags.svg ? pP.replace(/\.svg$/i, '') + '-横版.svg' : join(outDir, stem + '-横版.svg');
    writeOut(pP, '<?xml version="1.0" encoding="UTF-8"?>\n' + svgPFile.svg);
    writeOut(pW, '<?xml version="1.0" encoding="UTF-8"?>\n' + svgWFile.svg);
    written.push(pP, pW);
  }

  const stats = `节点 ${spec.nodes.length} · 连线 ${spec.edges.length} · 分组 ${spec.groups.length}`
    + ` · 竖版 ${svgP.width}x${svgP.height} · 横版 ${svgW.width}x${svgW.height}`
    + (Lw.cols > 1 ? `（横版自动分 ${Lw.cols} 栏）` : '');
  process.stdout.write('flow: ' + stats + '\n');
  for (const p of written) process.stdout.write('  → ' + p + '\n');
  return 0;
}

/** 扫描产物目录并带上版本信息：清单自身的 generatorVersion + 每个产物 HTML 里的 flow-version。
 *  渲染与建索引**都要**用它写清单，否则后写的那次会把版本信息抹掉（首页就会显示 v?）。 */
function scanFlowsWithVersion(dir) {
  const mf = scanFlows(dir);
  mf.generatorVersion = FLOW_VERSION;
  for (const f of mf.flows) {
    try {
      const html = readFileSync(join(dir, f.file), 'utf8');
      const m = /<meta name="flow-version" content="([^"]*)"/.exec(html);
      f.version = m ? m[1] : '';
    } catch (e) { f.version = ''; }
  }
  return mf;
}

/** 批量重渲染：把目录里所有"有规格的"流程图刷新成当前版本，然后重建清单与首页。
 *  规格认 *.json（含 nodes 数组）与 *.mmd / *.md；产物名与规格同名（.html）。 */
async function cmdRefresh(dir, flags) {
  const target = resolve(dir || '.');
  if (!existsSync(target)) fail('目录不存在：' + target);
  const all = readdirSync(target);
  const isSpecJson = (f) => {
    try { const j = JSON.parse(readFileSync(join(target, f), 'utf8')); return j && Array.isArray(j.nodes) && j.nodes.length > 0; } catch (e) { return false; }
  };
  const isExport = (f) => {
    try { return readFileSync(join(target, f), 'utf8').slice(0, 400).includes('workflow-visualizer 导出件'); } catch (e) { return false; }
  };
  const specs = all.filter((f) => /\.(json|mmd|markdown|md)$/i.test(f)).filter((f) => {
    if (/^流程索引\.json$/i.test(f)) return false;
    if (/\.json$/i.test(f)) return isSpecJson(f);
    if (isExport(f)) return false;                 // 本 skill 导出的产物：不是源
    // 同名有 .json 规格时跳过 .mmd/.md —— 那些多半是本 skill 导出的产物，拿它当源会丢 id/形状
    const base = f.replace(/\.(mmd|markdown|md)$/i, '');
    return !all.includes(base + '.json');
  });
  if (!specs.length) { process.stdout.write('flow: 这个目录里没有可刷新的规格文件（*.json 含 nodes / *.mmd）\n'); return 0; }
  let n = 0;
  for (const f of specs) {
    const spec = join(target, f);
    const base = f.replace(/\.(json|mmd|markdown|md)$/i, '');
    const out = join(target, base + '.html');
    // 输入是 .mmd/.md 时**不要**写 <同名>.mmd：那正是源文件本身，会被导出结果改写（注释、顺序、保留字 id 全丢）
    const isMmdSource = /\.(mmd|markdown|md)$/i.test(f);
    // 护栏：Mermaid 语法存不下 时间/负责人/说明/备注。若同名产物里已经有这些字段，
    // 用 .mmd 重渲染就会把它们抹掉（踩过一次）—— 这里直接跳过并提示改 .json。
    if (isMmdSource && existsSync(out)) {
      try {
        const prev = readFileSync(out, 'utf8');
        const j = /<script id="flow-data" type="application\/json">([\s\S]*?)<\/script>/.exec(prev);
        if (j) {
          const d = JSON.parse(j[1]);
          const rich = (d.nodes || []).filter((n) => n.time || n.owner || n.detail || n.note).length;
          if (rich) {
            process.stdout.write('  · 跳过 ' + f + '：同名产物里有 ' + rich + ' 个节点带时间/负责人/说明，.mmd 存不下这些字段\n    → 想重渲染请用 ' + base + '.json（或先把 .mmd 换成带字段的 JSON 源）\n');
            continue;
          }
        }
      } catch (e) { /* 读不出来就按原样继续 */ }
    }
    await cmdRender(spec, isMmdSource
      ? { out, svg: join(target, base + '-竖版.svg'), wrap: flags.wrap }
      : { out, all: true, wrap: flags.wrap });
    if (isMmdSource) {
      // --svg x.svg 的约定会再写一个 x-横版.svg；对 mmd 源来说就成了 "<base>-竖版-横版.svg"，清掉它
      const stray = join(target, base + '-竖版-横版.svg');
      if (existsSync(stray) && !/竖版-竖版/.test(base)) { try { rmSync(stray); } catch (e) { /* 删不掉就算了 */ } }
    }
    n++;
  }
  process.stdout.write(`flow: 已刷新 ${n} 张流程图 → ${target}\n`);
  return cmdIndex(target, flags);
}

async function cmdIndex(dir, flags) {
  const target = resolve(dir || '.');
  if (!existsSync(target)) fail('目录不存在：' + target);
  // 版本信息一起写进清单：首页据此标出"旧版渲染"并显示生成器版本
  const manifest = scanFlowsWithVersion(target);
  const out = flags.out ? resolve(flags.out) : join(target, FLOW_MANIFEST);
  writeOut(out, JSON.stringify(manifest, null, 2) + '\n');
  process.stdout.write(`flow: 收录 ${manifest.flows.length} 张流程图 → ${out}\n`);
  for (const f of manifest.flows) process.stdout.write(`  · ${f.title}  (${f.nodes} 环节 · ${f.mtime})\n`);

  // 静态首页（file:// 打开用的 index.html）同样是"生成时快照"，而且它还会把目录里
  // 非流程图的 .html 当成 dev 卡片列出来。只重建清单不重建首页，删掉的文件就会在
  // 首页上留下幽灵卡片（踩过：临时自测页删除后首页仍显示 _selftest）。
  try {
    const homeHtml = await buildHome({
      dir: target,
      baseHref: '',
      rootPath: target,
      port: Number(flags.port) || 8765,
      fileMode: true,
    });
    const homePath = join(target, 'index.html');
    writeOut(homePath, homeHtml);
    process.stdout.write('flow: 静态首页已同步 → ' + homePath + '\n');
  } catch (err) {
    process.stderr.write('flow: 静态首页生成失败（不影响清单）：' + err.message + '\n');
  }
  return 0;
}

function cmdPreview(target, flags) {
  if (!target) fail('用法：flow.mjs preview <流程图.html> [--out 对照预览.html]');
  const page = basename(resolve(target));
  const out = flags.out ? resolve(flags.out) : join(dirname(resolve(target)), '【电脑用】对照预览.html');
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>两版对照：手机竖屏 / 电脑横屏</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:16px;background:#0b0e13;color:#e7eaf0;
       font:13px/1.5 'Segoe UI','Microsoft YaHei',system-ui,sans-serif;
       display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap}
  .dev{background:#151b24;border:1px solid #2d3644;border-radius:14px;padding:10px;flex:0 0 auto}
  .dev h4{margin:0 0 8px;font-size:12px;font-weight:600;color:#93a0b3}
  iframe{border:0;border-radius:9px;background:#0e1116;display:block}
  .phone iframe{width:354px;height:632px}
  .desk  iframe{width:944px;height:632px}
  .mobile-tip{display:none;background:#1b2129;border:1px solid #2d3644;border-left:3px solid #4a9dff;
              border-radius:10px;padding:12px 14px;font-size:13px;line-height:1.7;max-width:640px}
  /* 手机上看这个对照页没意义（它是给电脑并排比对用的），只留提示，避免整页被缩小成一团 */
  @media (max-width:900px){
    .desk{display:none}
    .mobile-tip{display:block}
  }
</style>
</head>
<body>
  <div class="mobile-tip">
    这是<b>电脑上</b>用的并排对照页（左右两个固定宽度的框），手机上打开只会被整体缩小，看不出效果。<br>
    手机上请直接打开 <code>${xml(page)}</code> —— 它会自动选竖版并占满屏幕。
  </div>
  <div class="dev phone"><h4>手机竖屏 354×632　→　应自动选「竖版」</h4><iframe src="${xml(page)}"></iframe></div>
  <div class="dev desk"><h4>电脑横屏 944×632　→　应自动选「横版」</h4><iframe src="${xml(page)}"></iframe></div>
</body>
</html>
`;
  writeOut(out, html);
  process.stdout.write('flow: 对照预览 → ' + out + '\n');
  return 0;
}

function cmdCheck(input) {
  const spec = normalize(loadSpec(input));
  const { back, inc, out } = analyze(spec);
  const problems = [];
  const reachable = new Set();
  const roots = spec.nodes.filter((n) => inc.get(n.id).length === 0).map((n) => n.id);
  const walk = (id) => { if (reachable.has(id)) return; reachable.add(id); for (const e of out.get(id)) walk(e.to); };
  roots.forEach(walk);
  for (const n of spec.nodes) if (!reachable.has(n.id)) problems.push('节点不可达（没有任何入边且不是起点）：' + n.id);
  const isolated = spec.nodes.filter((n) => inc.get(n.id).length === 0 && out.get(n.id).length === 0);
  for (const n of isolated) problems.push('孤立节点（既无入边也无出边）：' + n.id);
  const noEnd = spec.nodes.every((n) => out.get(n.id).length > 0);
  if (noEnd) problems.push('没有终点：每个节点都有出边（可能有环）');
  process.stdout.write('flow: 节点 ' + spec.nodes.length + ' · 连线 ' + spec.edges.length + ' · 分组 ' + spec.groups.length + '\n');
  if (back.size) process.stdout.write('  ↺ 检测到 ' + back.size + ' 条回边（会走右侧旁路渲染）\n');
  if (!problems.length) process.stdout.write('  ✓ 结构检查通过\n');
  else for (const p of problems) process.stdout.write('  ! ' + p + '\n');
  // 退出码契约：0=通过 / 1=结构问题 / 2=参数或输入错误（fail()）
  return problems.length ? 1 : 0;
}

function cmdSample(flags) {
  const sample = {
      "title": "示例：饮品店 · 每日开店到闭店",
      "subtitle": "虚构示例，用来演示分组 / 时间窗 / 状态 / 判断 / 风险点；把它改成你自己的流程即可",
      "direction": "TD",
      "groups": [
          {
              "id": "g1",
              "label": "开店（08:00–09:30）",
              "members": [
                  "s",
                  "a",
                  "b",
                  "c"
              ]
          },
          {
              "id": "g2",
              "label": "营业（09:30–21:00）",
              "members": [
                  "d",
                  "e",
                  "f",
                  "g",
                  "h"
              ]
          },
          {
              "id": "g3",
              "label": "收尾（21:00–22:30）",
              "members": [
                  "i",
                  "j",
                  "k",
                  "l"
              ]
          }
      ],
      "nodes": [
          {
              "id": "s",
              "label": "08:00 到店",
              "kind": "start",
              "status": "done"
          },
          {
              "id": "a",
              "label": "开设备与巡检",
              "kind": "task",
              "time": "08:00–08:30",
              "owner": "店长",
              "status": "done",
              "detail": "咖啡机 / 制冰机 / 收银台 / 灭火器压力表"
          },
          {
              "id": "b",
              "label": "备料与试味",
              "kind": "task",
              "time": "08:30–09:10",
              "owner": "后厨",
              "status": "done",
              "detail": "研磨刻度、糖浆效期、试饮校准"
          },
          {
              "id": "c",
              "label": "开店前复检",
              "kind": "milestone",
              "time": "09:10–09:30",
              "owner": "店长",
              "status": "doing",
              "detail": "卫生 / 价签 / 外卖平台接单状态",
              "note": "复检不过先不开门，避免差评"
          },
          {
              "id": "d",
              "label": "09:30 开门营业",
              "kind": "task",
              "time": "09:30–11:00",
              "owner": "值班",
              "status": "doing"
          },
          {
              "id": "e",
              "label": "排队是否超过 8 单",
              "kind": "decision",
              "time": "11:00–13:00",
              "owner": "值班",
              "status": "todo",
              "detail": "判断要不要加开出杯位"
          },
          {
              "id": "f",
              "label": "开第二个出杯位",
              "kind": "risk",
              "time": "高峰",
              "owner": "值班",
              "status": "risk",
              "detail": "临时加人，注意冰槽与杯盖库存",
              "note": "库存不够时先限购单品"
          },
          {
              "id": "g",
              "label": "正常出杯",
              "kind": "task",
              "time": "高峰",
              "owner": "值班",
              "status": "todo"
          },
          {
              "id": "h",
              "label": "午后补货",
              "kind": "task",
              "time": "14:00–15:00",
              "owner": "后厨",
              "status": "hold",
              "detail": "牛奶 / 冰块 / 杯具 / 封口膜",
              "note": "等供应商到货，缺的先用替代品"
          },
          {
              "id": "i",
              "label": "21:00 停止接单",
              "kind": "task",
              "time": "21:00",
              "owner": "值班",
              "status": "todo"
          },
          {
              "id": "j",
              "label": "清洁与设备保养",
              "kind": "task",
              "time": "21:00–22:00",
              "owner": "后厨",
              "status": "todo",
              "detail": "磨豆机清粉、奶管冲洗、地面消毒"
          },
          {
              "id": "k",
              "label": "盘点与对账",
              "kind": "task",
              "time": "22:00–22:20",
              "owner": "店长",
              "status": "todo",
              "detail": "现金 / 平台流水 / 库存差异"
          },
          {
              "id": "l",
              "label": "22:30 闭店上报",
              "kind": "end",
              "status": "todo",
              "detail": "日报发到门店群，异常单独标注"
          }
      ],
      "edges": [
          {
              "from": "s",
              "to": "a"
          },
          {
              "from": "a",
              "to": "b"
          },
          {
              "from": "b",
              "to": "c"
          },
          {
              "from": "c",
              "to": "d",
              "label": "通过"
          },
          {
              "from": "d",
              "to": "e"
          },
          {
              "from": "e",
              "to": "f",
              "label": "超过 8 单"
          },
          {
              "from": "e",
              "to": "g",
              "label": "未超过"
          },
          {
              "from": "f",
              "to": "h"
          },
          {
              "from": "g",
              "to": "h"
          },
          {
              "from": "h",
              "to": "i"
          },
          {
              "from": "i",
              "to": "j"
          },
          {
              "from": "j",
              "to": "k"
          },
          {
              "from": "k",
              "to": "l"
          }
      ]
  };;
  const out = flags.out ? resolve(flags.out) : 'sample.json';
  writeOut(out, JSON.stringify(sample, null, 2) + '\n');
  process.stdout.write('flow: 已写出示例规格 → ' + out + '\n');
  return 0;
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const { flags, rest } = parseArgs(argv.slice(1));
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h' || flags.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (cmd === 'render') {
    if (!rest[0]) fail('用法：flow.mjs render <spec.json|spec.mmd> [--out x.html] [--svg x.svg] [--mmd x.mmd] [--all]');
    return cmdRender(rest[0], flags);
  }
  if (cmd === 'mermaid') {
    if (!rest[0]) fail('用法：flow.mjs mermaid <spec.json> [--out x.mmd]');
    const spec = normalize(loadSpec(rest[0]));
    const mmd = toMermaid(spec);
    if (flags.out) { writeOut(resolve(flags.out), mmd); process.stdout.write('flow: → ' + resolve(flags.out) + '\n'); }
    else process.stdout.write(mmd);
    return 0;
  }
  if (cmd === 'check') {
    if (!rest[0]) fail('用法：flow.mjs check <spec.json|spec.mmd>');
    return cmdCheck(rest[0]);
  }
  if (cmd === 'preview') return cmdPreview(rest[0], flags);
  if (cmd === 'index') return cmdIndex(rest[0], flags);
  if (cmd === 'sample') return cmdSample(flags);
    if (cmd === 'refresh') {
    return cmdRefresh(rest[0] || '.', flags);
  }
  fail('未知命令：' + cmd + '（可用：render / mermaid / check / index / refresh / preview / sample / help）');
}

const HELP = `flow.mjs — 业务流程 → 两版交互式流程图（竖版适配手机 / 横版适配电脑）+ Mermaid 源码
零依赖、纯离线，不请求任何 CDN。

用法：
  node flow.mjs render  <spec.json|spec.mmd> [--out x.html] [--all] [--svg x.svg] [--mmd x.mmd] [--wrap N] [--debug]
  node flow.mjs refresh <目录>          批量重渲染该目录里所有规格（*.json 含 nodes / *.mmd），并重建清单与首页
  node flow.mjs mermaid <spec.json> [--out x.mmd]
  node flow.mjs check   <spec.json|spec.mmd>
  node flow.mjs preview <流程图.html> [--out 对照预览.html]   # 一页并排看手机/电脑两版
  node flow.mjs index   <目录>                        # 重建清单 + 同步 file:// 静态首页 index.html
  node flow.mjs sample  [--out sample.json]
  node flow.mjs help

输入：
  *.json                 完整规格（title / subtitle / direction / wrap / groups / nodes / edges）
  *.mmd *.mermaid         Mermaid flowchart 子集
  *.md                    自动抽取第一个 \`\`\`mermaid 代码块

输出：
  一个 HTML，内含两个版式，按窗口比例自动选，底部可手动切「竖版 / 横版」：
    · 竖版 portrait   单列纵向，适配手机；宽屏下高度自适应滚动
    · 横版 landscape  长流程自动分栏（可 --wrap N 指定行数），适配电脑一屏
  目录里的「流程索引.json」收录本 skill 生成的全部流程图，
  页面右上角「全部流程图」按钮会弹出抽屉切换（HTTP 打开时自动刷新）。
  --all 额外输出 <名>-竖版.svg / <名>-横版.svg 与 <名>.mmd
  --wrap 0       关闭分栏（横版=竖版）
  --wrap N       横版固定每栏 N 行
  --debug        打印两版的栏数/行数与各栏成员
`;

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
