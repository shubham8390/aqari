export const API_BASE_URL = '/api';

export const API = {
  authRegister: `${API_BASE_URL}/auth/register`,
  authToken:    `${API_BASE_URL}/auth/token`,
  profile:      `${API_BASE_URL}/profile`,
  chat:           `${API_BASE_URL}/chat`,
  chatSessions:   `${API_BASE_URL}/chat/sessions`,
  chatMessages:   (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}/messages`,
  chatSession:    (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}`,
} as const;

export const CHAT_TOP_K = 5;
