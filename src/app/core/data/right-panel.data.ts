import { MarketStat } from '../models/market.model';
import { ViewKey } from '../services/navigation.service';

export interface RightPanelInsight {
  icon: string;
  text: string;
  route: ViewKey;
}

export interface RightPanelReadinessItem {
  icon: string;
  name: string;
  status: 'done' | 'pending';
  route: ViewKey;
}

export const REGULAR_MARKET_STATS: MarketStat[] = [
  { value: '₹85 L',   label: 'Baner 2BHK avg',       change: '↑ 6.8% YoY',    changeType: 'up'      },
  { value: '91%',     label: 'West Pune absorption', change: '↑ 3.4% YoY',    changeType: 'up'      },
  { value: '₹5,200',  label: 'Avg price / sq ft',    change: '↑ Stable',      changeType: 'up'      },
  { value: '38 days', label: 'Avg listing duration', change: 'Good leverage', changeType: 'neutral' },
];

export const REGULAR_INSIGHTS: RightPanelInsight[] = [
  {
    icon: '🔥',
    text: 'High demand for 2 BHK in Baner & Wakad — ready-to-move units moving fast',
    route: 'search',
  },
  {
    icon: '💡',
    text: 'Under-construction projects in Kharadi often offer 8–12% better value vs ready',
    route: 'negotiate',
  },
  {
    icon: '📅',
    text: 'Festive season (Oct–Dec) — builders in Pune frequently run limited-time offers',
    route: 'market',
  },
];

export const REGULAR_READINESS: RightPanelReadinessItem[] = [
  { icon: '🪪', name: 'Aadhaar & PAN',              status: 'done',    route: 'rera' },
  { icon: '🏦', name: 'Home Loan Pre-approval',     status: 'pending', route: 'rera' },
  { icon: '📝', name: 'Sale Agreement Draft',       status: 'pending', route: 'rera' },
  { icon: '🏛️', name: 'MahaRERA Allotment Letter', status: 'pending', route: 'rera' },
  { icon: '💳', name: 'Stamp Duty & Registration', status: 'pending', route: 'rera' },
];
