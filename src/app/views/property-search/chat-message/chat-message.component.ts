import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';
import { AuthService } from '../../../core/services/auth.service';
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

  userInitials(): string {
    return this.auth.displayName().slice(0, 2).toUpperCase();
  }

  openSource(source: { id: number; source: string }): void {
    if (source.source === 'user_listing') {
      this.router.navigate(['/user-listings', source.id]);
    } else {
      this.router.navigate(['/listings', source.id]);
    }
  }
}
