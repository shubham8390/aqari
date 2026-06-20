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

  signUpAttempted = false;
  signUpFieldErrors = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  close(): void {
    this.auth.close();
    this.error = '';
    this.resetSignUpValidation();
  }

  switchToSignUp(): void {
    this.auth.setMode('signup');
    this.error = '';
    this.resetSignUpValidation();
  }

  switchToSignIn(): void {
    this.auth.setMode('signin');
    this.error = '';
    this.resetSignUpValidation();
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
    this.signUpAttempted = true;
    this.error = '';
    if (!this.validateSignUpForm()) return;

    this.loading = true;
    this.authService.register({
      email: this.signUpEmail.trim(),
      password: this.signUpPassword,
      user_type: this.signUpUserType,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.close();
        this.resetSignUpValidation();
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

  onSignUpFieldChange(field: 'email' | 'password' | 'confirmPassword'): void {
    if (this.signUpAttempted) {
      this.validateSignUpForm();
    } else {
      this.signUpFieldErrors[field] = '';
    }
  }

  signUpInputBorder(field: 'email' | 'password' | 'confirmPassword'): string {
    return this.signUpAttempted && this.signUpFieldErrors[field]
      ? '1px solid var(--accent-red)'
      : '1px solid var(--border-mid)';
  }

  private resetSignUpValidation(): void {
    this.signUpAttempted = false;
    this.signUpFieldErrors = { email: '', password: '', confirmPassword: '' };
  }

  private validateSignUpForm(): boolean {
    this.signUpFieldErrors = { email: '', password: '', confirmPassword: '' };
    let valid = true;

    const email = this.signUpEmail.trim();
    if (!email) {
      this.signUpFieldErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.signUpFieldErrors.email = 'Enter a valid email address.';
      valid = false;
    }

    if (!this.signUpPassword) {
      this.signUpFieldErrors.password = 'Password is required.';
      valid = false;
    } else if (this.signUpPassword.length < 8) {
      this.signUpFieldErrors.password = 'Password must be at least 8 characters.';
      valid = false;
    }

    if (!this.signUpConfirmPassword) {
      this.signUpFieldErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (this.signUpPassword !== this.signUpConfirmPassword) {
      this.signUpFieldErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    return valid;
  }
}
