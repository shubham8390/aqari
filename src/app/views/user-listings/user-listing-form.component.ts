import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListingService } from '../../core/services/user-listing.service';
import { UserListingCreate } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';

@Component({
  selector: 'app-user-listing-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './user-listing-form.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class UserListingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  userListingService = inject(UserListingService);

  isEdit = false;
  listingId = 0;
  loading = false;
  error = '';
  imageIds: number[] = [];

  form: UserListingCreate = {
    property_name: '',
    property_type: 'Apartment',
    bhk: '2',
    price: '',
    price_value: undefined,
    address: '',
    city: 'Pune',
    status: 'Ready to Move',
    description: '',
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit = true;
      this.listingId = Number(idParam);
      this.userListingService.get(this.listingId).subscribe({
        next: (l) => {
          this.form = {
            property_name: l.property_name,
            property_type: l.property_type,
            bhk: l.bhk,
            price: l.price,
            price_value: l.price_value ?? undefined,
            address: l.address,
            city: l.city,
            status: l.status,
            description: l.description,
          };
          this.imageIds = l.images?.map(i => i.id) ?? [];
        },
      });
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    const payload = { ...this.form, image_ids: this.imageIds };
    const req = this.isEdit
      ? this.userListingService.update(this.listingId, payload)
      : this.userListingService.create(payload);

    req.subscribe({
      next: (l) => {
        this.userListingService.cacheUserListing(l);
        this.loading = false;
        this.router.navigate(['/user-listings', l.id]);
      },
      error: () => {
        this.loading = false;
        this.error = 'Save failed.';
      },
    });
  }
}
