import { Property, NegotiationAnalysis } from './property.model';

export type MessageRole = 'agent' | 'user';
export type MessageContentType = 'text' | 'property-list' | 'negotiation-card';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  contentType?: MessageContentType;
  properties?: Property[];
  negotiation?: NegotiationAnalysis;
}
