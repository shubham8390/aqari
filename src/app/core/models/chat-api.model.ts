export type ChatSourceType = 'listing' | 'user_listing';

export interface ChatSource {
  id: number;
  source: ChatSourceType | string;
  property_name: string;
  location: string;
  price: string;
  bhk: string;
}

export interface ChatRequest {
  query: string;
  top_k: number;
  session_id: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  session_id: string;
}

export interface ChatSession {
  session_id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionListResponse {
  sessions: ChatSession[];
  total: number;
}

export interface ChatMessageRecord {
  role: 'user' | 'assistant';
  content: string;
}

export interface StatusResponse {
  status: string;
}
