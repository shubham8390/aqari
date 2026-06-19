import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { ListingService } from '../../core/services/listing.service';
import { ProjectService } from '../../core/services/project.service';
import { UserListingService } from '../../core/services/user-listing.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './properties.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class PropertiesComponent implements OnInit {
  auth = inject(AuthService);
  authModal = inject(AuthModalService);
  listingService = inject(ListingService);
  projectService = inject(ProjectService);
  userListingService = inject(UserListingService);
  router = inject(Router);

  activeTab = signal<'projects' | 'listings' | 'user-listings'>('listings');

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) return;
    if (this.auth.isBuilder()) {
      this.activeTab.set('projects');
    } else {
      this.activeTab.set('user-listings');
    }
  }

  openLogin(): void {
    this.authModal.open('signin');
  }

  setTab(tab: 'projects' | 'listings' | 'user-listings'): void {
    this.activeTab.set(tab);
  }

  goNewProject(): void { this.router.navigate(['/projects/new']); }
  goNewListing(): void { this.router.navigate(['/listings/new']); }
  goNewUserListing(): void { this.router.navigate(['/user-listings/new']); }

  openProject(id: number): void { this.router.navigate(['/projects', id]); }
  openListing(id: number): void { this.router.navigate(['/listings', id]); }
  openUserListing(id: number): void { this.router.navigate(['/user-listings', id]); }

  deleteProject(id: number, event: Event): void {
    event.stopPropagation();
    this.projectService.delete(id).subscribe({ next: () => this.projectService.removeCachedProject(id) });
  }

  deleteListing(id: number, event: Event): void {
    event.stopPropagation();
    this.listingService.delete(id).subscribe({ next: () => this.listingService.removeCachedListing(id) });
  }

  deleteUserListing(id: number, event: Event): void {
    event.stopPropagation();
    this.userListingService.delete(id).subscribe({ next: () => this.userListingService.removeCachedUserListing(id) });
  }
}
