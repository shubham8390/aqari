import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export type AuthMode = 'signin' | 'signup';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private readonly router = inject(Router);

  open(mode: AuthMode = 'signin', returnUrl?: string): void {
    const path = mode === 'signup' ? '/signup' : '/login';
    this.router.navigate([path], {
      queryParams: returnUrl ? { returnUrl } : {},
    });
  }

  /** @deprecated Full-page auth — use router navigation instead */
  close(): void {}

  setMode(mode: AuthMode): void {
    const path = mode === 'signup' ? '/signup' : '/login';
    this.router.navigate([path], { queryParamsHandling: 'preserve' });
  }
}
