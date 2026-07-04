import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SidebarComponent }    from './layout/sidebar/sidebar.component';
import { TopbarComponent }     from './layout/topbar/topbar.component';
import { RightPanelComponent } from './layout/right-panel/right-panel.component';
import { AuthModalComponent } from './layout/auth/auth-modal.component';
import { AuthModalService } from './layout/auth/auth-modal.service';
import { AuthService } from './core/services/auth.service';
import { LogoutConfirmComponent } from './layout/auth/logout-confirm.component';
import { ProfileSetupModalComponent } from './layout/auth/profile-setup-modal.component';
import { NavigationService, ViewKey } from './core/services/navigation.service';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, RightPanelComponent, AuthModalComponent, ProfileSetupModalComponent, LogoutConfirmComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  nav    = inject(NavigationService);
  router = inject(Router);
  layout = inject(LayoutService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.authModal.open('signin');
    }

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const segment = e.urlAfterRedirects.replace(/^#\/?/, '').split('?')[0].split('/')[0];
        const view = segment as ViewKey;
        const valid: ViewKey[] = ['search', 'market', 'negotiate', 'docs', 'rera', 'history'];
        if (valid.includes(view)) {
          this.nav.activeView.set(view);
        }
      });
  }
}
