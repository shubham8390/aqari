export const API_BASE_URL = '/api';

export const API = {
  authRegister: `${API_BASE_URL}/auth/register`,
  authToken:    `${API_BASE_URL}/auth/token`,
  profile:      `${API_BASE_URL}/profile`,
  chat:           `${API_BASE_URL}/chat`,
  chatSessions:   `${API_BASE_URL}/chat/sessions`,
  chatMessages:   (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}/messages`,
  chatSession:    (sessionId: string) => `${API_BASE_URL}/chat/${sessionId}`,
  images:         `${API_BASE_URL}/images`,
  image:          (filename: string) => `${API_BASE_URL}/images/${filename}`,
  listings:       `${API_BASE_URL}/listings`,
  listing:        (id: number) => `${API_BASE_URL}/listings/${id}`,
  projects:       `${API_BASE_URL}/projects`,
  project:        (id: number) => `${API_BASE_URL}/projects/${id}`,
  userListings:   `${API_BASE_URL}/user-listings`,
  userListing:    (id: number) => `${API_BASE_URL}/user-listings/${id}`,
} as const;

export const CHAT_TOP_K = 5;
