import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListingService } from '../../core/services/user-listing.service';
import { UserListingCreate } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import {
  BHK_OPTIONS,
  inputBorder,
  isNonNegativeNumber,
  PROPERTY_TYPES,
  trim,
  USER_LISTING_STATUSES,
} from '../../core/constants/property-form.constants';

type UserListingField =
  | 'property_name'
  | 'property_type'
  | 'bhk'
  | 'price'
  | 'price_value'
  | 'address'
  | 'city'
  | 'status';

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

  readonly propertyTypes = PROPERTY_TYPES;
  readonly bhkOptions = BHK_OPTIONS;
  readonly statusOptions = USER_LISTING_STATUSES;
  readonly inputBorder = inputBorder;

  isEdit = false;
  listingId = 0;
  loading = false;
  error = '';
  submitted = false;
  imageIds: number[] = [];

  fieldErrors: Record<UserListingField, string> = this.emptyFieldErrors();

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

  onFieldChange(field: UserListingField): void {
    if (this.submitted) this.validateForm();
    else this.fieldErrors[field] = '';
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (!this.validateForm()) return;

    this.loading = true;
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

  private validateForm(): boolean {
    this.fieldErrors = this.emptyFieldErrors();
    let valid = true;

    const name = trim(this.form.property_name);
    if (!name) {
      this.fieldErrors.property_name = 'Property name is required.';
      valid = false;
    } else if (name.length < 3) {
      this.fieldErrors.property_name = 'Property name must be at least 3 characters.';
      valid = false;
    }

    if (!trim(this.form.property_type)) {
      this.fieldErrors.property_type = 'Property type is required.';
      valid = false;
    } else if (!PROPERTY_TYPES.includes(this.form.property_type as typeof PROPERTY_TYPES[number])) {
      this.fieldErrors.property_type = 'Select a valid property type.';
      valid = false;
    }

    if (this.form.bhk && !BHK_OPTIONS.includes(this.form.bhk as typeof BHK_OPTIONS[number])) {
      this.fieldErrors.bhk = 'Select a valid BHK configuration.';
      valid = false;
    }

    const price = trim(this.form.price);
    const hasPriceValue = this.form.price_value != null && this.form.price_value !== undefined;
    if (!price && !hasPriceValue) {
      this.fieldErrors.price = 'Enter a display price or numeric price value.';
      valid = false;
    }

    if (hasPriceValue && !isNonNegativeNumber(this.form.price_value)) {
      this.fieldErrors.price_value = 'Price value must be zero or greater.';
      valid = false;
    }

    if (!trim(this.form.city)) {
      this.fieldErrors.city = 'City is required.';
      valid = false;
    }

    if (!trim(this.form.address)) {
      this.fieldErrors.address = 'Address is required.';
      valid = false;
    }

    if (this.form.status && !USER_LISTING_STATUSES.includes(this.form.status as typeof USER_LISTING_STATUSES[number])) {
      this.fieldErrors.status = 'Select a valid status.';
      valid = false;
    }

    return valid;
  }

  private emptyFieldErrors(): Record<UserListingField, string> {
    return {
      property_name: '',
      property_type: '',
      bhk: '',
      price: '',
      price_value: '',
      address: '',
      city: '',
      status: '',
    };
  }
}
