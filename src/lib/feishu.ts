import crypto from "crypto"
export interface FeishuCredentials {
  appId: string
  appSecret: string
}

export interface TenantTokenResponse {
  code?: number
  msg?: string
  tenant_access_token?: string
  expire?: number
}

export interface FeishuMessage {
  message_id: string
  root_id?: string
  parent_id?: string
  chat_id: string
  chat_type: "group" | "p2p"
  message_type: "text" | "post" | "image" | "file" | "audio" | "media" | "sticker" | "interactive"
  content: string
  sender: {
    id: string
    id_type: "open_id"
    sender_type: "user"
    tenant_key: string
  }
  create_time: string
  mentions?: Array<{
    key: string
    name: string
    id: { open_id?: string; user_id?: string }
  }>
}

export interface FeishuChatInfo {
  chat_id: string
  name?: string
  avatar?: string
  member_count?: number
}

const TOKEN_CACHE: {
  token: string
  expiresAt: number
} = { token: "", expiresAt: 0 }

// ---------- Tenant Access Token ----------

export async function getTenantAccessToken(): Promise<string> {
  const now = Date.now()
  if (TOKEN_CACHE.token && TOKEN_CACHE.expiresAt > now + 60_000) {
    return TOKEN_CACHE.token
  }

  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  if (!appId || !appSecret) {
    throw new Error("FEISHU_APP_ID and FEISHU_APP_SECRET must be set")
  }

  const resp = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  })

  const data: TenantTokenResponse = await resp.json()
  if (!data.tenant_access_token) {
    throw new Error(`Failed to get tenant access token: ${data.msg || JSON.stringify(data)}`)
  }

  TOKEN_CACHE.token = data.tenant_access_token
  TOKEN_CACHE.expiresAt = now + (data.expire || 7200) * 1000
  return TOKEN_CACHE.token
}

// ---------- Send Message ----------

export interface SendMessageParams {
  receiveId: string
  receiveIdType: "open_id" | "union_id" | "user_id" | "chat_id"
  msgType: "text" | "post" | "interactive"
  content: string
}

export async function sendMessage(params: SendMessageParams): Promise<any> {
  const token = await getTenantAccessToken()
  const url = new URL("https://open.feishu.cn/open-apis/im/v1/messages")
  url.searchParams.set("receive_id_type", params.receiveIdType)

  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      receive_id: params.receiveId,
      msg_type: params.msgType,
      content: params.content,
    }),
  })

  const data = await resp.json()
  if (data.code !== 0) {
    throw new Error(`Send message failed: ${data.msg || JSON.stringify(data)}`)
  }
  return data
}

// ---------- Helper: build text content JSON ----------

export function buildTextContent(text: string): string {
  return JSON.stringify({ text })
}

// ---------- Helper: build interactive card content ----------

export function buildCardContent(cardJson: Record<string, any>): string {
  return JSON.stringify(cardJson)
}

// ---------- Get Chat Info ----------

export async function getChatInfo(chatId: string): Promise<FeishuChatInfo | null> {
  try {
    const token = await getTenantAccessToken()
    const resp = await fetch(`https://open.feishu.cn/open-apis/im/v1/chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await resp.json()
    if (data.code === 0 && data.data) {
      return data.data
    }
    return null
  } catch {
    return null
  }
}

// ---------- List group chat members ----------

export async function getChatMembers(chatId: string): Promise<any[]> {
  const token = await getTenantAccessToken()
  const resp = await fetch(
    `https://open.feishu.cn/open-apis/im/v1/chats/${chatId}/members?page_size=50`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const data = await resp.json()
  if (data.code === 0) {
    return data.data?.items || []
  }
  return []
}

// ---------- Get bot info ----------

export async function getBotInfo(): Promise<any> {
  const token = await getTenantAccessToken()
  const resp = await fetch("https://open.feishu.cn/open-apis/bot/v3/info", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await resp.json()
  if (data.code === 0) {
    return data.bot
  }
  return null
}


// ---------- Event Decryption (AES-256-CBC) ----------


/**
 * Decrypt a Feishu encrypted event callback payload.
 * Feishu uses AES-256-CBC with PKCS7 padding.
 * The encrypt_key from Feishu console is a base64-encoded AES-256 key.
 * The encrypted data format: IV(16 bytes) + ciphertext
 */
export function decryptEvent(encryptedBase64: string): string {
  const encryptKey = process.env.FEISHU_ENCRYPT_KEY
  if (!encryptKey) {
    throw new Error("FEISHU_ENCRYPT_KEY is not configured")
  }

  // Decode the encryption key (base64 -> 32 bytes)
  const key = Buffer.from(encryptKey, "base64")

  // Decode the encrypted data
  const encrypted = Buffer.from(encryptedBase64, "base64")

  if (encrypted.length < 17) {
    throw new Error("Invalid encrypted data: too short")
  }

  // First 16 bytes are the IV, rest is ciphertext
  const iv = encrypted.subarray(0, 16)
  const ciphertext = encrypted.subarray(16)

  // Decrypt
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
  decipher.setAutoPadding(true)

  let decrypted = decipher.update(ciphertext)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString("utf-8")
}