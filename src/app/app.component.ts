import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SidebarComponent }    from './layout/sidebar/sidebar.component';
import { TopbarComponent }     from './layout/topbar/topbar.component';
import { RightPanelComponent } from './layout/right-panel/right-panel.component';
import { AuthModalComponent } from './layout/auth/auth-modal.component';
import { NavigationService, ViewKey } from './core/services/navigation.service';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, RightPanelComponent, AuthModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  nav    = inject(NavigationService);
  router = inject(Router);
  layout = inject(LayoutService);

  ngOnInit(): void {
    // Keep NavigationService in sync with the router URL
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const segment = e.urlAfterRedirects.replace(/^#?\//, '').split('?')[0] as ViewKey;
        const valid: ViewKey[] = ['search', 'market', 'negotiate', 'docs', 'rera', 'history'];
        if (valid.includes(segment)) {
          this.nav.activeView.set(segment);
        }
      });
  }
}
