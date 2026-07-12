import { Injectable, signal, effect, computed } from '@angular/core';
import { APP_LOGO_SRC, APP_LOGO_SRC_Dark } from '../constants/brand.constants';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'aqari-theme';

  theme = signal<Theme>(this.getInitialTheme());

  /** Wordmark for the current theme (dark → dark logo, light → blue logo). */
  readonly logoSrc = computed(() =>
    this.theme() === 'dark' ? APP_LOGO_SRC_Dark : APP_LOGO_SRC,
  );

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : '');
      localStorage.setItem(this.STORAGE_KEY, t);
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    return stored ?? 'light';
  }
}
