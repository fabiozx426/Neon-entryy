export type ImageSize = '1K' | '2K' | '4K';

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16' | '21:9' | '3:4';

export type PanelStatus = 'pending' | 'generating' | 'completed' | 'error';

export interface StoryboardPanel {
  id: string;
  panelNumber: number;
  sceneHeader: string;
  shotType: string;
  cameraMovement: string;
  actionDescription: string;
  dialogue?: string;
  audioSoundEffects?: string;
  characters?: string[];
  visualPrompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  status: PanelStatus;
  imageUrl?: string | null;
  error?: string;
}

export interface StoryboardSequence {
  title: string;
  logline: string;
  dominantTone: string;
  panels: StoryboardPanel[];
  scriptText: string;
  genre: string;
  visualStyle: string;
  createdAt: number;
}

export type ChatRoleType = 'director' | 'script-doctor' | 'fast-assistant';

export interface ChatRoleConfig {
  id: ChatRoleType;
  name: string;
  model: 'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite';
  description: string;
  badge: string;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modelUsed?: string;
  roleUsed?: ChatRoleType;
}

export interface SampleScript {
  id: string;
  title: string;
  genre: string;
  logline: string;
  visualStyle: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  content: string;
}
