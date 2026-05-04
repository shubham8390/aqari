import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService, ViewKey } from '../../core/services/navigation.service';
import { ThemeService } from '../../core/services/theme.service';
import { LayoutService } from '../../core/services/layout.service';

interface NavItem {
  key: ViewKey;
  icon: string;
  label: string;
  badge?: string;
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

  navItems: NavItem[] = [
    { key: 'search',    icon: '🔍', label: 'Property Search',   badge: '847' },
    { key: 'market',    icon: '📊', label: 'Market Insights'                 },
    { key: 'negotiate', icon: '🤝', label: 'Negotiation Guide'               },
    { key: 'docs',      icon: '📋', label: 'Documents & Ejari'               },
    { key: 'rera',      icon: '🏛️', label: 'RERA Compliance'                 },
  ];

  sessionItems: NavItem[] = [
    { key: 'history', icon: '💬', label: 'Past Sessions', badge: '3' },
  ];

  journeySteps: JourneyStep[] = [
    { key: 'search',    label: 'Requirements set',  state: 'done'    },
    { key: 'search',    label: 'Properties found',  state: 'done'    },
    { key: 'negotiate', label: 'Negotiating price', state: 'active'  },
    { key: 'docs',      label: 'Documents ready',   state: 'pending' },
    { key: 'docs',      label: 'Contract & Ejari',  state: 'pending' },
    { key: 'rera',      label: 'Move-in',           state: 'pending' },
  ];

  collapsed = signal(false);
  toggleCollapsed(): void { this.collapsed.update(v => !v); }

  navigate(key: ViewKey): void {
    this.nav.navigate(key);
    this.router.navigate(['/', key]);
    if (this.layout.isMobile()) { this.layout.closeSidebar(); }
  }

  isActive(key: ViewKey): boolean {
    return this.nav.activeView() === key;
  }

  get isLight(): boolean {
    return this.theme.theme() === 'light';
  }
}
