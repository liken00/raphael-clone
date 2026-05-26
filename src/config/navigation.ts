// 5级菜单导航配置
// L1（一级）→ L2（二级）→ L3（三级）→ L4（四级）→ L5（五级）

export interface NavItem {
  title: string;
  titleEn: string;
  href?: string;
  badge?: string;
  icon?: string;
  children?: NavItem[]; // 下一级
  isNew?: boolean;
  isHot?: boolean;
}

// 图标使用 Lucide React 图标名称
export const MAIN_NAV: NavItem[] = [
  {
    title: "AI 创作",
    titleEn: "Create",
    icon: "Sparkles",
    children: [
      {
        title: "图像生成",
        titleEn: "Image Generation",
        icon: "Image",
        children: [
          {
            title: "Nano Banana 2",
            titleEn: "Nano Banana 2",
            href: "/nano-banana-2",
            badge: "50% OFF",
            children: [
              {
                title: "基础版",
                titleEn: "Basic",
                children: [
                  { title: "快速生成", titleEn: "Quick Generate", href: "/nano-banana-2?mode=quick" },
                  { title: "批量生成", titleEn: "Batch Generate", href: "/nano-banana-2?mode=batch" },
                ],
              },
              {
                title: "专业版",
                titleEn: "Pro",
                children: [
                  { title: "高清生成", titleEn: "HD Generate", href: "/nano-banana-2?mode=hd" },
                  { title: "自定义模型", titleEn: "Custom Model", href: "/nano-banana-2?mode=custom" },
                ],
              },
            ],
          },
          {
            title: "无提示词AI绘画",
            titleEn: "No Prompt AI",
            href: "/no-prompt-ai",
            badge: "NEW",
            children: [
              {
                title: "风格画廊",
                titleEn: "Style Gallery",
                children: [
                  { title: "写实风格", titleEn: "Realistic", href: "/no-prompt-ai?style=realistic" },
                  { title: "动漫风格", titleEn: "Anime", href: "/no-prompt-ai?style=anime" },
                  { title: "油画风格", titleEn: "Oil Painting", href: "/no-prompt-ai?style=oil" },
                  { title: "水彩风格", titleEn: "Watercolor", href: "/no-prompt-ai?style=watercolor" },
                ],
              },
              {
                title: "高级设置",
                titleEn: "Advanced",
                children: [
                  { title: "分辨率控制", titleEn: "Resolution", href: "/no-prompt-ai?tab=resolution" },
                  { title: "风格强度", titleEn: "Style Strength", href: "/no-prompt-ai?tab=strength" },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "视频生成",
        titleEn: "Video Generation",
        icon: "Video",
        badge: "NEW",
        children: [
          {
            title: "AI 视频生成器",
            titleEn: "AI Video Generator",
            href: "/ai-video-generator",
            children: [
              { title: "文生视频", titleEn: "Text to Video", href: "/ai-video-generator?mode=text" },
              { title: "图生视频", titleEn: "Image to Video", href: "/ai-video-generator?mode=image" },
              { title: "视频编辑", titleEn: "Video Edit", href: "/ai-video-generator?mode=edit" },
            ],
          },
        ],
      },
      {
        title: "音频生成",
        titleEn: "Audio Generation",
        icon: "Music",
        children: [
          {
            title: "AI 声音克隆",
            titleEn: "AI Voice Clone",
            href: "/ai-voice-clone",
            badge: "NEW",
            children: [
              { title: "语音合成", titleEn: "TTS", href: "/ai-voice-clone?mode=tts" },
              { title: "声音转换", titleEn: "Voice Convert", href: "/ai-voice-clone?mode=convert" },
              { title: "多语言配音", titleEn: "Multi-language", href: "/ai-voice-clone?mode=dub" },
            ],
          },
        ],
      },
      {
        title: "3D 生成",
        titleEn: "3D Generation",
        icon: "Box",
        children: [
          {
            title: "AI 3D 模型",
            titleEn: "AI 3D Model",
            href: "/ai-3d-model",
            badge: "NEW",
            children: [
              { title: "文生3D", titleEn: "Text to 3D", href: "/ai-3d-model?mode=text" },
              { title: "图生3D", titleEn: "Image to 3D", href: "/ai-3d-model?mode=image" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "AI 编辑",
    titleEn: "Edit",
    icon: "Wand2",
    children: [
      {
        title: "图像编辑",
        titleEn: "Image Editing",
        icon: "Paintbrush",
        children: [
          {
            title: "AI 图像编辑器",
            titleEn: "AI Photo Editor",
            href: "/ai-image-editor",
            children: [
              { title: "智能抠图", titleEn: "Smart Cutout", href: "/ai-image-editor?tool=cutout" },
              { title: "图像修复", titleEn: "Inpaint", href: "/ai-image-editor?tool=inpaint" },
              { title: "图像增强", titleEn: "Enhance", href: "/ai-image-editor?tool=enhance" },
              { title: "风格迁移", titleEn: "Style Transfer", href: "/ai-image-editor?tool=style" },
            ],
          },
          {
            title: "扩展图像 (Uncrop)",
            titleEn: "Uncrop",
            href: "/uncrop",
            children: [
              { title: "自由扩展", titleEn: "Free Expand", href: "/uncrop?mode=free" },
              { title: "智能填充", titleEn: "Smart Fill", href: "/uncrop?mode=smart" },
            ],
          },
          {
            title: "移除背景",
            titleEn: "Background Remover",
            href: "/background-remover",
            children: [
              { title: "一键去背景", titleEn: "Quick Remove", href: "/background-remover?mode=quick" },
              { title: "透明背景", titleEn: "Transparent", href: "/background-remover?mode=transparent" },
              { title: "自定义背景", titleEn: "Custom BG", href: "/background-remover?mode=custom" },
            ],
          },
        ],
      },
      {
        title: "批量处理",
        titleEn: "Batch Processing",
        icon: "Layers",
        children: [
          {
            title: "批量编辑",
            titleEn: "Batch Edit",
            children: [
              { title: "上传文件", titleEn: "Upload Files", href: "/batch?tab=upload" },
              { title: "处理队列", titleEn: "Process Queue", href: "/batch?tab=queue" },
              { title: "导出结果", titleEn: "Export Results", href: "/batch?tab=export" },
            ],
          },
          {
            title: "API 集成",
            titleEn: "API Integration",
            children: [
              { title: "REST API", titleEn: "REST API", href: "/docs/api" },
              { title: "Webhook", titleEn: "Webhook", href: "/docs/webhook" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "产品",
    titleEn: "Products",
    icon: "Package",
    children: [
      {
        title: "Nano Banana 2",
        titleEn: "Nano Banana 2",
        href: "/nano-banana-2",
        icon: "Banana",
        badge: "50% OFF",
        children: [
          {
            title: "功能概览",
            titleEn: "Overview",
            children: [
              { title: "核心功能", titleEn: "Core Features", href: "/nano-banana-2#features" },
              { title: "高级功能", titleEn: "Advanced", href: "/nano-banana-2#advanced" },
              { title: "模型对比", titleEn: "Model Compare", href: "/nano-banana-2#compare" },
            ],
          },
          {
            title: "定价方案",
            titleEn: "Pricing",
            children: [
              { title: "月度订阅", titleEn: "Monthly", href: "/pricing?plan=monthly" },
              { title: "年度订阅", titleEn: "Yearly", href: "/pricing?plan=yearly" },
              { title: "按量付费", titleEn: "Pay-as-you-go", href: "/pricing?plan=payg" },
            ],
          },
          {
            title: "API 文档",
            titleEn: "API Docs",
            children: [
              { title: "快速开始", titleEn: "Quick Start", href: "/docs/quickstart" },
              { title: "API 参考", titleEn: "API Reference", href: "/docs/api" },
              { title: "SDK", titleEn: "SDK", href: "/docs/sdk" },
            ],
          },
        ],
      },
      {
        title: "No Prompt AI",
        titleEn: "No Prompt AI",
        href: "/no-prompt-ai",
        icon: "Brain",
        badge: "NEW",
        children: [
          {
            title: "快速上手",
            titleEn: "Getting Started",
            children: [
              { title: "使用指南", titleEn: "User Guide", href: "/no-prompt-ai#guide" },
              { title: "技巧与提示", titleEn: "Tips & Tricks", href: "/no-prompt-ai#tips" },
            ],
          },
          {
            title: "风格库",
            titleEn: "Style Library",
            children: [
              { title: "推荐风格", titleEn: "Recommended", href: "/no-prompt-ai?tab=recommended" },
              { title: "自定义风格", titleEn: "Custom Styles", href: "/no-prompt-ai?tab=custom" },
            ],
          },
        ],
      },
      {
        title: "Studio 创意板",
        titleEn: "Studio",
        href: "/studio",
        icon: "Sparkles",
        badge: "NEW",
        children: [
          {
            title: "无限画布",
            titleEn: "Infinite Canvas",
            href: "/studio?mode=canvas",
          },
          {
            title: "AI 创作",
            titleEn: "AI Create",
            href: "/studio?mode=create",
          },
          {
            title: "历史脉络",
            titleEn: "Lineage",
            href: "/lineage",
          },
        ],
      },
      {
        title: "Lineage 创作脉络",
        titleEn: "Lineage",
        href: "/lineage",
        icon: "GitFork",
        children: [
          {
            title: "创作历史",
            titleEn: "History",
            href: "/lineage?tab=history",
          },
          {
            title: "版本对比",
            titleEn: "Compare",
            href: "/lineage?tab=compare",
          },
        ],
      },
    ],
  },
  {
    title: "定价",
    titleEn: "Pricing",
    icon: "CreditCard",
    href: "/pricing",
    children: [
      {
        title: "个人方案",
        titleEn: "Personal",
        children: [
          {
            title: "免费版",
            titleEn: "Free",
            href: "/pricing#free",
            children: [
              { title: "每天3张", titleEn: "3/day", href: "/pricing#free" },
              { title: "720P 分辨率", titleEn: "720P", href: "/pricing#free" },
            ],
          },
          {
            title: "专业版",
            titleEn: "Pro",
            href: "/pricing#pro",
            children: [
              { title: "无限生成", titleEn: "Unlimited", href: "/pricing?plan=pro&period=monthly" },
              { title: "4K 高清", titleEn: "4K HD", href: "/pricing?plan=pro&period=monthly" },
              { title: "无水印", titleEn: "No Watermark", href: "/pricing?plan=pro&period=monthly" },
            ],
          },
        ],
      },
      {
        title: "团队方案",
        titleEn: "Team",
        children: [
          { title: "团队版", titleEn: "Team", href: "/pricing#team" },
          { title: "企业版", titleEn: "Enterprise", href: "/pricing#enterprise" },
          { title: "定制方案", titleEn: "Custom", href: "/pricing#custom" },
        ],
      },
      {
        title: "API 定价",
        titleEn: "API Pricing",
        children: [
          { title: "按量计费", titleEn: "Pay-as-you-go", href: "/pricing#api" },
          { title: "预留容量", titleEn: "Reserved", href: "/pricing#api-reserved" },
        ],
      },
    ],
  },
  {
    title: "开发者",
    titleEn: "Developers",
    icon: "Code2",
    children: [
      {
        title: "API 文档",
        titleEn: "API Docs",
        icon: "FileText",
        children: [
          { title: "快速开始", titleEn: "Quick Start", href: "/docs/quickstart" },
          { title: "API 参考", titleEn: "API Reference", href: "/docs/api" },
          { title: "错误处理", titleEn: "Error Codes", href: "/docs/errors" },
          { title: "速率限制", titleEn: "Rate Limits", href: "/docs/rate-limits" },
        ],
      },
      {
        title: "SDK 与库",
        titleEn: "SDK & Libraries",
        icon: "BookOpen",
        children: [
          { title: "Python SDK", titleEn: "Python SDK", href: "/docs/sdk/python" },
          { title: "JavaScript SDK", titleEn: "JavaScript SDK", href: "/docs/sdk/javascript" },
          { title: "REST API", titleEn: "REST API", href: "/docs/api/rest" },
          { title: "CLI 工具", titleEn: "CLI Tool", href: "/docs/cli" },
        ],
      },
      {
        title: "集成指南",
        titleEn: "Integration",
        icon: "GitFork",
        children: [
          { title: "Webhook", titleEn: "Webhook", href: "/docs/webhook" },
          { title: "OAuth 认证", titleEn: "OAuth", href: "/login" },
          { title: "飞书集成", titleEn: "Feishu Integration", href: "/docs/feishu" },
        ],
      },
      {
        title: "资源",
        titleEn: "Resources",
        icon: "Library",
        children: [
          { title: "Changelog", titleEn: "Changelog", href: "/blog/changelog" },
          { title: "状态页面", titleEn: "Status", href: "/status" },
          { title: "GitHub", titleEn: "GitHub", href: "https://github.com" },
        ],
      },
    ],
  },
  {
    title: "资源",
    titleEn: "Resources",
    icon: "Bookmark",
    children: [
      {
        title: "帮助中心",
        titleEn: "Help Center",
        icon: "LifeBuoy",
        children: [
          { title: "常见问题", titleEn: "FAQ", href: "/faq" },
          { title: "使用教程", titleEn: "Tutorials", href: "/tutorials" },
          { title: "视频教程", titleEn: "Video Guides", href: "/tutorials/video" },
          { title: "联系支持", titleEn: "Contact Support", href: "/support" },
        ],
      },
      {
        title: "博客",
        titleEn: "Blog",
        icon: "Newspaper",
        children: [
          { title: "产品更新", titleEn: "Product Updates", href: "/blog/updates" },
          { title: "技术文章", titleEn: "Tech Articles", href: "/blog/tech" },
          { title: "案例研究", titleEn: "Case Studies", href: "/blog/cases" },
        ],
      },
      {
        title: "社区",
        titleEn: "Community",
        icon: "Users",
        children: [
          { title: "Discord", titleEn: "Discord", href: "https://discord.gg/myai" },
          { title: "GitHub", titleEn: "GitHub", href: "https://github.com/myai-app" },
          { title: "飞书群", titleEn: "Feishu Group", href: "/feishu-history" },
        ],
      },
    ],
  },
  {
    title: "公司",
    titleEn: "Company",
    icon: "Building2",
    children: [
      {
        title: "关于",
        titleEn: "About",
        icon: "Info",
        children: [
          { title: "关于我们", titleEn: "About Us", href: "/about" },
          { title: "联系我们", titleEn: "Contact", href: "/contact" },
          { title: "加入我们", titleEn: "Careers", href: "/careers" },
        ],
      },
      {
        title: "法律",
        titleEn: "Legal",
        icon: "Shield",
        children: [
          { title: "隐私政策", titleEn: "Privacy Policy", href: "/privacy" },
          { title: "服务条款", titleEn: "Terms of Service", href: "/tos" },
        ],
      },
      {
        title: "合作",
        titleEn: "Partnership",
        icon: "Handshake",
        children: [
          { title: "合作伙伴", titleEn: "Partners", href: "/partners" },
          { title: "联盟计划", titleEn: "Affiliate", href: "/affiliate" },
          { title: "技术合作", titleEn: "Tech Partnership", href: "/tech-partners" },
        ],
      },
    ],
  },
];
