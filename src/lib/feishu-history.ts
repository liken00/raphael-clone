import * as fs from "fs"
import * as path from "path"

const DATA_DIR = process.env.VERCEL 
  ? path.join("/tmp", "data", "feishu-history") 
  : path.join(process.cwd(), "data", "feishu-history")

export interface ChatMessage {
  id: string
  chatId: string
  chatName?: string
  senderId: string
  senderName: string
  content: string
  messageType: "text" | "post" | "image" | "file" | "audio" | "media" | "sticker" | "interactive"
  isBot: boolean
  createTime: string
}

export interface ChatSession {
  chatId: string
  chatName: string
  lastActivity: string
  messageCount: number
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function getChatFile(chatId: string): string {
  return path.join(DATA_DIR, `${chatId}.json`)
}

// ---------- Save a message ----------

export function saveMessage(msg: ChatMessage): void {
  ensureDir()
  const filePath = getChatFile(msg.chatId)
  let messages: ChatMessage[] = []
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8")
      messages = JSON.parse(raw)
    } catch {
      messages = []
    }
  }
  messages.push(msg)
  // Keep only the latest 1000 messages per chat
  if (messages.length > 1000) {
    messages = messages.slice(messages.length - 1000)
  }
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), "utf-8")
}

// ---------- Get messages for a chat (with pagination) ----------

export function getChatMessages(
  chatId: string,
  limit = 50,
  before?: string,
): ChatMessage[] {
  const filePath = getChatFile(chatId)
  if (!fs.existsSync(filePath)) return []

  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    const allMessages: ChatMessage[] = JSON.parse(raw)

    if (!before) {
      return allMessages.slice(-limit)
    }

    const index = allMessages.findIndex((m) => m.id === before)
    if (index === -1) return allMessages.slice(-limit)
    return allMessages.slice(Math.max(0, index - limit), index)
  } catch {
    return []
  }
}

// ---------- Get recent messages as context (for AI) ----------

export function getRecentContext(chatId: string, limit = 20): ChatMessage[] {
  return getChatMessages(chatId, limit)
}

// ---------- List all chat sessions ----------

export function listChatSessions(): ChatSession[] {
  ensureDir()
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"))
  const sessions: ChatSession[] = []

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8")
      const messages: ChatMessage[] = JSON.parse(raw)
      if (messages.length === 0) continue

      const lastMsg = messages[messages.length - 1]
      sessions.push({
        chatId: lastMsg.chatId,
        chatName: lastMsg.chatName || lastMsg.chatId,
        lastActivity: lastMsg.createTime,
        messageCount: messages.length,
      })
    } catch {
      // skip broken files
    }
  }

  sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  return sessions
}

// ---------- Delete chat history ----------

export function deleteChatHistory(chatId: string): boolean {
  const filePath = getChatFile(chatId)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return true
  }
  return false
}

