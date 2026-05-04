import { Injectable, signal, computed } from '@angular/core';

export type ViewKey = 'search' | 'market' | 'negotiate' | 'docs' | 'rera' | 'history';

export interface ViewMeta {
  title: string;
  subtitle: string;
}

const VIEW_META: Record<ViewKey, ViewMeta> = {
  search:    { title: 'Property Search',   subtitle: 'AI-powered matching across 2,400+ Dubai listings'  },
  market:    { title: 'Market Insights',   subtitle: 'Live Dubai rental & sales data · Updated daily'    },
  negotiate: { title: 'Negotiation Guide', subtitle: 'AI strategies backed by RERA transaction data'     },
  docs:      { title: 'Documents & Ejari', subtitle: 'Complete checklist — RERA compliant'               },
  rera:      { title: 'RERA Compliance',   subtitle: 'Know your rights as a tenant in Dubai'             },
  history:   { title: 'Past Sessions',     subtitle: 'Your previous conversations with Agent Zayed'      },
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
  activeView = signal<ViewKey>('search');

  meta = computed<ViewMeta>(() => VIEW_META[this.activeView()]);

  navigate(view: ViewKey): void {
    this.activeView.set(view);
  }
}
