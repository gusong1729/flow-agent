// 数采任务统筹 Agent · Tauri 壳
//
// 这里只做 WebView 做不了的两件事：
//   1. 代发模型请求（WebView 来源是 tauri.localhost，各家 API 都不发 CORS 头）
//   2. 用 Windows DPAPI 加密保存供应商配置（Key 不能明文躺在磁盘上）
//
// 渲染不在这里——渲染器已被移植进 WebView（src/renderer/flow-browser.js），
// 所以这个 exe 不需要用户装 Node，也不需要打包 Node sidecar。

// 关键：不给 Windows 附一个控制台窗口。
// 没有这一行，双击 exe 会先弹一个黑框；带上之后就是一个正常的 GUI 程序。
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::ffi::c_void;
use std::io::Write;
use std::path::PathBuf;

use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
struct CallResult {
    ok: bool,
    status: u16,
    /// 成功时是模型返回的原始 JSON
    data: Value,
    /// 失败时是一句人能看懂的原因
    error: String,
}

#[tauri::command]
async fn call_model(url: String, headers: HashMap<String, String>, body: Value) -> CallResult {
    let client = match reqwest::Client::builder()
        .user_agent("flow-agent/0.1")
        .timeout(std::time::Duration::from_secs(180))
        .build()
    {
        Ok(c) => c,
        Err(e) => {
            return CallResult {
                ok: false,
                status: 0,
                data: Value::Null,
                error: format!("HTTP 客户端初始化失败：{e}"),
            }
        }
    };

    let mut req = client.post(&url).json(&body);
    for (k, v) in &headers {
        req = req.header(k.as_str(), v.as_str());
    }

    let resp = match req.send().await {
        Ok(r) => r,
        Err(e) => {
            let mut msg = format!("请求失败：{e}");
            if e.is_timeout() {
                msg = "请求超时（180 秒）。检查网络或把 max_tokens 调小。".to_string();
            } else if e.is_connect() {
                msg = format!("连不上 {url}。检查 Base URL 与网络。");
            }
            return CallResult {
                ok: false,
                status: 0,
                data: Value::Null,
                error: msg,
            };
        }
    };

    let status = resp.status().as_u16();
    // 读响应体失败是 IO 问题，不能降级成空串再报「返回的不是 JSON」——那会把网络
    // 故障伪装成协议问题
    let text = match resp.text().await {
        Ok(t) => t,
        Err(e) => {
            return CallResult {
                ok: false,
                status,
                data: Value::Null,
                error: format!("读取响应体失败：{e}"),
            }
        }
    };

    let parsed: Value = match serde_json::from_str(&text) {
        Ok(v) => v,
        Err(_) => {
            // 非 JSON（网关错误页、HTML 拦截页）时把前 300 字带回去，便于定位
            let head: String = text.chars().take(300).collect();
            return CallResult {
                ok: false,
                status,
                data: Value::Null,
                error: format!("返回的不是 JSON（HTTP {status}）：{head}"),
            };
        }
    };

    if !(200u16..300).contains(&status) {
        // 先取成 owned String 再移动 parsed，否则借用检查不过
        let msg = parsed
            .get("error")
            .and_then(|e| e.get("message"))
            .and_then(|m| m.as_str())
            .or_else(|| {
                parsed
                    .get("base_resp")
                    .and_then(|b| b.get("status_msg"))
                    .and_then(|m| m.as_str())
            })
            .unwrap_or("模型接口返回了错误")
            .to_string();
        return CallResult {
            ok: false,
            status,
            data: parsed,
            error: msg,
        };
    }

    CallResult {
        ok: true,
        status,
        data: parsed,
        error: String::new(),
    }
}

// ───────────────────────── 配置持久化 ─────────────────────────
//
// 设计取舍：
//   · 存哪儿：`%APPDATA%\<identifier>\providers.dat`，不写仓库、不写程序目录。
//   · 怎么保护：用 Windows DPAPI（CryptProtectData，user scope）加密后再落盘。
//     加密密钥绑定当前 Windows 账户——文件被拷到别的机器/别的账户都解不开。
//   · 额外收紧 ACL：去掉继承，只给当前用户完全控制（DPAPI 之外的第二道）。
//   · 不引第三方 crate：crypt32 是系统 DLL，直接 FFI 调。

#[repr(C)]
struct DataBlob {
    cb_data: u32,
    pb_data: *mut u8,
}

#[link(name = "crypt32")]
extern "system" {
    fn CryptProtectData(
        data_in: *const DataBlob,
        descr: *const u16,
        entropy: *const DataBlob,
        reserved: *const c_void,
        prompt: *const c_void,
        flags: u32,
        data_out: *mut DataBlob,
    ) -> i32;

    fn CryptUnprotectData(
        data_in: *const DataBlob,
        descr: *mut *mut u16,
        entropy: *const DataBlob,
        reserved: *const c_void,
        prompt: *const c_void,
        flags: u32,
        data_out: *mut DataBlob,
    ) -> i32;
}

