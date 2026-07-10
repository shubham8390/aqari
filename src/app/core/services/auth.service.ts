import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, finalize } from 'rxjs';
import {
  API,
  AUTH_PROVIDER_KEY,
  AUTH_RETURN_URL_KEY,
} from '../config/api.config';
import { AuthProvider, SignupRequest, TokenResponse, UserRead } from '../models/auth.model';
import { NavigationService } from './navigation.service';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'aqari_access_token';
const USER_KEY = 'aqari_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly nav = inject(NavigationService);

  private readonly _token = signal<string | null>(this.loadToken());
  private readonly _user = signal<UserRead | null>(this.loadUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly displayName = computed(() => {
    const u = this._user();
    return u?.name || u?.email?.split('@')[0] || 'User';
  });

  register(payload: SignupRequest) {
    return this.http.post<TokenResponse>(API.authRegister, payload).pipe(
      tap(res => this.setSession(res, 'password')),
    );
  }

  login(email: string, password: string) {
    const body = new URLSearchParams({ username: email, password }).toString();
    return this.http.post<TokenResponse>(API.authToken, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      tap(res => this.setSession(res, 'password')),
    );
  }

  /** Full-page redirect into Google OAuth (backend handles consent + callback). */
  startGoogleLogin(returnUrl?: string): void {
    const safeReturn = this.sanitizeReturnUrl(returnUrl);
    if (safeReturn) {
      sessionStorage.setItem(AUTH_RETURN_URL_KEY, safeReturn);
    } else {
      sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
    }
    window.location.href = environment.googleLoginUrl || API.authGoogleLogin;
  }

  /** Exchange one-time nonce from /loading redirect for a JWT session. */
  exchangeGoogleNonce(nonce: string): Observable<TokenResponse> {
    const params = new HttpParams().set('nonce', nonce);
    return this.http.get<TokenResponse>(API.authGoogleToken, { params }).pipe(
      tap(res => this.setSession(res, 'google')),
    );
  }

  consumeReturnUrl(fallback = '/search'): string {
    const stored = sessionStorage.getItem(AUTH_RETURN_URL_KEY);
    sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
    return this.sanitizeReturnUrl(stored) ?? fallback;
  }

  logout(options: { redirect?: boolean } = {}): void {
    const { redirect = true } = options;
    const provider = this.getAuthProvider();
    const token = this._token();

    const clearLocal = (): void => {
      this._token.set(null);
      this._user.set(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_PROVIDER_KEY);

      if (redirect) {
        this.nav.navigate('search');
        void this.router.navigate(['/search']);
      }
    };

    if (provider === 'google' && token) {
      this.http.post(API.authGoogleLogout, {}).pipe(
        catchError(() => of(null)),
        finalize(clearLocal),
      ).subscribe();
      return;
    }

    clearLocal();
  }

  updateUser(user: UserRead): void {
    this._user.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return this._token();
  }

  getAuthProvider(): AuthProvider | null {
    const raw = localStorage.getItem(AUTH_PROVIDER_KEY);
    return raw === 'google' || raw === 'password' ? raw : null;
  }

  private setSession(res: TokenResponse, provider: AuthProvider): void {
    this._token.set(res.access_token);
    this._user.set(res.user);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
  }

  private sanitizeReturnUrl(raw?: string | null): string | null {
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
      return raw;
    }
    return null;
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): UserRead | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as UserRead; } catch { return null; }
  }
}
