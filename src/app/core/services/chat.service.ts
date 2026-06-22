import { Injectable, inject, signal, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatMessage } from '../models/message.model';
import { ChatRequest, ChatResponse, ChatSource } from '../models/chat-api.model';
import { API, CHAT_TOP_K } from '../config/api.config';
import { AGENT_LABEL, AGENT_NAME } from '../constants/agent.constants';
import { renderChatMarkdown } from '../utils/chat-markdown.util';
import { AuthService } from './auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly authModal = inject(AuthModalService);
  private readonly sanitizer = inject(DomSanitizer);

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
          time: `Just now · ${AGENT_LABEL}`,
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
          time: `Just now · ${AGENT_LABEL}`,
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

  /** Refresh the welcome bubble after sign-in when the user has not started chatting yet. */
  refreshWelcomeIfInitial(): void {
    if (this.sessionId) return;
    const msgs = this.messages();
    if (msgs.length === 1 && msgs[0].id === '1' && msgs[0].role === 'agent') {
      this.messages.set(this.buildInitialMessages());
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  private buildInitialMessages(): ChatMessage[] {
    return [
      {
        id: '1',
        role: 'agent',
        text: this.welcomeText(),
        time: 'Just now',
      },
    ];
  }

  private welcomeText(): string {
    if (!this.auth.isAuthenticated()) {
      return `Welcome — I'm ${AGENT_NAME}, your property AI assistant for Pune.<br><br>Sign in to explore projects, pricing, and availability.`;
    }
    if (this.auth.isBuilder()) {
      return `Welcome — I'm ${AGENT_NAME}, your property AI assistant.<br><br>Ask about your projects, unit pricing, listings, and Pune market trends.`;
    }
    return `Welcome — I'm ${AGENT_NAME}, your property AI assistant.<br><br>Ask about projects, pricing, amenities, availability, and RERA details.`;
  }

  private formatAnswer(answer: string): string {
    const html = renderChatMarkdown(answer);
    return this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
  }
}
