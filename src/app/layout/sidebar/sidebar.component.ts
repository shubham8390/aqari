import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService, ViewKey } from '../../core/services/navigation.service';
import { ThemeService } from '../../core/services/theme.service';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileSetupService } from '../auth/profile-setup.service';

interface NavItem {
  key: ViewKey;
  icon: string;
  label: string;
  badge?: string;
  authOnly?: boolean;
  builderOnly?: boolean;
  regularOnly?: boolean;
}

interface JourneyStep {
  key: ViewKey;
  label: string;
  state: 'done' | 'active' | 'pending';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  host: {
    style: 'display:flex;flex-shrink:0;height:100%;',
    '[class.sidebar-mobile-open]': 'layout.sidebarOpen()',
  },
})
export class SidebarComponent {
  nav    = inject(NavigationService);
  theme  = inject(ThemeService);
  router = inject(Router);
  layout = inject(LayoutService);
  auth   = inject(AuthService);
  profileSetup = inject(ProfileSetupService);

  navItems: NavItem[] = [
    { key: 'search',     icon: '🔍', label: 'Property Search' },
    { key: 'properties', icon: '🏠', label: 'My Properties', authOnly: true },
    { key: 'market',     icon: '📊', label: 'Market Insights' },
    { key: 'negotiate',  icon: '🤝', label: 'Negotiation Guide' },
    { key: 'docs',       icon: '📋', label: 'Documents & Ejari' },
    { key: 'rera',       icon: '🏛️', label: 'RERA Compliance' },
  ];

  sessionItems: NavItem[] = [
    { key: 'history', icon: '💬', label: 'Past Sessions', authOnly: true },
  ];

  journeySteps: JourneyStep[] = [
    { key: 'search', label: 'Search', state: 'active' },
    { key: 'market', label: 'Market Insights', state: 'pending' },
    { key: 'negotiate', label: 'Negotiate', state: 'pending' },
    { key: 'docs', label: 'Documents', state: 'pending' },
    { key: 'rera', label: 'RERA', state: 'pending' },
  ];

  private readonly journeyOrder: ViewKey[] = ['search', 'market', 'negotiate', 'docs', 'rera'];
  private readonly journeyLabels: Record<string, string> = {
    search: 'Search',
    market: 'Market Insights',
    negotiate: 'Negotiate',
    docs: 'Documents',
    rera: 'RERA',
  };

  collapsed = signal(true);
  toggleCollapsed(): void { this.collapsed.update(v => !v); }

  navigate(key: ViewKey): void {
    this.nav.navigate(key);
    this.router.navigate(['/', key]);
    this.updateJourneySteps(key);
    if (this.layout.isMobile()) { this.layout.closeSidebar(); }
  }

  private updateJourneySteps(active: ViewKey): void {
    const activeIdx = this.journeyOrder.indexOf(active);
    this.journeySteps = this.journeyOrder.map((key, i) => ({
      key,
      label: this.journeyLabels[key] ?? key,
      state: activeIdx < 0
        ? (key === 'search' ? 'active' : 'pending')
        : i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending',
    }));
  }

  isActive(key: ViewKey): boolean {
    return this.nav.activeView() === key;
  }

  get isLight(): boolean {
    return this.theme.theme() === 'light';
  }

  visibleNavItems(): NavItem[] {
    return this.navItems.filter(item => this.canShow(item));
  }

  visibleSessionItems(): NavItem[] {
    return this.sessionItems.filter(item => this.canShow(item));
  }

  openProfile(): void {
    this.profileSetup.open();
  }

  userInitials(): string {
    const name = this.auth.displayName();
    return name.slice(0, 2).toUpperCase();
  }

  private canShow(item: NavItem): boolean {
    if (item.authOnly && !this.auth.isAuthenticated()) return false;
    if (item.builderOnly && !this.auth.isBuilder()) return false;
    if (item.regularOnly && this.auth.isBuilder()) return false;
    return true;
  }
}
