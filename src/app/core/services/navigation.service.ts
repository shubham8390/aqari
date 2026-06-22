import { Injectable, signal, computed } from '@angular/core';

export type ViewKey = 'search' | 'market' | 'negotiate' | 'docs' | 'rera' | 'history' | 'properties';

export interface ViewMeta {
  title: string;
  subtitle: string;
}

const VIEW_META: Record<ViewKey, ViewMeta> = {
  search:     { title: 'Property Search',   subtitle: 'AI-powered property matching across Pune listings' },
  properties: { title: 'My Properties',     subtitle: 'Manage your projects, listings, and posted properties' },
  market:     { title: 'Market Insights',   subtitle: 'Pune property market overview · Sample data'       },
  negotiate:  { title: 'Negotiation Guide', subtitle: 'AI strategies backed by RERA transaction data'     },
  docs:       { title: 'Documents & Ejari', subtitle: 'Complete checklist — RERA compliant'               },
  rera:       { title: 'RERA Compliance',   subtitle: 'Know your rights as a buyer'                       },
  history:    { title: 'Past Sessions',     subtitle: 'Your previous conversations with Rahaa'          },
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
  activeView = signal<ViewKey>('search');

  meta = computed<ViewMeta>(() => VIEW_META[this.activeView()]);

  navigate(view: ViewKey): void {
    this.activeView.set(view);
  }
}
