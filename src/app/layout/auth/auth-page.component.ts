import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { ProfileSetupService } from './profile-setup.service';
import { AUTH_HERO_IMAGE, AUTH_HERO_IMAGE_FALLBACK } from '../../core/data/auth.data';
import { APP_LOGO_SRC } from '../../core/constants/brand.constants';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  host: { class: 'auth-page-root' },
})
export class AuthPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly chat = inject(ChatService);
  private readonly profileSetup = inject(ProfileSetupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly logoSrc = APP_LOGO_SRC;
  readonly heroImage = AUTH_HERO_IMAGE;

  mode: 'signin' | 'signup' = 'signin';

  signInEmail = '';
  signInPassword = '';

  signUpEmail = '';
  signUpPassword = '';
  signUpConfirmPassword = '';

  loading = false;
  error = '';

  signUpAttempted = false;
  signUpFieldErrors = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  signInFormNonce = 0;
  signUpFormNonce = 0;

  ngOnInit(): void {
    document.documentElement.classList.add('auth-page-active');
    document.body.classList.add('auth-page-active');

    this.mode = this.route.snapshot.data['mode'] === 'signup' ? 'signup' : 'signin';

    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl(this.resolveReturnUrl());
    }
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('auth-page-active');
    document.body.classList.remove('auth-page-active');
  }

  get isSignIn(): boolean {
    return this.mode === 'signin';
  }

  goHome(): void {
    void this.router.navigate(['/']);
  }

  onHeroError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes(AUTH_HERO_IMAGE_FALLBACK)) {
      img.src = AUTH_HERO_IMAGE_FALLBACK;
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
      next: (res) => this.handleAuthSuccess(res.user.profile_complete),
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
    }).subscribe({
      next: (res) => {
        this.resetSignUpValidation();
        this.handleAuthSuccess(res.user.profile_complete);
      },
      error: (err) => {
        this.loading = false;
        const detail = err?.error?.detail;
        this.error = typeof detail === 'string'
          ? detail
          : detail?.[0]?.msg || 'Registration failed. Email may already be in use.';
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
      : '1px solid #C8CDD5';
  }

  private handleAuthSuccess(profileComplete: boolean): void {
    this.loading = false;
    this.chat.refreshWelcomeIfInitial();
    if (!profileComplete) {
      this.profileSetup.open();
    }
    void this.router.navigateByUrl(this.resolveReturnUrl());
  }

  private resolveReturnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl');
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
      return raw;
    }
    return '/search';
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
