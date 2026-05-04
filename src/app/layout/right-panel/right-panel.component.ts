import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatService } from '../../core/services/chat.service';
import { AGENT_INSIGHTS } from '../../core/data/insights.data';
import { RIGHT_PANEL_DOCS } from '../../core/data/documents.data';
import { MARKET_STATS } from '../../core/data/market.data';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-panel.component.html',
  host: { style: 'display:flex;flex-shrink:0;height:100%;' },
})
export class RightPanelComponent {
  nav    = inject(NavigationService);
  chat   = inject(ChatService);
  router = inject(Router);

  marketStats = MARKET_STATS;
  insights    = AGENT_INSIGHTS;
  docs        = RIGHT_PANEL_DOCS;

  navigateTo(route: string): void {
    this.nav.navigate(route as any);
    this.router.navigate(['/', route]);
  }

  scheduleViewing(): void {
    this.nav.navigate('search');
    this.router.navigate(['/search']);
    setTimeout(() => {
      this.chat.sendMessage('Schedule a property viewing for Marina Gate II');
    }, 80);
  }
}
