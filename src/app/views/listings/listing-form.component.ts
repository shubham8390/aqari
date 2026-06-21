import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListingService } from '../../core/services/listing.service';
import { ProjectService } from '../../core/services/project.service';
import { ListingCreate, ProjectRead } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { AuthService } from '../../core/services/auth.service';
import {
  BHK_OPTIONS,
  BUILDER_LISTING_STATUSES,
  inputBorder,
  isNonNegativeNumber,
  isPositiveInt,
  omitEmptyFields,
  PROPERTY_TYPES,
  trim,
} from '../../core/constants/property-form.constants';

type ListingField =
  | 'property_name'
  | 'property_type'
  | 'bhk'
  | 'price'
  | 'price_value'
  | 'project_id'
  | 'carpet_area'
  | 'builtup_area'
  | 'status';

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
  projectService = inject(ProjectService);
  auth = inject(AuthService);

  readonly propertyTypes = PROPERTY_TYPES;
  readonly bhkOptions = BHK_OPTIONS;
  readonly statusOptions = BUILDER_LISTING_STATUSES;
  readonly inputBorder = inputBorder;

  isEdit = false;
  listingId = 0;
  loading = false;
  error = '';
  submitted = false;
  imageIds: number[] = [];

  fieldErrors: Record<ListingField, string> = this.emptyFieldErrors();

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
    const userId = this.auth.user()?.id;

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
      if (userId) {
        this.projectService.refreshForBuilder(userId).subscribe();
      }
    } else if (userId) {
      this.projectService.refreshForBuilder(userId).subscribe({
        next: () => this.autoSelectProject(),
      });
    }
  }

  private autoSelectProject(): void {
    const projects = this.availableProjects;
    if (projects.length === 1) {
      this.form.project_id = projects[0].id;
    }
  }

  get availableProjects(): ProjectRead[] {
    return this.projectService.getCachedProjects();
  }

  get selectedProject(): ProjectRead | undefined {
    return this.availableProjects.find(p => p.id === this.form.project_id);
  }

  onFieldChange(field: ListingField): void {
    if (this.submitted) this.validateForm();
    else this.fieldErrors[field] = '';
  }

  onSubmit(): void {
    if (!this.auth.isBuilder()) {
      this.error = 'Only builder accounts can manage listings.';
      return;
    }

    this.submitted = true;
    this.error = '';
    if (!this.validateForm()) return;

    this.loading = true;
    const payload = this.buildPayload();
    const req = this.isEdit
      ? this.listingService.update(this.listingId, payload)
      : this.listingService.create(payload);

    req.subscribe({
      next: (l) => {
        this.listingService.cacheListing(l);
        this.loading = false;
        this.router.navigate(['/listings', l.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = this.formatSaveError(err);
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

    if (!this.isEdit && !isPositiveInt(this.form.project_id)) {
      this.fieldErrors.project_id = this.availableProjects.length
        ? 'Select a project for this listing.'
        : 'Create a project first before adding a listing.';
      valid = false;
    } else if (
      !this.isEdit
      && this.form.project_id != null
      && !this.availableProjects.some(p => p.id === this.form.project_id)
    ) {
      this.fieldErrors.project_id = 'Select one of your own projects.';
      valid = false;
    } else if (this.form.project_id != null && !isPositiveInt(this.form.project_id)) {
      this.fieldErrors.project_id = 'Project ID must be a positive whole number.';
      valid = false;
    }

    if (this.form.bhk && !BHK_OPTIONS.includes(this.form.bhk as typeof BHK_OPTIONS[number])) {
      this.fieldErrors.bhk = 'Select a valid BHK configuration.';
      valid = false;
    }

    if (this.form.price_value != null && !isNonNegativeNumber(this.form.price_value)) {
      this.fieldErrors.price_value = 'Price value must be zero or greater.';
      valid = false;
    }

    const carpet = trim(this.form.carpet_area);
    if (carpet && !/^\d+(\.\d+)?$/.test(carpet)) {
      this.fieldErrors.carpet_area = 'Carpet area must be a valid number.';
      valid = false;
    }

    const builtup = trim(this.form.builtup_area);
    if (builtup && !/^\d+(\.\d+)?$/.test(builtup)) {
      this.fieldErrors.builtup_area = 'Built-up area must be a valid number.';
      valid = false;
    }

    if (this.form.status && !BUILDER_LISTING_STATUSES.includes(this.form.status as typeof BUILDER_LISTING_STATUSES[number])) {
      this.fieldErrors.status = 'Select a valid status.';
      valid = false;
    }

    return valid;
  }

  private formatSaveError(err: HttpErrorResponse): string {
    if (err.status === 403) return 'Not authorized to create listings.';
    if (err.status === 422 && Array.isArray(err.error?.detail)) {
      return err.error.detail.map((d: { msg: string }) => d.msg).join(' ');
    }
    if (err.status === 500) {
      return 'The server failed to create this listing (HTTP 500). Builder listing creation is currently broken on the backend — please ask your backend team to fix POST /listings.';
    }
    return 'Save failed.';
  }

  private buildPayload(): ListingCreate & { image_ids?: number[] } {
    const project = this.selectedProject;
    return omitEmptyFields({
      ...this.form,
      property_name: trim(this.form.property_name),
      locality_name: trim(project?.locality) || trim(project?.city) || undefined,
      image_ids: this.imageIds.length ? this.imageIds : undefined,
    }) as ListingCreate & { image_ids?: number[] };
  }

  private emptyFieldErrors(): Record<ListingField, string> {
    return {
      property_name: '',
      property_type: '',
      bhk: '',
      price: '',
      price_value: '',
      project_id: '',
      carpet_area: '',
      builtup_area: '',
      status: '',
    };
  }
}
