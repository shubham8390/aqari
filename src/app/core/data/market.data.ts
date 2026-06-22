import { MarketStat, District, TrendRow } from '../models/market.model';

export const MARKET_STATS: MarketStat[] = [
  { value: '₹85 L',   label: 'Baner 2BHK avg',       change: '↑ 6.8% YoY',    changeType: 'up'      },
  { value: '91%',     label: 'West Pune absorption', change: '↑ 3.4% YoY',    changeType: 'up'      },
  { value: '₹5,200',  label: 'Avg price / sq ft',    change: '↑ Stable',      changeType: 'up'      },
  { value: '38 days', label: 'Avg listing duration', change: 'Good leverage', changeType: 'neutral' },
];

export const DISTRICTS: District[] = [
  { emoji: '🏙️', name: 'Baner',      avgRent: '₹85 L',  meta: 'avg 2BHK · ready to move', barWidth: 100 },
  { emoji: '🌿', name: 'Wakad',      avgRent: '₹72 L',  meta: 'avg 2BHK · ready to move', barWidth: 85  },
  { emoji: '🏢', name: 'Kharadi',    avgRent: '₹78 L',  meta: 'avg 2BHK · IT corridor',   barWidth: 92  },
  { emoji: '💼', name: 'Hinjewadi',  avgRent: '₹68 L',  meta: 'avg 2BHK · near IT parks', barWidth: 80  },
  { emoji: '🛣️', name: 'Hadapsar',   avgRent: '₹62 L',  meta: 'avg 2BHK · emerging hub',  barWidth: 73  },
  { emoji: '✈️', name: 'Viman Nagar', avgRent: '₹88 L', meta: 'avg 2BHK · airport road',  barWidth: 96  },
];

export const TREND_ROWS: TrendRow[] = [
  { district: 'Baner',       avgRent: '₹85 L', yoyChange: '↑ 6.8%',  yoyType: 'up',   occupancy: '93%', yield: '4.1%' },
  { district: 'Wakad',       avgRent: '₹72 L', yoyChange: '↑ 5.2%',  yoyType: 'up',   occupancy: '91%', yield: '4.4%' },
  { district: 'Kharadi',     avgRent: '₹78 L', yoyChange: '↑ 7.1%',  yoyType: 'up',   occupancy: '90%', yield: '4.0%' },
  { district: 'Hinjewadi',   avgRent: '₹68 L', yoyChange: '↑ 4.5%',  yoyType: 'up',   occupancy: '89%', yield: '4.6%' },
  { district: 'Hadapsar',    avgRent: '₹62 L', yoyChange: '↑ 8.3%',  yoyType: 'up',   occupancy: '87%', yield: '4.8%' },
  { district: 'Viman Nagar', avgRent: '₹88 L', yoyChange: '↑ 3.9%',  yoyType: 'up',   occupancy: '92%', yield: '3.9%' },
  { district: 'Kothrud',     avgRent: '₹75 L', yoyChange: '↑ 2.8%',  yoyType: 'up',   occupancy: '90%', yield: '4.2%' },
];
