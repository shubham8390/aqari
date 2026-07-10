export const API_BASE_URL = '/api';

export const API = {
  authRegister: `${API_BASE_URL}/auth/register`,
  authToken:    `${API_BASE_URL}/auth/token`,
  authGoogleLogin:  `${API_BASE_URL}/auth/google/login`,
  authGoogleToken:  `${API_BASE_URL}/auth/google/token`,
  authGoogleLogout: `${API_BASE_URL}/auth/google/logout`,
  profile:      `${API_BASE_URL}/profile`,
  chat:           `${API_BASE_URL}/chat`,
  chatSessions:   `${API_BASE_URL}/chat/sessions`,
  chatMessages:   (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}/messages`,
  chatSession:    (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}`,
} as const;

export const CHAT_TOP_K = 5;

export const AUTH_RETURN_URL_KEY = 'aqari_auth_return_url';
export const AUTH_PROVIDER_KEY = 'aqari_auth_provider';

