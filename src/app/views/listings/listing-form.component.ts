import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { ListingCreate } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-listing-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './listing-form.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class ListingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  listingService = inject(ListingService);
  auth = inject(AuthService);

  isEdit = false;
  listingId = 0;
  loading = false;
  error = '';
  imageIds: number[] = [];

  form: ListingCreate = {
    property_name: '',
    property_type: 'Apartment',
    bhk: '2',
    price: '',
    price_value: undefined,
    carpet_area: '',
    builtup_area: '',
    status: 'Ready to Move',
    description: '',
    project_id: undefined,
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit = true;
      this.listingId = Number(idParam);
      this.listingService.get(this.listingId).subscribe({
        next: (l) => {
          this.form = {
            property_name: l.property_name,
            property_type: l.property_type,
            bhk: l.bhk,
            price: l.price,
            price_value: l.price_value ?? undefined,
            carpet_area: l.carpet_area,
            builtup_area: l.builtup_area,
            status: l.status,
            description: l.description,
            project_id: l.project_id ?? undefined,
          };
          this.imageIds = l.images?.map(i => i.id) ?? [];
        },
      });
    }
  }

  onSubmit(): void {
    if (!this.auth.isBuilder()) {
      this.error = 'Only builder accounts can manage listings.';
      return;
    }
    this.loading = true;
    this.error = '';
    const payload = { ...this.form, image_ids: this.imageIds };
    const req = this.isEdit
      ? this.listingService.update(this.listingId, payload)
      : this.listingService.create(payload);

    req.subscribe({
      next: (l) => {
        this.listingService.cacheListing(l);
        this.loading = false;
        this.router.navigate(['/listings', l.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.status === 403 ? 'Not authorized to create listings.' : 'Save failed.';
      },
    });
  }
}
