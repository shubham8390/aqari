import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { PropertySearchComponent } from './views/property-search/property-search.component';
import { MarketInsightsComponent } from './views/market-insights/market-insights.component';
import { NegotiationGuideComponent } from './views/negotiation-guide/negotiation-guide.component';
import { DocumentsEjariComponent } from './views/documents-ejari/documents-ejari.component';
import { ReraComplianceComponent } from './views/rera-compliance/rera-compliance.component';
import { PastSessionsComponent } from './views/past-sessions/past-sessions.component';
import { AuthPageComponent } from './layout/auth/auth-page.component';
import { AuthLoadingComponent } from './layout/auth/auth-loading.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: AuthPageComponent, data: { mode: 'signin' } },
  { path: 'signup', component: AuthPageComponent, data: { mode: 'signup' } },
  { path: 'loading', component: AuthLoadingComponent },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: 'search',    component: PropertySearchComponent   },
      { path: 'market',    component: MarketInsightsComponent   },
      { path: 'negotiate', component: NegotiationGuideComponent },
      { path: 'docs',      component: DocumentsEjariComponent   },
      { path: 'rera',      component: ReraComplianceComponent   },
      { path: 'history',   component: PastSessionsComponent     },
    ],
  },
  { path: '**', redirectTo: '' },
];
