import { Link } from "@/i18n/routing"

export default async function FeishuHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">飞书聊天记录</h1>
            <p className="text-gray-500 mt-1">浏览所有飞书群聊的 AI 对话历史</p>
          </div>
          <Link
            href="/"
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            ← 返回首页
          </Link>
        </div>
        <div id="feishu-history-root">
          <p className="text-gray-400 text-center py-12">加载中...</p>
        </div>
      </div>
    </div>
  )
}