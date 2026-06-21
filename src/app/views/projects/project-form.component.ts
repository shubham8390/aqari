import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCreate } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { AuthService } from '../../core/services/auth.service';
import {
  inputBorder,
  isPositiveInt,
  PROJECT_STATUSES,
  trim,
} from '../../core/constants/property-form.constants';

type ProjectField =
  | 'project_name'
  | 'status'
  | 'address'
  | 'city'
  | 'locality'
  | 'total_towers'
  | 'total_floors'
  | 'total_units'
  | 'construction_progress';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  templateUrl: './project-form.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class ProjectFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  projectService = inject(ProjectService);
  auth = inject(AuthService);

  readonly statusOptions = PROJECT_STATUSES;
  readonly inputBorder = inputBorder;

  isEdit = false;
  projectId = 0;
  loading = false;
  error = '';
  submitted = false;
  imageIds: number[] = [];

  fieldErrors: Record<ProjectField, string> = this.emptyFieldErrors();

  form: ProjectCreate = {
    project_name: '',
    rera_number: '',
    status: 'Under Construction',
    address: '',
    city: 'Pune',
    locality: '',
    total_area: '',
    total_towers: '',
    total_floors: '',
    total_units: '',
    construction_progress: '',
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit = true;
      this.projectId = Number(idParam);
      this.projectService.get(this.projectId).subscribe({
        next: (p) => {
          this.form = {
            project_name: p.project_name,
            rera_number: p.rera_number,
            status: p.status,
            address: p.address,
            city: p.city,
            locality: p.locality,
            total_area: p.total_area,
            total_towers: p.total_towers,
            total_floors: p.total_floors,
            total_units: p.total_units,
            construction_progress: p.construction_progress,
          };
          this.imageIds = p.images?.map(i => i.id) ?? [];
        },
      });
    }
  }

  onFieldChange(field: ProjectField): void {
    if (this.submitted) this.validateForm();
    else this.fieldErrors[field] = '';
  }

  onSubmit(): void {
    if (!this.auth.isBuilder()) {
      this.error = 'Only builder accounts can manage projects.';
      return;
    }

    this.submitted = true;
    this.error = '';
    if (!this.validateForm()) return;

    this.loading = true;
    const payload = { ...this.form, image_ids: this.imageIds };
    const req = this.isEdit
      ? this.projectService.update(this.projectId, payload)
      : this.projectService.create(payload);

    req.subscribe({
      next: (p) => {
        this.projectService.cacheProject(p);
        this.loading = false;
        this.router.navigate(['/projects', p.id]);
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

    const name = trim(this.form.project_name);
    if (!name) {
      this.fieldErrors.project_name = 'Project name is required.';
      valid = false;
    } else if (name.length < 3) {
      this.fieldErrors.project_name = 'Project name must be at least 3 characters.';
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

    if (!trim(this.form.locality)) {
      this.fieldErrors.locality = 'Locality is required.';
      valid = false;
    }

    if (this.form.status && !PROJECT_STATUSES.includes(this.form.status as typeof PROJECT_STATUSES[number])) {
      this.fieldErrors.status = 'Select a valid status.';
      valid = false;
    }

    for (const field of ['total_towers', 'total_floors', 'total_units'] as const) {
      const value = trim(this.form[field]);
      if (value && !isPositiveInt(value)) {
        this.fieldErrors[field] = 'Must be a positive whole number.';
        valid = false;
      }
    }

    const progress = trim(this.form.construction_progress);
    if (progress && !/^\d{1,3}%?$/.test(progress)) {
      this.fieldErrors.construction_progress = 'Enter progress as a percentage, e.g. 70 or 70%.';
      valid = false;
    }

    return valid;
  }

  private emptyFieldErrors(): Record<ProjectField, string> {
    return {
      project_name: '',
      status: '',
      address: '',
      city: '',
      locality: '',
      total_towers: '',
      total_floors: '',
      total_units: '',
      construction_progress: '',
    };
  }
}
