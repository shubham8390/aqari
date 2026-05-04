export interface PropertyTag {
  label: string;
  type: 'teal' | 'gold' | 'amber' | 'default';
}

export interface Property {
  id: string;
  name: string;
  size: string;
  beds: number;
  baths: number;
  builtYear: number;
  price: number;
  priceLabel: string;
  period: string;
  matchScore: number;
  emoji: string;
  tags: PropertyTag[];
}

export interface NegotiationAnalysis {
  propertyName: string;
  askingPrice: number;
  marketAvg: number;
  marketAvgNote: string;
  targetMin: number;
  targetMax: number;
  potentialSaving: number;
  chips: { label: string; type: 'warn' | 'teal' | 'default' }[];
}
