import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { NavigationService, ViewKey } from '../../core/services/navigation.service';

import { LayoutService } from '../../core/services/layout.service';

import { AuthService } from '../../core/services/auth.service';

import { AuthModalService } from '../auth/auth-modal.service';

import { ProfileSetupService } from '../auth/profile-setup.service';

import { APP_LOGO_SRC } from '../../core/constants/brand.constants';

import { LANDING_RAIL_ITEMS, LandingRailItem } from '../../core/data/home.data';



@Component({

  selector: 'app-sidebar',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './sidebar.component.html',

  host: {

    style: 'display:flex;flex-shrink:0;height:100%;',

    '[class.sidebar-mobile-open]': 'layout.sidebarOpen()',

  },

})

export class SidebarComponent {

  readonly logoSrc = APP_LOGO_SRC;



  nav = inject(NavigationService);

  router = inject(Router);

  layout = inject(LayoutService);

  auth = inject(AuthService);

  private authModal = inject(AuthModalService);

  profileSetup = inject(ProfileSetupService);



  visibleRailItems(): LandingRailItem[] {
    return LANDING_RAIL_ITEMS;
  }



  goHome(): void {

    void this.router.navigate(['/']);

    if (this.layout.isMobile()) {

      this.layout.closeSidebar();

    }

  }



  goTo(route: string): void {

    const key = route.replace(/^\//, '') as ViewKey;

    this.nav.navigate(key);

    void this.router.navigate([route]);

    if (this.layout.isMobile()) {

      this.layout.closeSidebar();

    }

  }



  isRouteActive(route: string): boolean {

    return this.router.url === route || this.router.url.startsWith(`${route}?`);

  }



  onUserClick(): void {

    if (this.auth.isAuthenticated()) {

      this.profileSetup.open();

    } else {

      this.authModal.open('signin', this.router.url);

    }

  }



  userInitials(): string {

    return this.auth.displayName().slice(0, 2).toUpperCase();

  }

}

