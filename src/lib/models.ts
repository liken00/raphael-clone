// Image and Video generation models configuration

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'video';
  tier: 'FREE' | 'PRO'; // Minimum tier required
}

export const IMAGE_MODELS: ModelOption[] = [
  {
    id: 'z-image',
    name: 'Z-Image',
    description: '动漫/插画风格，日常首选。适合二次元爱好者',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'flux-2',
    name: 'Flux 2',
    description: '摄影质感，写实风格。适合人像/产品图',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'qwen-image',
    name: 'Qwen-Image',
    description: '阿里通义，中文海报不乱码',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'seedream-5.0',
    name: 'Seedream 5.0',
    description: '字节跳动，场景渲染/多人物',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'nano-banana-2',
    name: 'Nano Banana 2.0',
    description: '谷歌极速模型，快速日常出图',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    description: 'Gemini 3 Pro Image - 4K超清、多语言文字清晰、商用专业图像引擎',
    type: 'image',
    tier: 'PRO',
  },
];

export const VIDEO_MODELS: ModelOption[] = [
  {
    id: 'seedance-2.0',
    name: 'Seedance 2.0',
    description: '自研AI视频生成模型',
    type: 'video',
    tier: 'PRO',
  },
];

export const ALL_MODELS = [...IMAGE_MODELS, ...VIDEO_MODELS];

export function getModelById(id: string): ModelOption | undefined {
  return ALL_MODELS.find(m => m.id === id);
}

export function getModelsByType(type: 'image' | 'video'): ModelOption[] {
  return type === 'image' ? IMAGE_MODELS : VIDEO_MODELS;
}