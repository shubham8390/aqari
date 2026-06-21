import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmService } from './delete-confirm.service';
import { ListingService } from '../../core/services/listing.service';
import { ProjectService } from '../../core/services/project.service';
import { UserListingService } from '../../core/services/user-listing.service';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm.component.html',
})
export class DeleteConfirmComponent {
  confirm = inject(DeleteConfirmService);
  private projectService = inject(ProjectService);
  private listingService = inject(ListingService);
  private userListingService = inject(UserListingService);

  title = computed(() => {
    switch (this.confirm.target()?.type) {
      case 'project': return 'Delete project?';
      case 'listing': return 'Delete listing?';
      case 'user-listing': return 'Delete property?';
      default: return 'Delete item?';
    }
  });

  message = computed(() => {
    const name = this.confirm.target()?.name;
    if (!name) return 'This action cannot be undone.';
    return `"${name}" will be permanently deleted. This action cannot be undone.`;
  });

  close(): void {
    this.confirm.close();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['overlay'] === 'true') {
      this.close();
    }
  }

  confirmDelete(): void {
    const target = this.confirm.target();
    if (!target) return;

    switch (target.type) {
      case 'project':
        this.projectService.delete(target.id).subscribe({
          next: () => this.projectService.removeCachedProject(target.id),
        });
        break;
      case 'listing':
        this.listingService.delete(target.id).subscribe({
          next: () => this.listingService.removeCachedListing(target.id),
        });
        break;
      case 'user-listing':
        this.userListingService.delete(target.id).subscribe({
          next: () => this.userListingService.removeCachedUserListing(target.id),
        });
        break;
    }

    this.close();
  }
}
