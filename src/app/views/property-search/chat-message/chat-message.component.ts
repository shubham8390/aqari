import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';
import { ChatSource } from '../../../core/models/chat-api.model';
import { AuthService } from '../../../core/services/auth.service';
import { formatUserMessage } from '../../../core/utils/chat-markdown.util';
import {
  formatSourceBhk,
  formatSourceLocation,
  formatSourcePrice,
  sourceThumbnail,
} from '../../../core/utils/chat-source.util';
import { AGENT_INITIAL, AGENT_LABEL } from '../../../core/constants/agent.constants';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;

  auth = inject(AuthService);

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

  location(source: ChatSource): string {
    return formatSourceLocation(source);
  }

  bhk(source: ChatSource): string | null {
    return formatSourceBhk(source);
  }

  price(source: ChatSource): string | null {
    return formatSourcePrice(source);
  }

  thumbnail(source: ChatSource): string | null {
    return sourceThumbnail(source);
  }
}
