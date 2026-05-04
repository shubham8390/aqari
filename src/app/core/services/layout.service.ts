import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _isMobile  = signal(this.calcMobile());
  private readonly _sidebarOpen     = signal(false);
  private readonly _rightPanelOpen  = signal(false);

  readonly isMobile       = this._isMobile.asReadonly();
  readonly sidebarOpen    = this._sidebarOpen.asReadonly();
  readonly rightPanelOpen = this._rightPanelOpen.asReadonly();

  constructor() {
    window.addEventListener('resize', () => {
      const mobile = this.calcMobile();
      this._isMobile.set(mobile);
      if (!mobile) { this.closeAll(); }
    });
  }

  private calcMobile(): boolean { return window.innerWidth < 768; }

  toggleSidebar(): void    { this._sidebarOpen.update(v => !v); }
  closeSidebar(): void     { this._sidebarOpen.set(false); }
  toggleRightPanel(): void { this._rightPanelOpen.update(v => !v); }
  closeAll(): void         { this._sidebarOpen.set(false); this._rightPanelOpen.set(false); }
}
