
export type ContentType = 'microcopy' | 'errors' | 'onboarding' | 'tooltips';

export interface ContentRequest {
  type: ContentType;
  prompt: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  timestamp: Date;
}

export interface ContentHistory {
  items: GeneratedContent[];
}