#[link(name = "kernel32")]
extern "system" {
    fn LocalFree(mem: *mut c_void) -> *mut c_void;
}

/// DPAPI 加密。flags=CRYPTPROTECT_LOCAL_MACHINE → **machine scope**：
/// 只绑这台电脑，不绑当前 Windows 账户。换账户打开同一个文件夹仍可读，
/// 但文件被拷到别的机器上解不开。
const CRYPTPROTECT_LOCAL_MACHINE: u32 = 0x4;
fn dpapi_encrypt(plain: &[u8]) -> Result<Vec<u8>, String> {
    if plain.is_empty() {
        return Err("要保存的内容为空".into());
    }
    let input = DataBlob {
        cb_data: plain.len() as u32,
        pb_data: plain.as_ptr() as *mut u8,
    };
    let mut out = DataBlob {
        cb_data: 0,
        pb_data: std::ptr::null_mut(),
    };
    let ok = unsafe {
        CryptProtectData(
            &input,
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null(),
            CRYPTPROTECT_LOCAL_MACHINE,
            &mut out,
        )
    };
    if ok == 0 {
        return Err(format!("DPAPI 加密失败：{}", std::io::Error::last_os_error()));
    }
    let bytes = unsafe { std::slice::from_raw_parts(out.pb_data, out.cb_data as usize) }.to_vec();
    unsafe {
        LocalFree(out.pb_data as *mut c_void);
    }
    Ok(bytes)
}

fn dpapi_decrypt(cipher: &[u8]) -> Result<Vec<u8>, String> {
    if cipher.is_empty() {
        return Err("配置文件是空的".into());
    }
    let input = DataBlob {
        cb_data: cipher.len() as u32,
        pb_data: cipher.as_ptr() as *mut u8,
    };
    let mut out = DataBlob {
        cb_data: 0,
        pb_data: std::ptr::null_mut(),
    };
    let ok = unsafe {
        CryptUnprotectData(
            &input,
            std::ptr::null_mut(),
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null(),
            CRYPTPROTECT_LOCAL_MACHINE,
            &mut out,
        )
    };
    if ok == 0 {
        return Err(format!(
            "配置解密失败（换过电脑，或文件被改过）：{}",
            std::io::Error::last_os_error()
        ));
    }
    let bytes = unsafe { std::slice::from_raw_parts(out.pb_data, out.cb_data as usize) }.to_vec();
    unsafe {
        LocalFree(out.pb_data as *mut c_void);
    }
    Ok(bytes)
}

/// 数据放哪儿：**程序所在目录下的 `data\`**。
///
/// 为什么不用 %APPDATA%：
///   1. 路径短，用户一眼能找到，分享时也好解释；
///   2. 便携——整个文件夹拷走就是全部状态；
///   3. **卸载即清干净**：删掉程序目录，配置和浏览器缓存一起没了，不留痕迹。
///
/// 只有一种情况退到 %LOCALAPPDATA%\FlowAgent\：程序被放在没有写权限的地方
/// （比如 Program Files）。这时会在界面里显示实际路径，不静默换地方。
fn data_dir() -> Result<PathBuf, String> {
    let exe = std::env::current_exe().map_err(|e| format!("取程序路径失败：{e}"))?;
    let base = exe
        .parent()
        .ok_or("取程序所在目录失败")?
        .join("data");

    // 探一下可写性：能建目录且能在里面写文件才算数
    if std::fs::create_dir_all(&base).is_ok() {
        let probe = base.join(".write-test");
        if std::fs::write(&probe, b"ok").is_ok() {
            let _ = std::fs::remove_file(&probe);
            return Ok(base);
        }
    }

    let fallback = std::env::var("LOCALAPPDATA")
        .map(PathBuf::from)
        .map_err(|_| "程序目录不可写，且拿不到 LOCALAPPDATA".to_string())?
        .join("FlowAgent");
    std::fs::create_dir_all(&fallback).map_err(|e| format!("建数据目录失败：{e}"))?;
    Ok(fallback)
}

fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let _ = app; // 路径不再依赖 app data 目录
    let dir = data_dir()?;
    Ok(dir.join("config.dat"))
}

/// 收紧文件权限：只给当前用户完全控制，然后去掉继承。
///
/// 顺序很重要：**先 grant 成功再 /inheritance:r**。
/// 反过来的话，一旦 grant 因为用户名含空格/中文或域前缀缺失而失败，
/// 文件就只剩一个可能不对的 owner，下次自己都读不出来 —— 配置会"凭空消失"。
/// 所以两步分开跑，任一步失败就整体放弃（DPAPI 已是主防线，ACL 只是第二道）。
fn tighten_acl(path: &std::path::Path) -> Result<(), String> {
    let user = std::env::var("USERNAME").unwrap_or_default();
    if user.is_empty() {
        return Ok(());
    }
    // 带上域前缀并整体加引号，避免 "Domain User" 这类含空格的名字被拆参
    let spec = format!("\"{user}:F\"");
    let grant = std::process::Command::new("icacls")
        .arg(path)
        .arg("/grant:r")
        .arg(&spec)
        .output()
        .map_err(|e| format!("icacls 无法执行：{e}"))?;
    if !grant.status.success() {
        return Err(format!("grant 失败：{}", String::from_utf8_lossy(&grant.stdout).trim()));
    }
    let inherit = std::process::Command::new("icacls")
        .arg(path)
        .arg("/inheritance:r")
        .output()
        .map_err(|e| format!("icacls 无法执行：{e}"))?;
    if !inherit.status.success() {
        return Err(format!("去继承失败：{}", String::from_utf8_lossy(&inherit.stdout).trim()));
    }
    Ok(())
}

