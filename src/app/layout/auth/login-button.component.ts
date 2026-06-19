import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalService } from './auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileSetupService } from './profile-setup.service';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent {
  private authModal = inject(AuthModalService);
  auth = inject(AuthService);
  profileSetup = inject(ProfileSetupService);

  openLogin(): void {
    this.authModal.open('signin');
  }

  logout(): void {
    this.auth.logout();
  }

  editProfile(): void {
    this.profileSetup.open();
  }
}
