import { Injectable, signal } from '@angular/core';

export type AuthMode = 'signin' | 'signup';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  isOpen = signal(false);
  mode   = signal<AuthMode>('signin');

  open(mode: AuthMode = 'signin'): void {
    this.mode.set(mode);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
  }
}
