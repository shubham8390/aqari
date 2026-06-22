import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutConfirmService } from './logout-confirm.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from './auth-modal.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-logout-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-confirm.component.html',
})
export class LogoutConfirmComponent {
  confirm = inject(LogoutConfirmService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);
  private chat = inject(ChatService);

  close(): void {
    this.confirm.close();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['overlay'] === 'true') {
      this.close();
    }
  }

  confirmLogout(): void {
    this.auth.logout();
    this.chat.startNewSession();
    this.close();
    this.authModal.open('signin');
  }
}
