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

export const BUILDER_MARKET_STATS: MarketStat[] = [
  { value: '3',       label: 'Active projects',      change: '2 under construction', changeType: 'neutral' },
  { value: '12',      label: 'Units listed',         change: '↑ 4 added this month', changeType: 'up'      },
  { value: '₹5,200',  label: 'Your avg / sq ft',     change: 'Baner · Wakad mix',    changeType: 'neutral' },
  { value: '8',       label: 'Buyer inquiries',      change: '↑ This week',          changeType: 'up'      },
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

export const BUILDER_INSIGHTS: RightPanelInsight[] = [
  {
    icon: '📋',
    text: 'MahaRERA-registered projects receive more buyer inquiries — keep compliance docs current',
    route: 'properties',
  },
  {
    icon: '💰',
    text: 'Refresh unit pricing and configs monthly to stay competitive in Baner & Kharadi',
    route: 'properties',
  },
  {
    icon: '📅',
    text: 'Festive season (Oct–Dec) — highlight limited-time offers on under-construction inventory',
    route: 'market',
  },
];

export const REGULAR_READINESS: RightPanelReadinessItem[] = [
  { icon: '🪪', name: 'Aadhaar & PAN',              status: 'done',    route: 'docs' },
  { icon: '🏦', name: 'Home Loan Pre-approval',     status: 'pending', route: 'docs' },
  { icon: '📝', name: 'Sale Agreement Draft',       status: 'pending', route: 'docs' },
  { icon: '🏛️', name: 'MahaRERA Allotment Letter', status: 'pending', route: 'rera' },
  { icon: '💳', name: 'Stamp Duty & Registration', status: 'pending', route: 'docs' },
];

export const BUILDER_READINESS: RightPanelReadinessItem[] = [
  { icon: '🏛️', name: 'MahaRERA Registration',    status: 'done',    route: 'properties' },
  { icon: '📄', name: 'Project Brochure',           status: 'done',    route: 'properties' },
  { icon: '📐', name: 'Floor Plans & Configs',      status: 'done',    route: 'properties' },
  { icon: '💰', name: 'Unit Pricing Sheet',         status: 'pending', route: 'properties' },
  { icon: '📅', name: 'Possession Timeline',        status: 'pending', route: 'properties' },
  { icon: '✅', name: 'RERA Compliance Certificate', status: 'pending', route: 'properties' },
];
