"""通过 GitHub Git Data API 推送提交（用 gh CLI 发请求）。

为什么不用 git push：本机到 github.com:443 不通，但 api.github.com 通（走 gh 的 Go TLS）。
Python 直连 api.github.com 会偶发 SSL EOF，所以统一交给 `gh api`。

用法：python tools/gh-push-api.py <owner/repo> [branch]
"""
import base64
import json
import pathlib
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor

REPO = sys.argv[1] if len(sys.argv) > 1 else "gusong1729/flow-agent"
BRANCH = sys.argv[2] if len(sys.argv) > 2 else "main"
ROOT = pathlib.Path(__file__).resolve().parents[1]
TMP = pathlib.Path(tempfile.mkdtemp(prefix="ghpush-"))


def gh_api(path: str, method: str = "GET", payload=None):
    cmd = ["gh", "api", "--method", method, path]
    if payload is not None:
        f = TMP / f"p{abs(hash(json.dumps(payload, sort_keys=True, default=str))) % 10**9}.json"
        f.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        cmd += ["--input", str(f)]
    out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if out.returncode != 0:
        raise RuntimeError(f"gh api {path} 失败: {out.stderr.strip()[:300]}")
    return json.loads(out.stdout) if out.stdout.strip() else {}


refs = gh_api(f"/repos/{REPO}/git/refs")
branch_ref = next((r for r in refs if r["ref"] == f"refs/heads/{BRANCH}"), None)
if branch_ref is None:
    raise SystemExit(f"{REPO} 还没有 {BRANCH} 分支的初始提交；先手动种一个。")
parent = branch_ref["object"]["sha"]
print(f"父提交 {parent}")

# core.quotepath=false + -z：否则 git 会把中文路径转成 "ç©º" 这种八进制转义
files = [
    f
    for f in subprocess.run(
        ["git", "-c", "core.quotepath=false", "ls-files", "-z"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",   # Windows 默认 GBK，中文路径会解码失败
        check=True,
    ).stdout.split(chr(0))
    if f
]
print(f"待推送 {len(files)} 个文件 → {REPO}#{BRANCH}")


def make_blob(rel: str):
    raw = (ROOT / rel).read_bytes()
    res = gh_api(
        f"/repos/{REPO}/git/blobs",
        "POST",
        {"content": base64.b64encode(raw).decode(), "encoding": "base64"},
    )
    return rel, res["sha"], len(raw)


entries = []
total = 0
with ThreadPoolExecutor(max_workers=4) as pool:
    for i, (rel, sha, size) in enumerate(pool.map(make_blob, files), 1):
        entries.append({"path": rel, "mode": "100644", "type": "blob", "sha": sha})
        total += size
        if i % 15 == 0:
            print(f"  …{i}/{len(files)}")

print(f"blob 完成，共 {total / 1024:.0f} KB")

tree = gh_api(f"/repos/{REPO}/git/trees", "POST", {"tree": entries})
msg = subprocess.run(
    ["git", "log", "-1", "--pretty=%B"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True
).stdout.strip()

commit = gh_api(
    f"/repos/{REPO}/git/commits",
    "POST",
    {"message": msg, "tree": tree["sha"], "parents": [parent]},
)
print(f"commit {commit['sha']}")

gh_api(
    f"/repos/{REPO}/git/refs/heads/{BRANCH}",
    "PATCH",
    {"sha": commit["sha"], "force": True},
)
print(f"已推送 → https://github.com/{REPO}/tree/{BRANCH}")
