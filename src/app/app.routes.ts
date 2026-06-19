import { Routes } from '@angular/router';
import { PropertySearchComponent } from './views/property-search/property-search.component';
import { MarketInsightsComponent } from './views/market-insights/market-insights.component';
import { NegotiationGuideComponent } from './views/negotiation-guide/negotiation-guide.component';
import { DocumentsEjariComponent } from './views/documents-ejari/documents-ejari.component';
import { ReraComplianceComponent } from './views/rera-compliance/rera-compliance.component';
import { PastSessionsComponent } from './views/past-sessions/past-sessions.component';
import { PropertiesComponent } from './views/properties/properties.component';
import { ListingDetailComponent } from './views/listings/listing-detail.component';
import { ListingFormComponent } from './views/listings/listing-form.component';
import { ProjectDetailComponent } from './views/projects/project-detail.component';
import { ProjectFormComponent } from './views/projects/project-form.component';
import { UserListingDetailComponent } from './views/user-listings/user-listing-detail.component';
import { UserListingFormComponent } from './views/user-listings/user-listing-form.component';

export const routes: Routes = [
  { path: '',          redirectTo: 'search', pathMatch: 'full' },
  { path: 'search',    component: PropertySearchComponent   },
  { path: 'properties', component: PropertiesComponent      },
  { path: 'listings/new', component: ListingFormComponent   },
  { path: 'listings/:id/edit', component: ListingFormComponent },
  { path: 'listings/:id', component: ListingDetailComponent },
  { path: 'projects/new', component: ProjectFormComponent   },
  { path: 'projects/:id/edit', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'user-listings/new', component: UserListingFormComponent },
  { path: 'user-listings/:id/edit', component: UserListingFormComponent },
  { path: 'user-listings/:id', component: UserListingDetailComponent },
  { path: 'market',    component: MarketInsightsComponent   },
  { path: 'negotiate', component: NegotiationGuideComponent },
  { path: 'docs',      component: DocumentsEjariComponent   },
  { path: 'rera',      component: ReraComplianceComponent   },
  { path: 'history',   component: PastSessionsComponent     },
  { path: '**',        redirectTo: 'search'                  },
];
