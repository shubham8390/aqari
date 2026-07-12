export interface LandingNavLink {
  label: string;
  route: string;
}

export interface LandingRailItem {
  icon: string;
  label: string;
  route: string;
}

/** App-shell rail item — route nav or a local action (New Chat). */
export interface AppShellRailItem {
  icon: string;
  label: string;
  route?: string;
  action?: 'new-chat';
}

export interface LandingProjectCard {
  id: number;
  name: string;
  price: string;
  specs: string;
  image: string;
  badge?: string;
  badgeTone?: 'green' | 'orange';
}

export interface LandingServiceCard {
  title: string;
  description: string;
  cta: string;
  route: string;
  query?: string;
  emoji: string;
}

export const HERO_HEADLINE = 'Projects. Pricing. RERA. AI Search.';
export const HERO_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80';
export const SEARCH_PLACEHOLDER = 'Try: 2 BHK in Baner under 1 Cr';

export const LANDING_FOOTER_LINKS: LandingNavLink[] = [
  { label: 'Market', route: '/market' },
  { label: 'Negotiate', route: '/negotiate' },
  { label: 'RERA', route: '/rera' },
];

export const LANDING_RAIL_ITEMS: LandingRailItem[] = [
  { icon: '🔍', label: 'Search', route: '/search' },
  { icon: '💬', label: 'History', route: '/history' },
];

/** App shell rail (Search / History views) — includes New Chat. */
export const APP_SHELL_RAIL_ITEMS: AppShellRailItem[] = [
  { icon: '🔍', label: 'Search', route: '/search' },
  { icon: '+', label: 'New Chat', action: 'new-chat' },
  { icon: '💬', label: 'History', route: '/history' },
];

export const RECOMMENDED_PROJECTS: LandingProjectCard[] = [
  {
    id: 1,
    name: 'Luxton By Saheel',
    price: '₹95 L onwards',
    specs: '2–4 BHK · Wakad · Under Construction',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    badge: 'Recommended for your budget',
    badgeTone: 'green',
  },
  {
    id: 2,
    name: 'Rajveer Garima',
    price: '₹85 L – 2.8 Cr',
    specs: '2–4 BHK · Baner · Under Construction',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    badge: 'Recommended for Baner',
    badgeTone: 'orange',
  },
];

export const AFFORDABLE_PROJECTS: LandingProjectCard[] = [
  {
    id: 3,
    name: 'Skyline Heights',
    price: '₹72 L onwards',
    specs: '2 BHK · Kharadi',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
    badge: 'Within budget',
    badgeTone: 'orange',
  },
  {
    id: 4,
    name: 'Green Valley',
    price: '₹68 L onwards',
    specs: '2 BHK · Hinjewadi',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdfa?w=600&q=80',
    badge: 'Within budget',
    badgeTone: 'orange',
  },
  {
    id: 5,
    name: 'Urban Crest',
    price: '₹81 L onwards',
    specs: '3 BHK · Wakad',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80',
    badge: 'Within budget',
    badgeTone: 'orange',
  },
];

export const SERVICE_CARDS: LandingServiceCard[] = [
  {
    title: 'Search with AI',
    description: 'Ask Rahaa in natural language — locality, BHK, budget, builder, and RERA details in one conversation.',
    cta: 'Start searching',
    route: '/search',
    emoji: '🤖',
  },
  {
    title: 'Market Insights',
    description: 'Explore Pune price trends, absorption rates, and neighborhood comparisons before you decide.',
    cta: 'View market data',
    route: '/market',
    emoji: '📊',
  },
  {
    title: 'RERA Compliance',
    description: 'Understand MahaRERA rules, buyer rights, and compliance for Maharashtra projects.',
    cta: 'Browse guides',
    route: '/rera',
    emoji: '📋',
  },
];

export const BUDGET_CHAT_QUERY = 'Show me 2 BHK projects in Pune under 1 Cr that I can afford';
