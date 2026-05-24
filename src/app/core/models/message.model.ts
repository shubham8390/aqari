import { ChatSource } from './chat-api.model';

export type MessageRole = 'agent' | 'user';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  sources?: ChatSource[];
}
