import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { ListingService } from '../../core/services/listing.service';
import { ProjectService } from '../../core/services/project.service';
import { UserListingService } from '../../core/services/user-listing.service';
import { PropertySyncService } from '../../core/services/property-sync.service';
import { DeleteConfirmService } from '../../shared/delete-confirm/delete-confirm.service';

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
  private propertySync = inject(PropertySyncService);
  private deleteConfirm = inject(DeleteConfirmService);
  router = inject(Router);

  activeTab = signal<'projects' | 'listings' | 'user-listings'>('listings');
  loading = signal(false);
  loadError = signal('');

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) return;

    const user = this.auth.user();
    if (!user) return;

    if (this.auth.isBuilder()) {
      this.activeTab.set('projects');
    } else {
      this.activeTab.set('user-listings');
    }

    this.loading.set(true);
    this.loadError.set('');
    this.propertySync.refreshForUser(user).subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.loadError.set('Could not load your properties. Please try again.');
      },
    });
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

  deleteProject(id: number, name: string, event: Event): void {
    event.stopPropagation();
    this.deleteConfirm.open({ type: 'project', id, name });
  }

  deleteListing(id: number, name: string, event: Event): void {
    event.stopPropagation();
    this.deleteConfirm.open({ type: 'listing', id, name });
  }

  deleteUserListing(id: number, name: string, event: Event): void {
    event.stopPropagation();
    this.deleteConfirm.open({ type: 'user-listing', id, name });
  }
}
