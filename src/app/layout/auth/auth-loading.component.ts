import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { ProfileSetupService } from './profile-setup.service';
import { APP_LOGO_SRC } from '../../core/constants/brand.constants';

@Component({
  selector: 'app-auth-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-loading.component.html',
  host: { class: 'auth-loading-root' },
})
export class AuthLoadingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly chat = inject(ChatService);
  private readonly profileSetup = inject(ProfileSetupService);

  readonly logoSrc = APP_LOGO_SRC;
  status = 'Signing you in with Google…';
  error = '';

  ngOnInit(): void {
    document.documentElement.classList.add('auth-page-active');
    document.body.classList.add('auth-page-active');

    const nonce = this.route.snapshot.queryParamMap.get('nonce')?.trim();
    if (!nonce) {
      this.error = 'Missing sign-in token. Please try Google sign-in again.';
      this.status = 'Sign-in failed';
      return;
    }

    this.auth.exchangeGoogleNonce(nonce).subscribe({
      next: (res) => {
        this.status = 'Success — redirecting…';
        this.chat.refreshWelcomeIfInitial();
        if (!res.user.profile_complete) {
          this.profileSetup.open();
        }
        const returnUrl = this.auth.consumeReturnUrl('/search');
        void this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error = 'Google sign-in expired or failed. Please try again.';
        this.status = 'Sign-in failed';
      },
    });
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('auth-page-active');
    document.body.classList.remove('auth-page-active');
  }

  retry(): void {
    void this.router.navigate(['/login']);
  }
}
