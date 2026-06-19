import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalService } from './auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileSetupService } from './profile-setup.service';
import { UserType } from '../../core/models/auth.model';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent {
  auth = inject(AuthModalService);
  authService = inject(AuthService);
  profileSetup = inject(ProfileSetupService);

  signInEmail    = '';
  signInPassword = '';

  signUpEmail            = '';
  signUpPassword         = '';
  signUpConfirmPassword  = '';
  signUpUserType: UserType = 'regular';

  loading = false;
  error   = '';

  close(): void {
    this.auth.close();
    this.error = '';
  }

  switchToSignUp(): void {
    this.auth.setMode('signup');
    this.error = '';
  }

  switchToSignIn(): void {
    this.auth.setMode('signin');
    this.error = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['overlay'] === 'true') {
      this.close();
    }
  }

  onSignInSubmit(): void {
    if (!this.signInEmail || !this.signInPassword) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.login(this.signInEmail, this.signInPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.close();
        if (!res.user.profile_complete) {
          this.profileSetup.open();
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid email or password.';
      },
    });
  }

  onSignUpSubmit(): void {
    if (!this.signUpEmail || !this.signUpPassword) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    if (this.signUpPassword !== this.signUpConfirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authService.register({
      email: this.signUpEmail,
      password: this.signUpPassword,
      user_type: this.signUpUserType,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.close();
        if (!res.user.profile_complete) {
          this.profileSetup.open();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.detail?.[0]?.msg || 'Registration failed. Email may already be in use.';
      },
    });
  }
}
