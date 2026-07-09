import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatSessionService } from '../../core/services/chat-session.service';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { ChatSession } from '../../core/models/chat-api.model';

@Component({
  selector: 'app-past-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-sessions.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class PastSessionsComponent implements OnInit {
  nav = inject(NavigationService);
  router = inject(Router);
  sessionService = inject(ChatSessionService);
  chat = inject(ChatService);
  auth = inject(AuthService);
  authModal = inject(AuthModalService);

  sessions = signal<ChatSession[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.loadSessions();
    }
  }

  loadSessions(): void {
    this.loading.set(true);
    this.error.set('');
    this.sessionService.listSessions(20).subscribe({
      next: (res) => {
        this.sessions.set(res.sessions);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load sessions.');
      },
    });
  }

  openLogin(): void {
    this.authModal.open('signin', '/history');
  }

  openSession(session: ChatSession): void {
    this.sessionService.getMessages(session.session_id).subscribe({
      next: (messages) => {
        this.chat.loadSession(session.session_id, messages);
        this.nav.navigate('search');
        this.router.navigate(['/search']);
      },
    });
  }

  deleteSession(session: ChatSession, event: Event): void {
    event.stopPropagation();
    this.sessionService.clearSession(session.session_id).subscribe({
      next: () => this.loadSessions(),
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }
}
