import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService, ViewKey } from '../../core/services/navigation.service';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { MapMarkersService } from '../../core/services/map-markers.service';
import { AuthModalService } from '../auth/auth-modal.service';
import { ProfileSetupService } from '../auth/profile-setup.service';
import { APP_LOGO_SRC } from '../../core/constants/brand.constants';
import { APP_SHELL_RAIL_ITEMS, AppShellRailItem } from '../../core/data/home.data';

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
  private chat = inject(ChatService);
  private mapMarkers = inject(MapMarkersService);
  profileSetup = inject(ProfileSetupService);

  visibleRailItems(): AppShellRailItem[] {
    return APP_SHELL_RAIL_ITEMS;
  }

  railItemKey(item: AppShellRailItem): string {
    return item.action ?? item.route ?? item.label;
  }

  goHome(): void {
    void this.router.navigate(['/']);
    if (this.layout.isMobile()) {
      this.layout.closeSidebar();
    }
  }

  onRailClick(item: AppShellRailItem): void {
    if (item.action === 'new-chat') {
      this.startNewChat();
      return;
    }
    if (item.route) {
      this.goTo(item.route);
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

  startNewChat(): void {
    this.chat.startNewSession();
    this.mapMarkers.focus(null);
    this.nav.navigate('search');
    void this.router.navigate(['/search']);
    if (this.layout.isMobile()) {
      this.layout.closeSidebar();
    }
  }

  isRouteActive(item: AppShellRailItem): boolean {
    if (!item.route || item.action) return false;
    return this.router.url === item.route || this.router.url.startsWith(`${item.route}?`);
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
