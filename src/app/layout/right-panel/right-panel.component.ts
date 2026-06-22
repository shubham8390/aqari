import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatService } from '../../core/services/chat.service';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import {
  BUILDER_INSIGHTS,
  BUILDER_MARKET_STATS,
  BUILDER_READINESS,
  REGULAR_INSIGHTS,
  REGULAR_MARKET_STATS,
  REGULAR_READINESS,
} from '../../core/data/right-panel.data';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-panel.component.html',
  host: {
    style: 'display:flex;flex-shrink:0;height:100%;position:relative;',
    '[class.panel-mobile-open]': 'layout.rightPanelOpen()',
  },
})
export class RightPanelComponent {
  nav    = inject(NavigationService);
  chat   = inject(ChatService);
  router = inject(Router);
  layout = inject(LayoutService);
  auth   = inject(AuthService);

  collapsed = signal(true);
  toggleCollapsed(): void { this.collapsed.update(v => !v); }

  marketSectionTitle = computed(() =>
    this.auth.isBuilder() ? 'Your Portfolio' : 'Pune Market Now',
  );

  readinessSectionTitle = computed(() =>
    this.auth.isBuilder() ? 'Listing Readiness' : 'Document Readiness',
  );

  marketStats = computed(() =>
    this.auth.isBuilder() ? BUILDER_MARKET_STATS : REGULAR_MARKET_STATS,
  );

  insights = computed(() =>
    this.auth.isBuilder() ? BUILDER_INSIGHTS : REGULAR_INSIGHTS,
  );

  readinessItems = computed(() =>
    this.auth.isBuilder() ? BUILDER_READINESS : REGULAR_READINESS,
  );

  ctaTitle = computed(() =>
    this.auth.isBuilder() ? '🏠 Manage Listings' : '📅 Schedule a Viewing',
  );

  ctaSubtitle = computed(() =>
    this.auth.isBuilder()
      ? 'Add projects, units, and pricing'
      : 'Agent will coordinate with broker',
  );

  navigateTo(route: string): void {
    this.nav.navigate(route as any);
    this.router.navigate(['/', route]);
  }

  onCtaClick(): void {
    if (this.auth.isBuilder()) {
      this.navigateTo('properties');
      return;
    }
    this.scheduleViewing();
  }

  private scheduleViewing(): void {
    this.nav.navigate('search');
    this.router.navigate(['/search']);
    setTimeout(() => {
      this.chat.sendMessage('Schedule a site visit for a 2 BHK in Baner');
    }, 80);
  }
}
