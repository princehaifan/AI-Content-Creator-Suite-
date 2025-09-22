export enum Feature {
  Script = 'script',
  Facts = 'facts',
}

export interface Scene {
  visual: string;
  voiceover: string;
  imageUrl?: string;
}
