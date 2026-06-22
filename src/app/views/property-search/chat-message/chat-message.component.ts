import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';
import { AuthService } from '../../../core/services/auth.service';
import { formatUserMessage } from '../../../core/utils/chat-markdown.util';
import { AGENT_INITIAL, AGENT_LABEL } from '../../../core/constants/agent.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;

  auth = inject(AuthService);
  router = inject(Router);

  readonly agentLabel = AGENT_LABEL;
  readonly agentInitial = AGENT_INITIAL;

  userInitials(): string {
    return this.auth.displayName().slice(0, 2).toUpperCase();
  }

  messageHtml(): string {
    return this.message.role === 'user'
      ? formatUserMessage(this.message.text)
      : this.message.text;
  }

  openSource(source: { id: number; source: string }): void {
    if (source.source === 'user_listing') {
      this.router.navigate(['/user-listings', source.id]);
    } else {
      this.router.navigate(['/listings', source.id]);
    }
  }
}
