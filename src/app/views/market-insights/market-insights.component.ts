import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MARKET_STATS, DISTRICTS, TREND_ROWS } from '../../core/data/market.data';

@Component({
  selector: 'app-market-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-insights.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class MarketInsightsComponent {
  stats    = MARKET_STATS;
  districts = DISTRICTS;
  trendRows = TREND_ROWS;
}
