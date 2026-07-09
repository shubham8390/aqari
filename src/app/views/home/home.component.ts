import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { AuthService } from '../../core/services/auth.service';
import { LoginButtonComponent } from '../../layout/auth/login-button.component';
import { ProfileSetupService } from '../../layout/auth/profile-setup.service';
import { APP_LOGO_SRC, APP_RAIL_LOGO_SRC } from '../../core/constants/brand.constants';
import {
  AFFORDABLE_PROJECTS,
  BUDGET_CHAT_QUERY,
  HERO_HEADLINE,
  HERO_IMAGE,
  LANDING_FOOTER_LINKS,
  LANDING_RAIL_ITEMS,
  RECOMMENDED_PROJECTS,
  SEARCH_PLACEHOLDER,
  SERVICE_CARDS,
} from '../../core/data/home.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginButtonComponent],
  templateUrl: './home.component.html',
  host: { class: 'landing-root' },
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authModal = inject(AuthModalService);
  private readonly profileSetup = inject(ProfileSetupService);
  auth = inject(AuthService);

  ngOnInit(): void {
    document.documentElement.classList.add('landing-active');
    document.body.classList.add('landing-active');
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('landing-active');
    document.body.classList.remove('landing-active');
  }

  readonly logoSrc = APP_LOGO_SRC;
  readonly railLogoSrc = APP_RAIL_LOGO_SRC;
  readonly heroHeadline = HERO_HEADLINE;
  readonly heroImage = HERO_IMAGE;
  readonly searchPlaceholder = SEARCH_PLACEHOLDER;
  readonly footerLinks = LANDING_FOOTER_LINKS;
  readonly railItems = LANDING_RAIL_ITEMS;
  readonly recommendedProjects = RECOMMENDED_PROJECTS;
  readonly affordableProjects = AFFORDABLE_PROJECTS;
  readonly serviceCards = SERVICE_CARDS;

  searchQuery = '';

  goHome(): void {
    this.router.navigate(['/']);
  }

  goTo(route: string, query?: string): void {
    if (query) {
      void this.router.navigate([route], { queryParams: { q: query } });
      return;
    }
    void this.router.navigate([route]);
  }

  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (q) {
      void this.router.navigate(['/search'], { queryParams: { q } });
      return;
    }
    void this.router.navigate(['/search']);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearchSubmit();
    }
  }

  openSignIn(): void {
    this.authModal.open('signin', '/');
  }

  onUserClick(): void {
    if (this.auth.isAuthenticated()) {
      this.profileSetup.open();
    } else {
      this.authModal.open('signin', '/');
    }
  }

  userInitials(): string {
    return this.auth.displayName().slice(0, 2).toUpperCase();
  }

  startBudgetSearch(): void {
    void this.router.navigate(['/search'], { queryParams: { q: BUDGET_CHAT_QUERY } });
  }

  scrollToContent(): void {
    document.getElementById('landing-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  readonly currentYear = new Date().getFullYear();
}
