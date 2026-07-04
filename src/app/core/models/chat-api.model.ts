export interface ChatSource {
  id: number;
  project_name: string;
  city?: string;
  locality?: string;
  status?: string;
  builder_name?: string;
  property_type?: string;
  address?: string;
  state?: string;
  lat?: number;
  lon?: number;
  starting_price?: number;
  max_price?: number;
  display_price?: string;
  bhk?: string[];
  construction_status?: string;
  completion_date?: string;
  rera_number?: string;
  project_area_acres?: number;
  total_units?: number;
  total_towers?: number;
  total_floors?: number;
  amenities?: string[];
  why_consider?: string[];
  location_advantages?: string[];
  about_project?: string;
  images?: string[];
  brochure?: string;
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
  user_id: number | null;
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
