import { NextRequest, NextResponse } from "next/server"
import {
  sendMessage,
  buildTextContent,
  decryptEvent,
} from "@/lib/feishu"
import { saveMessage, getRecentContext, ChatMessage } from "@/lib/feishu-history"
import { generateAiReply } from "@/lib/feishu-ai"

// ---------- Feishu event types ----------

interface FeishuEncryptedPayload {
  encrypt: string
}

interface FeishuChallenge {
  type: "url_verification"
  token: string
  challenge: string
}

interface FeishuEventCallback {
  schema: string
  header: {
    event_id: string
    event_type: string
    create_time: string
    token: string
    app_id: string
    tenant_key: string
  }
  event: {
    sender: {
      sender_id: { open_id: string; union_id?: string; user_id?: string }
      sender_type: "user"
      tenant_key: string
    }
    message: {
      message_id: string
      root_id?: string
      parent_id?: string
      chat_id: string
      chat_type: "group" | "p2p"
      message_type: "text" | "post" | "image" | "file" | "audio" | "media" | "sticker" | "interactive"
      content: string
      create_time: string
      mentions?: Array<{
        key: string
        name: string
        id: { open_id?: string; user_id?: string }
      }>
    }
  }
}

// ---------- Try to decrypt payload if encrypted ----------

function parsePayload(rawBody: string): any {
  // Check if payload is encrypted
  try {
    const parsed = JSON.parse(rawBody)
    if (parsed.encrypt) {
      const decrypted = decryptEvent(parsed.encrypt)
      return JSON.parse(decrypted)
    }
    return parsed
  } catch (e) {
    throw new Error(`Failed to parse webhook payload: ${e}`)
  }
}

// ---------- Message handler ----------

async function handleMessage(event: FeishuEventCallback["event"]) {
  const { message, sender } = event

  // Only handle text messages for now
  if (message.message_type !== "text") {
    console.log(`Skipping non-text message type: ${message.message_type}`)
    return
  }

  // Check if bot is mentioned (or it's a p2p chat)
  const isMentioned = message.mentions?.some(
    (m) => m.id.open_id === "bot" || m.name === "Raphael AI" || m.name === "国龙",
  )
  if (message.chat_type === "group" && !isMentioned) {
    // In groups, only reply when @mentioned
    console.log("Not mentioned in group, skipping")
    return
  }

  // Parse text content (Feishu text content is JSON-encoded)
  let textContent = ""
  try {
    const parsed = JSON.parse(message.content)
    textContent = parsed.text || message.content
  } catch {
    textContent = message.content
  }

  // Clean @mentions from text
  const cleanText = textContent.replace(/@_user_\d+/g, "").replace(/@\S+/g, "").trim()

  if (!cleanText) {
    console.log("Empty text after cleaning mentions, skipping")
    return
  }

  // Get chat name
  let chatName = message.chat_id
  if (message.chat_type === "group") {
    try {
      const { getChatInfo } = await import("@/lib/feishu")
      const info = await getChatInfo(message.chat_id)
      chatName = info?.name || message.chat_id
    } catch {
      // fallback
    }
  }

  // Save user message to history
  const userMsg: ChatMessage = {
    id: message.message_id,
    chatId: message.chat_id,
    chatName,
    senderId: sender.sender_id.open_id,
    senderName: "用户",
    content: cleanText,
    messageType: "text",
    isBot: false,
    createTime: message.create_time,
  }

  try {   saveMessage(userMsg) } catch (e) { console.error("Failed to save message:", e) }

  // Get recent context for AI
  let recentMessages: any[] = []; try { recentMessages = getRecentContext(message.chat_id, 20) } catch (e) { console.error("Failed to get context:", e) }
  const history = recentMessages.map((m) => ({
    role: (m.isBot ? "assistant" : "user") as "user" | "assistant",
    content: `${m.senderName}: ${m.content}`,
  }))

  // Generate AI reply
  const reply = await generateAiReply({
    chatId: message.chat_id,
    chatName,
    message: cleanText,
    senderName: "用户",
    history,
  })

  if (!reply) {
    console.log("AI reply skipped (no API key or API error)")
    return
  }

  // Send reply back to the chat
  try {
    const sendResp = await sendMessage({
      receiveId: message.chat_id,
      receiveIdType: "chat_id",
      msgType: "text",
      content: buildTextContent(reply),
    })

    // Save bot reply to history
    if (sendResp?.data?.message_id) {
      const botMsg: ChatMessage = {
        id: sendResp.data.message_id,
        chatId: message.chat_id,
        chatName,
        senderId: "bot",
        senderName: "Raphael AI",
        content: reply,
        messageType: "text",
        isBot: true,
        createTime: new Date().toISOString(),
      }
          try {   saveMessage(botMsg) } catch (e) { console.error("Failed to save bot message:", e) }
    }
  } catch (error) {
    console.error("Failed to send AI reply:", error)
  }
}

// ---------- POST handler ----------

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const payload = parsePayload(rawBody)

    // Handle URL verification challenge
    if (payload.type === "url_verification") {
      console.log("Feishu URL verification challenge received")
      return NextResponse.json({ challenge: payload.challenge })
    }

    // Verify token (recommended for production)
    const verificationToken = process.env.FEISHU_VERIFICATION_TOKEN
    if (verificationToken && payload.header?.token !== verificationToken) {
      console.warn("Invalid Feishu verification token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Handle event callback
    if (payload.header?.event_type === "im.message.receive_v1") {
      console.log(`Received message from chat ${payload.event.message.chat_id}`)
      // Fire and forget
      handleMessage(payload.event).catch((err: Error) =>
        console.error("Message handling error:", err),
      )
      return NextResponse.json({ code: 0, msg: "success" })
    }

    return NextResponse.json({ code: 0, msg: "ignored" })
  } catch (error) {
    console.error("Feishu webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// ---------- GET handler (for health check) ----------

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Feishu Bot Webhook",
    version: "1.0.0",
  })
}
