import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data", "feishu-history");

// ---------- 加载 .env.local ----------
function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}
loadEnv();

// ---------- Token 缓存 ----------
const TOKEN_CACHE = { token: "", expiresAt: 0 };
async function getTenantAccessToken() {
  const now = Date.now();
  if (TOKEN_CACHE.token && TOKEN_CACHE.expiresAt > now + 60000) return TOKEN_CACHE.token;
  const resp = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: process.env.FEISHU_APP_ID, app_secret: process.env.FEISHU_APP_SECRET }),
  });
  const data = await resp.json();
  if (!data.tenant_access_token) throw new Error(`Token failed: ${data.msg || JSON.stringify(data)}`);
  TOKEN_CACHE.token = data.tenant_access_token;
  TOKEN_CACHE.expiresAt = now + (data.expire || 7200) * 1000;
  return TOKEN_CACHE.token;
}

// ---------- 事件解密 ----------
function decryptEvent(encryptedBase64) {
  const encryptKey = process.env.FEISHU_ENCRYPT_KEY;
  if (!encryptKey) throw new Error("FEISHU_ENCRYPT_KEY not configured");
  const key = Buffer.from(encryptKey, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");
  if (encrypted.length < 17) throw new Error("Invalid encrypted data");
  const iv = encrypted.subarray(0, 16);
  const ciphertext = encrypted.subarray(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(true);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf-8");
}

// ---------- 发送消息 ----------
async function sendMessage(token, { receiveId, receiveIdType, msgType, content }) {
  const url = new URL("https://open.feishu.cn/open-apis/im/v1/messages");
  url.searchParams.set("receive_id_type", receiveIdType);
  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ receive_id: receiveId, msg_type: msgType, content }),
  });
  const data = await resp.json();
  if (data.code !== 0) throw new Error(`Send failed: ${data.msg || JSON.stringify(data)}`);
  return data;
}

