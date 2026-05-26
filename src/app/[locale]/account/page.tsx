'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Trash2, Image as ImageIcon } from "lucide-react";

interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
}

export default function AccountPage() {
  const { user, tierConfig } = useAuth();
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "history">("profile");

  useEffect(() => {
    if (user?.id && tab === "history") {
      setLoading(true);
      fetch("/api/images?userId=" + user.id + "&limit=100")
        .then((r) => r.json())
        .then((data) => {
          setImages(data.images || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, tab]);

  const handleDelete = async (imageId: string) => {
    if (!user?.id) return;
    await fetch("/api/images?userId=" + user.id + "&imageId=" + imageId, {
      method: "DELETE",
    });
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "myai-" + Date.now() + ".png";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">请先登录</h1>
        <p className="text-foreground/60">登录后查看账户设置</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">账户设置</h1>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-foreground/5 border border-border/20 w-fit">
          <button
            onClick={() => setTab("profile")}
            className={"px-5 py-2 rounded-lg text-sm font-medium transition-colors " + (tab === "profile" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground/80")}
          >
            个人信息
          </button>
          <button
            onClick={() => setTab("history")}
            className={"px-5 py-2 rounded-lg text-sm font-medium transition-colors " + (tab === "history" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground/80")}
          >
            生成历史
          </button>
        </div>

        {tab === "profile" && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/40">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              <div className="space-y-4">
                {user.image && (
                  <div className="flex items-center gap-3">
                    <img src={user.image} alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="font-medium">{user.name || "用户"}</div>
                      <div className="text-sm text-foreground/60">{user.email}</div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-foreground/60 block mb-1">用户 ID</label>
                  <div className="text-sm text-foreground/80 font-mono bg-secondary/30 px-3 py-2 rounded-lg">{user.id}</div>
                </div>
                <div>
                  <label className="text-sm text-foreground/60 block mb-1">会员等级</label>
                  <div className="text-sm">
                    <span className={"inline-flex px-2.5 py-1 rounded-full text-xs font-medium " + (tierConfig.badgeColor.includes("gradient") ? "bg-primary/20 text-primary" : tierConfig.badgeColor + " text-white")}>
                      {tierConfig.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              生成历史
              <span className="ml-2 text-sm font-normal text-foreground/40">({images.length} 张)</span>
            </h2>
            {loading ? (
              <div className="text-center py-12 text-foreground/40">加载中...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
                <p className="text-foreground/40">还没有生成记录</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border/20 bg-secondary/10">
                    <div className="aspect-square">
                      <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white text-xs line-clamp-2 mb-2">{img.prompt}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDownload(img.url)} className="px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors flex items-center gap-1">
                          <Download className="w-3 h-3" />下载
                        </button>
                        <button onClick={() => handleDelete(img.id)} className="px-2.5 py-1.5 rounded-full bg-red-500/30 backdrop-blur-sm text-white text-xs font-medium hover:bg-red-500/50 transition-colors flex items-center gap-1">
                          <Trash2 className="w-3 h-3" />删除
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white/80 backdrop-blur-sm">{img.model}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}