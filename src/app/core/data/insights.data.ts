import { ReraCard, ReraRule } from '../models/market.model';

export const AGENT_INSIGHTS = [
  {
    icon: '🔥',
    text: 'High demand floors 10–22 with sea view — act fast on shortlisted unit',
    route: 'search',
  },
  {
    icon: '💡',
    text: '2-cheque offer is your strongest lever — saves AED 5K–8K typically',
    route: 'negotiate',
  },
  {
    icon: '📅',
    text: 'Best deals in Q1 & Q3 — landlords most flexible outside peak season',
    route: 'market',
  },
];

export const RERA_CARDS: ReraCard[] = [
  {
    icon: '🔒',
    title: 'Rent Increase Limits',
    text: "RERA's Rental Index caps annual rent increases. Any increase above the index requires 90 days written notice. Illegal increases can be disputed at RERA's dispute center.",
  },
  {
    icon: '📜',
    title: 'Eviction Rules',
    text: 'Landlords must give 12 months written notice to evict for personal use. Notice must be sent via notary public. Without proper notice, the eviction is invalid under UAE law.',
  },
  {
    icon: '🛠️',
    title: 'Maintenance Rights',
    text: "Major structural repairs are the landlord's responsibility. Minor maintenance (below AED 500) is typically the tenant's responsibility unless agreed otherwise in the contract.",
  },
  {
    icon: '💰',
    title: 'Security Deposit',
    text: 'Maximum 5% of annual rent for unfurnished, 10% for furnished. Must be returned within 30 days of lease end, minus any agreed deductions documented in writing.',
  },
];

export const RERA_RULES: ReraRule[] = [
  {
    title: 'Ejari is mandatory for all tenancies',
    description: 'Unregistered leases are not legally enforceable in Dubai courts.',
  },
  {
    title: 'Rent index check before renewing',
    description: "Landlord must use RERA's Rent Index Calculator at dubailand.gov.ae to justify any increase.",
  },
  {
    title: '90-day notice for any rent change',
    description: 'Any rent increase or non-renewal must be communicated 90 days before contract expiry.',
  },
  {
    title: 'Dispute resolution via RDC',
    description: 'The Rental Dispute Centre (RDC) handles all landlord-tenant disputes. Filing fee is 3.5% of annual rent (min AED 500).',
  },
  {
    title: 'Broker must have RERA license',
    description: "Always verify your agent's RERA number at dubailand.gov.ae before signing anything.",
  },
];
