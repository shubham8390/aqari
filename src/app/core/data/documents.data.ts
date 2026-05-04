import { DocumentItem, EjariStep } from '../models/market.model';

export const PERSONAL_DOCS: DocumentItem[] = [
  { icon: '🪪', name: 'Emirates ID',       description: 'Front & back copy required',   status: 'done'     },
  { icon: '🛂', name: 'Passport Copy',      description: 'Must be valid (6+ months)',    status: 'done'     },
  { icon: '📄', name: 'UAE Residence Visa', description: 'Copy of valid visa page',      status: 'done'     },
  { icon: '🏦', name: 'Security Deposit',   description: '5% of annual rent · AED 5,750', status: 'pending' },
];

export const PROPERTY_DOCS: DocumentItem[] = [
  { icon: '📝', name: 'Tenancy Contract (RERA)', description: 'Standard form — agent provides', status: 'pending'  },
  { icon: '🏠', name: 'Title Deed Copy',         description: 'Provided by landlord',          status: 'required' },
  { icon: '💡', name: 'DEWA Connection',         description: 'Required for Ejari registration', status: 'pending' },
  { icon: '🏛️', name: 'Ejari Certificate',       description: 'AED 220 · Mandatory by law',    status: 'pending'  },
];

export const EJARI_STEPS: EjariStep[] = [
  {
    stepNum: '✓',
    title: 'Sign the Tenancy Contract',
    description: 'Both parties sign the RERA-standard tenancy contract. Make sure rent, duration, and cheque count are clearly stated.',
    state: 'done',
  },
  {
    stepNum: '✓',
    title: 'Collect All Documents',
    description: 'Tenancy contract, Emirates ID (both parties), landlord\'s title deed, and DEWA account number or connection proof.',
    state: 'done',
  },
  {
    stepNum: '●',
    title: 'Register via Ejari App or Typing Center',
    description: 'Use the official Ejari app (iOS/Android), the DLD website, or visit any authorised typing center in Dubai. Online is fastest.',
    state: 'active',
  },
  {
    stepNum: '4',
    title: 'Pay the Registration Fee',
    description: 'AED 220 registration + AED 10 knowledge fee + AED 10 innovation fee. Total ≈ AED 240. Payable online or at the center.',
    state: 'todo',
  },
  {
    stepNum: '5',
    title: 'Receive Your Ejari Certificate',
    description: 'Certificate issued instantly. Valid for the full lease duration. Required for DEWA, government services, and school registrations.',
    state: 'todo',
  },
];

export const RIGHT_PANEL_DOCS = [
  { icon: '🪪', name: 'Emirates ID',       status: 'done',    route: 'docs' },
  { icon: '🛂', name: 'Passport Copy',     status: 'done',    route: 'docs' },
  { icon: '📄', name: 'Visa Copy',         status: 'done',    route: 'docs' },
  { icon: '🏦', name: 'Security Deposit',  status: 'pending', route: 'docs' },
  { icon: '📝', name: 'Tenancy Contract',  status: 'pending', route: 'docs' },
  { icon: '🏛️', name: 'Ejari Registration', status: 'pending', route: 'docs' },
];
