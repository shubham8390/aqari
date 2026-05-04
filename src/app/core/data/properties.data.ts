import { Property, NegotiationAnalysis } from '../models/property.model';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Marina Gate II — Tower A, Floor 18',
    size: '1,180',
    beds: 2,
    baths: 2,
    builtYear: 2021,
    price: 115000,
    priceLabel: 'AED 115K',
    period: 'per year',
    matchScore: 96,
    emoji: '🏙️',
    tags: [
      { label: 'Sea view',       type: 'teal'    },
      { label: 'Fully furnished', type: 'gold'    },
      { label: 'Pool · Gym',     type: 'default' },
    ],
  },
  {
    id: '2',
    name: 'Cayan Tower — Mid-rise, Floor 24',
    size: '1,090',
    beds: 2,
    baths: 2,
    builtYear: 2020,
    price: 118000,
    priceLabel: 'AED 118K',
    period: 'per year',
    matchScore: 91,
    emoji: '🌆',
    tags: [
      { label: 'Marina view', type: 'teal'    },
      { label: 'Furnished',   type: 'gold'    },
      { label: 'Concierge',   type: 'default' },
    ],
  },
  {
    id: '3',
    name: 'Silverene Tower B — Floor 12',
    size: '1,240',
    beds: 2,
    baths: 2,
    builtYear: 2019,
    price: 122000,
    priceLabel: 'AED 122K',
    period: 'per year',
    matchScore: 88,
    emoji: '🌊',
    tags: [
      { label: 'Pool view',   type: 'amber'   },
      { label: 'Furnished',   type: 'gold'    },
      { label: 'Walk to JBR', type: 'default' },
    ],
  },
];

export const NEGOTIATION_DATA: NegotiationAnalysis = {
  propertyName: 'Marina Gate II',
  askingPrice: 115000,
  marketAvg: 109500,
  marketAvgNote: 'Last 90 days · 2BHK furnished · Marina',
  targetMin: 108000,
  targetMax: 112000,
  potentialSaving: 7000,
  chips: [
    { label: '⏱ Listed 47 days', type: 'warn'    },
    { label: '↓ 5–7% room',      type: 'teal'    },
    { label: 'Offer 2 cheques',  type: 'default' },
    { label: 'Fast move-in ready', type: 'default' },
  ],
};