// ---------- 获取群信息 ----------
async function getChatInfo(token, chatId) {
  try {
    const resp = await fetch(`https://open.feishu.cn/open-apis/im/v1/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    if (data.code === 0 && data.data) return data.data;
  } catch {}
  return null;
}

// ---------- AI 回复（DeepSeek）----------
async function generateAiReply(message, senderName, history) {
  const apiKey = process.env.FEISHU_AI_API_KEY;
  const apiBase = process.env.FEISHU_AI_API_BASE || "https://api.deepseek.com/v1";
  const model = process.env.FEISHU_AI_MODEL || "deepseek-chat";
  if (!apiKey) return null;

  const systemPrompt = `你是 Raphael AI 助手，被集成在飞书群聊中为用户提供帮助。

## 你的角色
- 你是一个有用、友好、专业的 AI 助手
- 当群聊中有人 @你 或私聊你时，你需要回答问题
- 你的回复应当简洁、准确、有用

## 回复风格
- 使用和提问者相同的语言回复（中文/英文）
- 保持回复简洁（80 字以内为宜），除非对方要求详细解释
- 使用飞书消息支持的纯文本格式，不要使用 markdown 格式
- 如果问题超出你的知识范围，诚实告知

## 上下文
- 你会看到最近的聊天记录作为上下文
- 基于上下文信息做出恰当的回复
- 如果不知道用户问的是什么，礼貌地请用户提供更多信息`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).map(m => ({ role: m.role, content: `${m.senderName}: ${m.content}` })),
    { role: "user", content: `${senderName}: ${message}` },
  ];

  try {
    const resp = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, max_tokens: 1000, temperature: 0.7 }),
      signal: AbortSignal.timeout(30000),
    });
    if (!resp.ok) { console.error(`AI API error: ${resp.status}`); return null; }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) { console.error("AI reply error:", e.message); return null; }
}

// ---------- 保存消息历史 ----------
function saveMessage(msg) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, `${msg.chatId}.json`);
  let messages = [];
  if (fs.existsSync(filePath)) {
    try { messages = JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch {}
  }
  messages.push(msg);
  if (messages.length > 1000) messages = messages.slice(messages.length - 1000);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf-8");
}

function getRecentContext(chatId, limit = 20) {
  const filePath = path.join(DATA_DIR, `${chatId}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const all = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return all.slice(-limit);
  } catch { return []; }
}

// ---------- 处理消息事件 ----------
async function handleMessage(event) {
  const { message, sender } = event;
  if (message.message_type !== "text") return;

  const isMentioned = message.mentions?.some(m => m.id.open_id === "bot" || m.name === "Raphael AI");
  if (message.chat_type === "group" && !isMentioned) return;

  let textContent = "";
  try { const p = JSON.parse(message.content); textContent = p.text || message.content; } catch { textContent = message.content; }
  const cleanText = textContent.replace(/@_user_\d+/g, "").replace(/@\S+/g, "").trim();
  if (!cleanText) return;

  const token = await getTenantAccessToken();
  let chatName = message.chat_id;
  if (message.chat_type === "group") {
    const info = await getChatInfo(token, message.chat_id);
    chatName = info?.name || message.chat_id;
  }

  saveMessage({
    id: message.message_id,
    chatId: message.chat_id,
    chatName,
    senderId: sender.sender_id.open_id,
    senderName: "用户",
    content: cleanText,
    messageType: "text",
    isBot: false,
    createTime: message.create_time,
  });

  const recent = getRecentContext(message.chat_id, 20);
  const history = recent.map(m => ({ role: m.isBot ? "assistant" : "user", senderName: m.senderName, content: m.content }));

  const reply = await generateAiReply(cleanText, "用户", history);
  if (!reply) return;

  try {
    const sendResp = await sendMessage(token, {
      receiveId: message.chat_id,
      receiveIdType: "chat_id",
      msgType: "text",
      content: JSON.stringify({ text: reply }),
    });
    if (sendResp?.data?.message_id) {
      saveMessage({
        id: sendResp.data.message_id,
        chatId: message.chat_id,
        chatName,
        senderId: "bot",
        senderName: "Raphael AI",
        content: reply,
        messageType: "text",
        isBot: true,
        createTime: new Date().toISOString(),
      });
    }
    console.log(`✅ 已回复 ${message.chat_id}: ${reply.slice(0, 60)}...`);
  } catch (e) {
    console.error("发送回复失败:", e.message);
  }
}

// ---------- HTTP 服务器 + ngrok 启动 ----------
const PORT = 3000;
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ status: "ok", service: "Feishu Bot Webhook", uptime: process.uptime() }));
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const payload = (() => {
          const p = JSON.parse(body);
          if (p.encrypt) return JSON.parse(decryptEvent(p.encrypt));
          return p;
        })();

        if (payload.type === "url_verification") {
          console.log("🔗 URL verification received");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ challenge: payload.challenge }));
          return;
        }

        const verToken = process.env.FEISHU_VERIFICATION_TOKEN;
        if (verToken && payload.header?.token !== verToken) {
          console.warn("❌ Invalid verification token");
          res.writeHead(401);
          res.end(JSON.stringify({ error: "Invalid token" }));
          return;
        }

        if (payload.header?.event_type === "im.message.receive_v1") {
          console.log(`📩 收到消息 from ${payload.event.message.chat_id}`);
          handleMessage(payload.event).catch(e => console.error("处理消息失败:", e));
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ code: 0, msg: "success" }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ code: 0, msg: "ignored" }));
      } catch (e) {
        console.error("❌ Webhook 错误:", e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  res.writeHead(405); res.end();
});

server.listen(PORT, "0.0.0.0", async () => {
  console.log("")
  console.log("╔══════════════════════════════════════════════╗")
  console.log("║       Raphael AI 飞书机器人 Webhook 服务器    ║")
  console.log("╚══════════════════════════════════════════════╝")
  console.log(`  本地地址: http://localhost:${PORT}`)
  console.log(`  AI 模型: ${process.env.FEISHU_AI_MODEL || "deepseek-chat"}`)
  console.log(`  机器人: ${process.env.FEISHU_APP_ID}`)
  console.log("")

  // 启动 ngrok
  const ngrokPath = path.join(ROOT, "ngrok.exe");
  const configPath = path.join(ROOT, "ngrok.yml");
  console.log("🚀 正在启动 ngrok 隧道...")
  const ngrok = spawn(ngrokPath, ["http", String(PORT), "--config", configPath, "--log=stdout"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });

  ngrok.stdout.on("data", (data) => {
    const line = data.toString();
    process.stdout.write(line);
    const match = line.match(/url=https:\/\/([^\s]+)/);
    if (match) {
      console.log("")
      console.log("✅✅✅ ngrok 隧道已建立!")
      console.log(`   Tunnel URL: https://${match[1]}`)
      console.log(`   Webhook:    https://${match[1]}/api/feishu/webhook`)
      console.log("")
      console.log("📋 请在飞书开放平台配置事件订阅 URL 为此地址")
      console.log("💬 然后去飞书群里 @国龙 发消息测试")
    }
  });

  ngrok.stderr.on("data", (data) => {
    process.stderr.write(data.toString());
  });

  ngrok.on("error", (err) => console.error("ngrok error:", err.message));
  ngrok.on("exit", (code) => console.log(`ngrok exited with code ${code}`));
});
