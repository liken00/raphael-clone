/**
 * 飞书消息推送脚本 — Codex CLI 使用
 * 
 * 用法:
 *   node scripts/send-feishu.mjs --to <chat_id|open_id> --text "你好"
 *   node scripts/send-feishu.mjs --to <chat_id> --type interactive --card '{"config":{"wide_screen_mode":true},"header":{"title":{"tag":"plain_text","content":"标题"}},"elements":[{"tag":"div","text":{"tag":"lark_md","content":"内容"}}]}'
 *   node scripts/send-feishu.mjs --list
 * 
 * 参数:
 *   --to        接收方 ID (chat_id, open_id, union_id, user_id)
 *   --type      消息类型: text (默认), post, interactive
 *   --text      文本消息内容 (--type=text 时使用)
 *   --card      JSON 格式的卡片内容 (--type=interactive 时使用)
 *   --id-type   接收方 ID 类型: chat_id (默认), open_id, union_id, user_id
 *   --list      列出最近的聊天会话
 *   --help      显示帮助
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------- 加载 .env.local ----------
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

// ---------- 参数解析 ----------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { to: "", bot: false, type: "text", text: "", card: "", idType: "chat_id", list: false, help: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--to":       opts.to = args[++i] || ""; break;
      case "--type":     opts.type = args[++i] || "text"; break;
      case "--text":     opts.text = args[++i] || ""; break;
      case "--card":     opts.card = args[++i] || ""; break;
      case "--id-type":  opts.idType = args[++i] || "chat_id"; break;
      case "--list":     opts.list = true; break;
      case "--bot":     opts.bot = true; break;
      case "--help":
      case "-h":         opts.help = true; break;
      default:
        if (!opts.text) opts.text = args[i];
    }
  }
  return opts;
}

// ---------- 获取 Tenant Access Token ----------
const TOKEN_CACHE = { token: "", expiresAt: 0 };

async function getTenantAccessToken() {
  const now = Date.now();
  if (TOKEN_CACHE.token && TOKEN_CACHE.expiresAt > now + 60_000) {
    return TOKEN_CACHE.token;
  }

  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("❌ 请在 .env.local 中设置 FEISHU_APP_ID 和 FEISHU_APP_SECRET");
  }

  const resp = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data = await resp.json();

  if (!data.tenant_access_token) {
    throw new Error(`❌ 获取 Token 失败: ${data.msg || JSON.stringify(data)}`);
  }

  TOKEN_CACHE.token = data.tenant_access_token;
  TOKEN_CACHE.expiresAt = now + (data.expire || 7200) * 1000;
  return TOKEN_CACHE.token;
}

// ---------- 发送消息 ----------
async function sendMessage(token, { receiveId, receiveIdType, msgType, content }) {
  const url = new URL("https://open.feishu.cn/open-apis/im/v1/messages");
  url.searchParams.set("receive_id_type", receiveIdType);

  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      receive_id: receiveId,
      msg_type: msgType,
      content: content,
    }),
  });
  const data = await resp.json();

  if (data.code !== 0) {
    throw new Error(`发送失败: ${data.msg || JSON.stringify(data)}`);
  }
  return data;
}

// ---------- 列出会话（从本地历史）----------
function listSessions() {
  const dataDir = path.join(ROOT, "data", "feishu-history");
  if (!fs.existsSync(dataDir)) {
    console.log("ℹ️  暂无飞书聊天记录");
    return;
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
  const sessions = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
      const messages = JSON.parse(raw);
      if (messages.length === 0) continue;
      const last = messages[messages.length - 1];
      sessions.push({
        chatId: last.chatId,
        chatName: last.chatName || last.chatId,
        lastTime: last.createTime,
        count: messages.length,
      });
    } catch { /* skip */ }
  }

  sessions.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

  if (sessions.length === 0) {
    console.log("ℹ️  暂无飞书聊天记录");
    return;
  }

  console.log("📋  最近的飞书聊天会话:\n");
  console.log("  chat_id                                  | 名称                | 消息数 | 最后活跃");
  console.log("  " + "-".repeat(80));
  for (const s of sessions) {
    const time = new Date(s.lastTime).toLocaleString("zh-CN");
    console.log(`  ${s.chatId.padEnd(42)} | ${(s.chatName || "").padEnd(18)} | ${String(s.count).padStart(5)}  | ${time}`);
  }
}

