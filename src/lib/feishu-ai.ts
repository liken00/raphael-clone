export interface AiReplyParams {
  chatId: string
  chatName?: string
  message: string
  senderName: string
  history: Array<{ role: "user" | "assistant"; content: string }>
}

// ---------- Generate AI reply using OpenAI-compatible API ----------

export async function generateAiReply(params: AiReplyParams): Promise<string | null> {
  const apiKey = process.env.FEISHU_AI_API_KEY
  const apiBase = process.env.FEISHU_AI_API_BASE || "https://api.openai.com/v1"
  const model = process.env.FEISHU_AI_MODEL || "gpt-4o-mini"

  if (!apiKey) {
    return null
  }

  // Build system prompt
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
- 如果不知道用户问的是什么，礼貌地请用户提供更多信息`

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ]

  // Add recent history (last 10 messages)
  const recentMessages = params.history.slice(-10)
  for (const msg of recentMessages) {
    messages.push({ role: msg.role, content: msg.content })
  }

  // Add current message
  messages.push({
    role: "user",
    content: `${params.senderName}: ${params.message}`,
  })

  try {
    const resp = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!resp.ok) {
      console.error(`AI API error: ${resp.status} ${await resp.text()}`)
      return null
    }

    const data = await resp.json()
    const reply = data.choices?.[0]?.message?.content
    return reply || null
  } catch (error) {
    console.error("AI reply generation failed:", error)
    return null
  }
}
