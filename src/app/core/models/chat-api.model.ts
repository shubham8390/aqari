export interface ChatSource {
  chunk_id: string;
  property_name: string;
  location: string;
  price: string;
  bhk: string;
  builder_name: string;
  rera_number?: string;
  status?: string;
  score: number;
}

export interface ChatRequest {
  query: string;
  top_k: number;
  user_id: string;
  session_id?: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  session_id: string;
}