// ---------- 显示机器人信息 ----------
async function showBotInfo(token) {
  const resp = await fetch("https://open.feishu.cn/open-apis/bot/v3/info", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  if (data.code === 0) {
    console.log(`🤖  机器人名称: ${data.bot.app_name}`);
    console.log(`   App ID: ${process.env.FEISHU_APP_ID}`);
    console.log(`   描述: ${data.bot.description || "无"}`);
    return data.bot;
  }
  console.log("❌ 获取机器人信息失败:", data.msg || JSON.stringify(data));
  return null;
}

// ---------- 主流程 ----------
async function main() {
  const opts = parseArgs();

  if (opts.help) {
    console.log(`
飞书消息推送工具 — 让 Codex 直接发送消息到飞书

用法:
  node scripts/send-feishu.mjs --to <chat_id> --text "消息内容"
  node scripts/send-feishu.mjs --to <chat_id> --type interactive --card '<JSON>'
  node scripts/send-feishu.mjs --list
  node scripts/send-feishu.mjs --bot

参数:
  --to        接收方 ID (默认: chat_id)
  --id-type   接收方 ID 类型: chat_id(默认), open_id, union_id, user_id
  --type      消息类型: text(默认), post, interactive
  --text      文本内容
  --card      卡片 JSON 内容 (interactive 类型)
  --list      列出本地记录的聊天会话
  --bot       显示机器人信息
  --help      显示此帮助

示例:
  # 发送文本消息
  node scripts/send-feishu.mjs --to oc_xxxxxxxxxx --text "Codex 给你发消息啦！"

  # 发送交互卡片
  node scripts/send-feishu.mjs --to oc_xxxxxxxxxx --type interactive --card '{"config":{"wide_screen_mode":true},"header":{"title":{"tag":"plain_text","content":"通知"}},"elements":[{"tag":"div","text":{"tag":"lark_md","content":"有新的更新！"}}]}'

  # 查看机器人信息
  node scripts/send-feishu.mjs --bot
`);
    return;
  }

  const token = await getTenantAccessToken();

  if (opts.list) {
    listSessions();
    console.log("");
    await showBotInfo(token);
    return;
  }

  if (opts.bot) {
    await showBotInfo(token);
    return;
  }

  if (!opts.to) {
    console.error("❌ 请指定 --to 参数（接收方 ID）");
    console.log("   使用 --list 查看可用的 chat_id");
    process.exit(1);
  }

  // 构建消息内容
  let msgType = opts.type;
  let content = "";

  switch (opts.type) {
    case "text":
      content = JSON.stringify({ text: opts.text || opts.to });
      break;
    case "interactive":
      try {
        const cardObj = JSON.parse(opts.card);
        content = JSON.stringify(cardObj);
      } catch {
        console.error("❌ --card 参数需要是有效的 JSON 字符串");
        process.exit(1);
      }
      break;
    case "post":
      content = opts.post || opts.text;
      if (!content.startsWith("{")) {
        console.error("❌ post 类型需要 JSON 格式内容");
        process.exit(1);
      }
      break;
    default:
      msgType = "text";
      content = JSON.stringify({ text: opts.text || opts.to });
  }

  console.log(`📤  正在发送消息到 ${opts.to} ...`);
  console.log(`   类型: ${msgType}`);

  const result = await sendMessage(token, {
    receiveId: opts.to,
    receiveIdType: opts.idType,
    msgType,
    content,
  });

  console.log(`✅ 消息发送成功!`);
  console.log(`   消息 ID: ${result.data?.message_id}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});


