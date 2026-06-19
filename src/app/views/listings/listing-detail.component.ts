import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { ImageService } from '../../core/services/image.service';
import { ListingRead } from '../../core/models/property-api.model';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-detail.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class ListingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  listingService = inject(ListingService);
  imageService = inject(ImageService);

  listing = signal<ListingRead | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.get(id).subscribe({
      next: (l) => { this.listing.set(l); this.loading.set(false); },
      error: () => { this.error.set('Listing not found.'); this.loading.set(false); },
    });
  }

  imageUrl(filename: string): string {
    return this.imageService.getImageUrl(filename);
  }

  edit(): void {
    const l = this.listing();
    if (l) this.router.navigate(['/listings', l.id, 'edit']);
  }
}