#[tauri::command]
fn load_config(app: tauri::AppHandle) -> Result<String, String> {
    let path = config_path(&app)?;
    if !path.exists() {
        return Ok(String::new());
    }
    let cipher = std::fs::read(&path).map_err(|e| format!("读配置失败：{e}"))?;

    // 换过电脑 / 文件被改过时解不开。这时不要把用户卡在错误里：
    // 把坏文件改名留证，按"还没配置"启动，让用户重填一次即可。
    let plain = match dpapi_decrypt(&cipher) {
        Ok(p) => p,
        Err(_) => {
            let stamp = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            let _ = std::fs::rename(&path, path.with_file_name(format!("config.bad-{stamp}.dat")));
            return Ok(String::new());
        }
    };
    String::from_utf8(plain).map_err(|e| format!("配置不是合法 UTF-8：{e}"))
}

#[tauri::command]
fn save_config(app: tauri::AppHandle, json: String) -> Result<(), String> {
    let path = config_path(&app)?;
    let cipher = dpapi_encrypt(json.as_bytes())?;

    // 先写临时文件再改名，避免写到一半断电把配置写坏。
    // 临时名带 pid + 纳秒：连续两次保存（用户连改两个 Key）不会互相截断。
    let stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let tmp = path.with_extension(format!("dat.{}.{stamp}.tmp", std::process::id()));

    {
        let mut f = std::fs::File::create(&tmp).map_err(|e| format!("写临时文件失败：{e}"))?;
        f.write_all(&cipher).map_err(|e| format!("写配置失败：{e}"))?;
        // fsync 失败不吞：写完却落不了盘，等于骗用户"存上了"
        f.sync_all().map_err(|e| format!("flush 到磁盘失败：{e}"))?;
    }

    if let Err(e) = std::fs::rename(&tmp, &path) {
        let _ = std::fs::remove_file(&tmp);
        return Err(format!("落盘失败：{e}"));
    }

    // ACL 失败不致命，但要让用户知道"加密在、额外权限收紧没生效"
    if let Err(e) = tighten_acl(&path) {
        eprintln!("warn: {e}");
    }
    Ok(())
}

/// GUI 子系统没有控制台，panic 会表现为"双击后什么也没发生"。
/// 所以把致命错误写成日志 + 弹一个系统对话框，用户至少知道发生了什么。
fn report_fatal(msg: &str) {
    let log = std::env::var("APPDATA")
        .map(std::path::PathBuf::from)
        .map(|p| p.join("com.ohworkspace.flowagent").join("last-error.log"));
    if let Ok(log) = log {
        if let Some(dir) = log.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(&log, msg.as_bytes());
    }

    #[cfg(windows)]
    unsafe {
        let title: Vec<u16> = "流程图agent 启动失败 ".encode_utf16().collect();
        let body: Vec<u16> = format!("{msg}

已写入 last-error.log").encode_utf16().collect();
        MessageBoxW(std::ptr::null_mut(), body.as_ptr(), title.as_ptr(), 0x10);
    }
}

#[cfg(windows)]
#[link(name = "user32")]
extern "system" {
    fn MessageBoxW(hwnd: *mut c_void, text: *const u16, caption: *const u16, utype: u32) -> i32;
}

fn main() {
    // 第二个实例会撞 WebView2 的 user-data 锁（报 0x800700AA）。不要在用户面前直接崩。
    let result = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![call_model, load_config, save_config])
        .setup(|app| {
            // 窗口在代码里建，只为了把 WebView2 的缓存目录也塞进 data/。
            // 否则卸载后 %LOCALAPPDATA% 下仍会留下一坨浏览器缓存，不算"清干净"。
            let dir = data_dir().map_err(|e| Box::<dyn std::error::Error>::from(e))?;
            let cache = dir.join("webview2");
            std::fs::create_dir_all(&cache)?;

            tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("index.html".into()))
                .title("流程图agent · 数采任务统筹")
                .inner_size(1440.0, 900.0)
                .min_inner_size(960.0, 640.0)
                .center()
                .data_directory(cache)
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!());

    if let Err(e) = result {
        report_fatal(&format!(
            "窗口创建失败：{e}

常见原因：已经有一个流程图agent 在运行（WebView2 的用户数据目录被占用）。
请先关掉它再启动。"
        ));
    }
}
