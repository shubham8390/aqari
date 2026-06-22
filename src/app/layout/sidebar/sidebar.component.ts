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
  readonly logoSrc = '/images/Light_Logo.jpg';
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
    { key: 'negotiate',  icon: '🤝', label: 'Negotiation Guide', regularOnly: true },
    { key: 'docs',       icon: '📋', label: 'Documents & Ejari', regularOnly: true },
    { key: 'rera',       icon: '🏛️', label: 'RERA Compliance', regularOnly: true },
  ];

  sessionItems: NavItem[] = [
    { key: 'history', icon: '💬', label: 'Past Sessions', authOnly: true },
  ];

  private readonly buyerJourneyOrder: ViewKey[] = ['search', 'market', 'negotiate', 'docs', 'rera'];
  private readonly builderJourneyOrder: ViewKey[] = ['search', 'market', 'properties'];
  private readonly journeyLabels: Record<string, string> = {
    search: 'Search',
    market: 'Market Insights',
    properties: 'My Properties',
    negotiate: 'Negotiate',
    docs: 'Documents',
    rera: 'RERA',
  };

  journeySteps: JourneyStep[] = this.buildJourneySteps('search');

  collapsed = signal(true);
  toggleCollapsed(): void { this.collapsed.update(v => !v); }

  navigate(key: ViewKey): void {
    this.nav.navigate(key);
    this.router.navigate(['/', key]);
    this.updateJourneySteps(key);
    if (this.layout.isMobile()) { this.layout.closeSidebar(); }
  }

  private updateJourneySteps(active: ViewKey): void {
    this.journeySteps = this.buildJourneySteps(active);
  }

  private buildJourneySteps(active: ViewKey): JourneyStep[] {
    const order = this.auth.isBuilder() ? this.builderJourneyOrder : this.buyerJourneyOrder;
    const activeIdx = order.indexOf(active);
    return order.map((key, i) => ({
      key,
      label: this.journeyLabels[key] ?? key,
      state: activeIdx < 0
        ? (key === 'search' ? 'active' : 'pending')
        : i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending',
    }));
  }

  journeySectionTitle(): string {
    return this.auth.isBuilder() ? 'Builder Requirement' : 'Your Journey';
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
