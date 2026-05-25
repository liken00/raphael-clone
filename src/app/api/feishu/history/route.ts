import { NextRequest, NextResponse } from "next/server"
import {
  listChatSessions,
  getChatMessages,
  deleteChatHistory,
} from "@/lib/feishu-history"

// ---------- GET /api/feishu/history ----------
// List all chat sessions, or get messages for a specific chat

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    if (chatId) {
      // Get messages for a specific chat
      const before = searchParams.get("before") || undefined
      const messages = getChatMessages(chatId, limit, before)
      return NextResponse.json({
        chatId,
        messages,
        count: messages.length,
      })
    }

    // List all chat sessions
    const sessions = listChatSessions()
    return NextResponse.json({
      sessions,
      count: sessions.length,
    })
  } catch (error) {
    console.error("Feishu history API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

// ---------- DELETE /api/feishu/history?chatId=xxx ----------
// Delete history for a specific chat

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 },
      )
    }

    const deleted = deleteChatHistory(chatId)
    return NextResponse.json({
      deleted,
      chatId,
    })
  } catch (error) {
    console.error("Feishu history delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
