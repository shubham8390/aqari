export interface MarketStat {
  value: string;
  label: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
}

export interface District {
  emoji: string;
  name: string;
  avgRent: string;
  meta: string;
  barWidth: number;
}

export interface TrendRow {
  district: string;
  avgRent: string;
  yoyChange: string;
  yoyType: 'up' | 'down';
  occupancy: string;
  yield: string;
}

export interface DocumentItem {
  icon: string;
  name: string;
  description: string;
  status: 'done' | 'pending' | 'required';
}

export interface EjariStep {
  title: string;
  description: string;
  state: 'done' | 'active' | 'todo';
  stepNum: string;
}

export interface Insight {
  icon: string;
  text: string;
  boldPart: string;
  route: string;
}

export interface Session {
  id: string;
  icon: string;
  title: string;
  meta: string;
  chips: { label: string; type: 'gold' | 'default' }[];
  date: string;
  status: 'ongoing' | 'done';
  statusLabel: string;
}

export interface ReraCard {
  icon: string;
  title: string;
  text: string;
}

export interface ReraRule {
  title: string;
  description: string;
}
