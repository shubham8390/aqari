import { Routes } from '@angular/router';
import { PropertySearchComponent } from './views/property-search/property-search.component';
import { MarketInsightsComponent } from './views/market-insights/market-insights.component';
import { NegotiationGuideComponent } from './views/negotiation-guide/negotiation-guide.component';
import { DocumentsEjariComponent } from './views/documents-ejari/documents-ejari.component';
import { ReraComplianceComponent } from './views/rera-compliance/rera-compliance.component';
import { PastSessionsComponent } from './views/past-sessions/past-sessions.component';

export const routes: Routes = [
  { path: '',          redirectTo: 'search', pathMatch: 'full' },
  { path: 'search',    component: PropertySearchComponent   },
  { path: 'market',    component: MarketInsightsComponent   },
  { path: 'negotiate', component: NegotiationGuideComponent },
  { path: 'docs',      component: DocumentsEjariComponent   },
  { path: 'rera',      component: ReraComplianceComponent   },
  { path: 'history',   component: PastSessionsComponent     },
  { path: '**',        redirectTo: 'search'                  },
];
