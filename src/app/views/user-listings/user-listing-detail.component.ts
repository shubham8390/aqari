import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListingService } from '../../core/services/user-listing.service';
import { ImageService } from '../../core/services/image.service';
import { UserListingRead } from '../../core/models/property-api.model';

@Component({
  selector: 'app-user-listing-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-listing-detail.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class UserListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  userListingService = inject(UserListingService);
  imageService = inject(ImageService);

  listing = signal<UserListingRead | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userListingService.get(id).subscribe({
      next: (l) => { this.listing.set(l); this.loading.set(false); },
      error: () => { this.error.set('Property not found.'); this.loading.set(false); },
    });
  }

  imageUrl(filename: string): string {
    return this.imageService.getImageUrl(filename);
  }

  edit(): void {
    const l = this.listing();
    if (l) this.router.navigate(['/user-listings', l.id, 'edit']);
  }
}
