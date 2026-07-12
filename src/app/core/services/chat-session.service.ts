import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import {
  ChatMessagesResponse,
  ChatSessionListResponse,
  StatusResponse,
} from '../models/chat-api.model';

@Injectable({ providedIn: 'root' })
export class ChatSessionService {
  private readonly http = inject(HttpClient);

  listSessions(limit = 20) {
    return this.http.get<ChatSessionListResponse>(API.chatSessions, {
      params: { limit: limit.toString() },
    });
  }

  getMessages(sessionId: string) {
    return this.http.get<ChatMessagesResponse>(API.chatMessages(sessionId));
  }

  clearSession(sessionId: string) {
    return this.http.delete<StatusResponse>(API.chatSession(sessionId));
  }
}
