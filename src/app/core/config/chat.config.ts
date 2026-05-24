// Same-origin path proxied to the chat backend:
// - local dev: proxy.conf.json (ng serve)
// - Netlify: netlify.toml [[redirects]] proxy rule
export const CHAT_API_URL = '/api/chat';
export const CHAT_USER_ID = 'realestate@example.com';
export const CHAT_TOP_K = 10;
