import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatService } from '../../core/services/chat.service';
import { LayoutService } from '../../core/services/layout.service';
import {
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

  collapsed = signal(true);
  toggleCollapsed(): void { this.collapsed.update(v => !v); }

  readonly marketSectionTitle = 'Pune Market Now';
  readonly readinessSectionTitle = 'Document Readiness';
  readonly marketStats = REGULAR_MARKET_STATS;
  readonly insights = REGULAR_INSIGHTS;
  readonly readinessItems = REGULAR_READINESS;
  readonly ctaTitle = '📅 Schedule a Viewing';
  readonly ctaSubtitle = 'Agent will coordinate with broker';

  navigateTo(route: string): void {
    this.nav.navigate(route as any);
    this.router.navigate(['/', route]);
  }

  onCtaClick(): void {
    this.nav.navigate('search');
    this.router.navigate(['/search']);
    setTimeout(() => {
      this.chat.sendMessage('Schedule a site visit for a 2 BHK in Baner');
    }, 80);
  }
}
