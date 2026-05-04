import { MarketStat, District, TrendRow } from '../models/market.model';

export const MARKET_STATS: MarketStat[] = [
  { value: 'AED 109K', label: 'Marina 2BHK avg/yr',  change: '↑ 4.2% YoY',    changeType: 'up'      },
  { value: '94%',      label: 'Marina occupancy',    change: '↑ 2.1% YoY',    changeType: 'up'      },
  { value: '6.1%',     label: 'Rental yield avg',    change: '↑ Stable',       changeType: 'up'      },
  { value: '47 days',  label: 'Avg listing duration', change: 'Good leverage', changeType: 'neutral' },
];

export const DISTRICTS: District[] = [
  { emoji: '🏖️', name: 'Dubai Marina',  avgRent: 'AED 109,500', meta: 'per year · avg 2BHK furnished', barWidth: 82  },
  { emoji: '🌇', name: 'Downtown Dubai', avgRent: 'AED 135,000', meta: 'per year · avg 2BHK furnished', barWidth: 100 },
  { emoji: '🌴', name: 'Palm Jumeirah', avgRent: 'AED 180,000', meta: 'per year · avg 2BHK furnished', barWidth: 100 },
  { emoji: '🏙️', name: 'JBR',           avgRent: 'AED 115,000', meta: 'per year · avg 2BHK furnished', barWidth: 86  },
  { emoji: '🌿', name: 'JVC',           avgRent: 'AED 72,000',  meta: 'per year · avg 2BHK furnished', barWidth: 54  },
  { emoji: '🏢', name: 'Business Bay',  avgRent: 'AED 98,000',  meta: 'per year · avg 2BHK furnished', barWidth: 73  },
];

export const TREND_ROWS: TrendRow[] = [
  { district: 'Dubai Marina',  avgRent: 'AED 109K', yoyChange: '↑ 4.2%',  yoyType: 'up',   occupancy: '94%', yield: '6.1%' },
  { district: 'Downtown',      avgRent: 'AED 135K', yoyChange: '↑ 6.8%',  yoyType: 'up',   occupancy: '97%', yield: '5.4%' },
  { district: 'Palm Jumeirah', avgRent: 'AED 180K', yoyChange: '↑ 9.1%',  yoyType: 'up',   occupancy: '92%', yield: '4.8%' },
  { district: 'JBR',           avgRent: 'AED 115K', yoyChange: '↑ 3.5%',  yoyType: 'up',   occupancy: '91%', yield: '5.9%' },
  { district: 'JVC',           avgRent: 'AED 72K',  yoyChange: '↑ 2.1%',  yoyType: 'up',   occupancy: '88%', yield: '7.4%' },
  { district: 'Business Bay',  avgRent: 'AED 98K',  yoyChange: '↓ 0.8%',  yoyType: 'down', occupancy: '89%', yield: '6.3%' },
  { district: 'Dubai Hills',   avgRent: 'AED 128K', yoyChange: '↑ 11.2%', yoyType: 'up',   occupancy: '96%', yield: '5.7%' },
];
