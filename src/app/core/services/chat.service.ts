import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/message.model';
import { ChatRequest, ChatResponse, ChatSource } from '../models/chat-api.model';
import { API, CHAT_TOP_K } from '../config/api.config';
import { AuthService } from './auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly authModal = inject(AuthModalService);

  messages = signal<ChatMessage[]>(this.buildInitialMessages());
  isTyping = signal(false);

  private sessionId = '';

  sendMessage(text: string): boolean {
    const query = text.trim();
    if (!query || this.isTyping()) return false;

    if (!this.auth.isAuthenticated()) {
      this.authModal.open('signin');
      return false;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      time: 'Just now',
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.isTyping.set(true);

    const payload: ChatRequest = {
      query,
      top_k: CHAT_TOP_K,
      session_id: this.sessionId,
    };

    this.http.post<ChatResponse>(API.chat, payload).subscribe({
      next: (response) => {
        this.sessionId = response.session_id;
        this.isTyping.set(false);

        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          text: this.formatAnswer(response.answer),
          time: 'Just now · Agent Zayed',
          sources: response.sources?.length ? response.sources : undefined,
        };
        this.messages.update(msgs => [...msgs, agentMsg]);
      },
      error: () => {
        this.isTyping.set(false);
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          text: 'Sorry, I couldn\'t reach the property assistant right now. Please try again in a moment.',
          time: 'Just now · Agent Zayed',
        };
        this.messages.update(msgs => [...msgs, errorMsg]);
      },
    });

    return true;
  }

  loadSession(sessionId: string, records: { role: string; content: string }[], sourcesByIndex?: ChatSource[][]): void {
    this.sessionId = sessionId;
    const msgs: ChatMessage[] = [
      {
        id: 'welcome',
        role: 'agent',
        text: `Welcome back — continuing your conversation.`,
        time: 'Session restored',
      },
    ];

    records.forEach((rec, i) => {
      msgs.push({
        id: `hist-${i}`,
        role: rec.role === 'user' ? 'user' : 'agent',
        text: rec.role === 'assistant' ? this.formatAnswer(rec.content) : rec.content,
        time: 'Previous',
        sources: sourcesByIndex?.[i],
      });
    });

    this.messages.set(msgs);
  }

  startNewSession(): void {
    this.sessionId = '';
    this.messages.set(this.buildInitialMessages());
  }

  getSessionId(): string {
    return this.sessionId;
  }

  private buildInitialMessages(): ChatMessage[] {
    return [
      {
        id: '1',
        role: 'agent',
        text: `Welcome — I'm Agent Zayed, your property AI assistant.<br><br>Sign in to ask about projects, pricing, RERA details, amenities, availability, and more.`,
        time: 'Just now',
      },
    ];
  }

  private formatAnswer(answer: string): string {
    return answer
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}
