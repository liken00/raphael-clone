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
    id: 'nano-banana-2',
    name: 'Nano Banana 2',
    description: '高性能图像生成模型，支持多种风格',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'raphael-basic',
    name: 'Raphael Basic',
    description: '基础图像生成模型，适合日常使用',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'qwen-image',
    name: 'Qwen-Image',
    description: '通义千问图像生成模型',
    type: 'image',
    tier: 'FREE',
  },
  {
    id: 'seedream-5.0',
    name: 'Seedream 5.0',
    description: '自研图片模型，支持高质量输出',
    type: 'image',
    tier: 'PRO',
  },
];

export const VIDEO_MODELS: ModelOption[] = [
  {
    id: 'seedance-2.0',
    name: 'Seedance 2.0',
    description: '自研视频模型，支持高质量视频生成',
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