import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from './auth-modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent {
  auth = inject(AuthModalService);

  signInEmail    = '';
  signInPassword = '';

  signUpName            = '';
  signUpEmail           = '';
  signUpPassword        = '';
  signUpConfirmPassword = '';

  close(): void {
    this.auth.close();
  }

  switchToSignUp(): void {
    this.auth.setMode('signup');
  }

  switchToSignIn(): void {
    this.auth.setMode('signin');
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['overlay'] === 'true') {
      this.close();
    }
  }

  onGoogleAuth(): void {
    // Placeholder — wire to OAuth flow later
  }

  onMicrosoftAuth(): void {
    // Placeholder — wire to OAuth flow later
  }

  onSignInSubmit(): void {
    // Placeholder — wire to auth API later
  }

  onSignUpSubmit(): void {
    // Placeholder — wire to auth API later
  }
}
