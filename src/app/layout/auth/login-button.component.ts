import { Component, inject } from '@angular/core';
import { AuthModalService } from './auth-modal.service';

@Component({
  selector: 'app-login-button',
  standalone: true,
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent {
  private authModal = inject(AuthModalService);

  openLogin(): void {
    this.authModal.open('signin');
  }
}
