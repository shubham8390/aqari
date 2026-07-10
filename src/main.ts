import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Backend Google OAuth redirects to FRONTEND_URL/loading?nonce=...
 * App uses hash routing, so rewrite path-based /loading into /#/loading?...
 */
(() => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const search = window.location.search;
  if ((path === '/loading' || path.endsWith('/loading')) && search.includes('nonce=')) {
    window.location.replace(`${window.location.origin}/#/loading${search}`);
  }
})();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
