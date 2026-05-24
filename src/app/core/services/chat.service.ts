import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChatMessage } from '../models/message.model';
import { ChatRequest, ChatResponse } from '../models/chat-api.model';
import { CHAT_API_URL, CHAT_TOP_K, CHAT_USER_ID } from '../config/chat.config';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  messages = signal<ChatMessage[]>(this.buildInitialMessages());
  isTyping = signal(false);

  private sessionId: string | null = null;

  sendMessage(text: string): void {
    const query = text.trim();
    if (!query || this.isTyping()) return;

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
      user_id: CHAT_USER_ID,
    };

    if (this.sessionId) {
      payload.session_id = this.sessionId;
    }

    // #region agent log
    fetch('http://127.0.0.1:7457/ingest/673e24fd-9b86-4aaf-9656-40a6db5a653d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'64f4a2'},body:JSON.stringify({sessionId:'64f4a2',runId:'pre-fix',hypothesisId:'H4',location:'chat.service.ts:sendMessage',message:'chat request prepared',data:{url:CHAT_API_URL,payload,hasSessionId:!!this.sessionId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    this.http
      .post<ChatResponse>(CHAT_API_URL, payload, {
        headers: new HttpHeaders({
          'ngrok-skip-browser-warning': 'true',
        }),
      })
      .subscribe({
        next: (response) => {
          // #region agent log
          fetch('http://127.0.0.1:7457/ingest/673e24fd-9b86-4aaf-9656-40a6db5a653d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'64f4a2'},body:JSON.stringify({sessionId:'64f4a2',runId:'pre-fix',hypothesisId:'H4',location:'chat.service.ts:next',message:'chat request succeeded',data:{sessionId:response.session_id,answerLength:response.answer?.length,sourcesCount:response.sources?.length},timestamp:Date.now()})}).catch(()=>{});
          // #endregion

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
        error: (err: unknown) => {
          const httpErr = err instanceof HttpErrorResponse ? err : null;
          const isCorsLike = !httpErr || httpErr.status === 0;
          const errorBody = typeof httpErr?.error === 'string'
            ? httpErr.error.slice(0, 200)
            : httpErr?.error;

          // #region agent log
          fetch('http://127.0.0.1:7457/ingest/673e24fd-9b86-4aaf-9656-40a6db5a653d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'64f4a2'},body:JSON.stringify({sessionId:'64f4a2',runId:'pre-fix',hypothesisId:'H1,H2,H3,H4,H5',location:'chat.service.ts:error',message:'chat request failed',data:{isCorsLike,status:httpErr?.status ?? null,statusText:httpErr?.statusText ?? null,url:httpErr?.url ?? CHAT_API_URL,errorName:httpErr?.name ?? (err as Error)?.name ?? 'unknown',errorMessage:httpErr?.message ?? (err as Error)?.message ?? String(err),errorBody},timestamp:Date.now()})}).catch(()=>{});
          // #endregion

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
  }

  private buildInitialMessages(): ChatMessage[] {
    return [
      {
        id: '1',
        role: 'agent',
        text: `Welcome — I'm Agent Zayed, your property AI assistant.<br><br>Ask me about projects, pricing, RERA details, amenities, availability, and more.`,
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
