import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API } from '../config/api.config';
import { SignupRequest, TokenResponse, UserRead } from '../models/auth.model';
import { NavigationService } from './navigation.service';

const TOKEN_KEY = 'aqari_access_token';
const USER_KEY  = 'aqari_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly nav = inject(NavigationService);

  private readonly _token = signal<string | null>(this.loadToken());
  private readonly _user  = signal<UserRead | null>(this.loadUser());

  readonly token = this._token.asReadonly();
  readonly user  = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly displayName = computed(() => {
    const u = this._user();
    return u?.name || u?.email?.split('@')[0] || 'User';
  });

  register(payload: SignupRequest) {
    return this.http.post<TokenResponse>(API.authRegister, payload).pipe(
      tap(res => this.setSession(res)),
    );
  }

  login(email: string, password: string) {
    const body = new URLSearchParams({ username: email, password }).toString();
    return this.http.post<TokenResponse>(API.authToken, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }).pipe(
      tap(res => this.setSession(res)),
    );
  }

  logout(options: { redirect?: boolean } = {}): void {
    const { redirect = true } = options;
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    if (redirect) {
      this.nav.navigate('search');
      this.router.navigate(['/search']);
    }
  }

  updateUser(user: UserRead): void {
    this._user.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return this._token();
  }

  private setSession(res: TokenResponse): void {
    this._token.set(res.access_token);
    this._user.set(res.user);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
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
