import { Session } from '../models/market.model';

export const SESSIONS: Session[] = [
  {
    id: '4',
    icon: '🏙️',
    title: 'Session #4 — Marina Gate II Negotiation',
    meta: 'Dubai Marina · 2BHK Furnished · AED 115,000',
    chips: [
      { label: 'Negotiating',        type: 'gold'    },
      { label: '847 listings scanned', type: 'default' },
      { label: '3 shortlisted',      type: 'default' },
    ],
    date: 'Today, 10:06',
    status: 'ongoing',
    statusLabel: '● In Progress',
  },
  {
    id: '3',
    icon: '🌴',
    title: 'Session #3 — Palm Jumeirah Exploration',
    meta: 'Palm Jumeirah · 3BHK · AED 250,000 budget',
    chips: [
      { label: 'Market research',   type: 'default' },
      { label: '12 listings viewed', type: 'default' },
    ],
    date: 'Mar 25, 2025',
    status: 'done',
    statusLabel: '✓ Completed',
  },
  {
    id: '2',
    icon: '🏢',
    title: 'Session #2 — Downtown Studio Search',
    meta: 'Downtown Dubai · Studio · AED 75,000 budget',
    chips: [
      { label: '5 viewings scheduled', type: 'default' },
      { label: 'Ejari completed',      type: 'gold'    },
    ],
    date: 'Mar 18, 2025',
    status: 'done',
    statusLabel: '✓ Moved in',
  },
];

export const ACTIVITY_STATS = [
  { value: '4',      label: 'Total sessions',     change: '',                changeType: 'neutral' as const },
  { value: '1,400+', label: 'Listings reviewed',  change: '',                changeType: 'neutral' as const },
  { value: 'AED 12K', label: 'Savings negotiated', change: '↑ vs. asking price', changeType: 'up' as const },
];
