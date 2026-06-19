import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCreate } from '../../core/models/property-api.model';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { AuthService } from '../../core/services/auth.service';

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

  isEdit = false;
  projectId = 0;
  loading = false;
  error = '';
  imageIds: number[] = [];

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

  onSubmit(): void {
    if (!this.auth.isBuilder()) {
      this.error = 'Only builder accounts can manage projects.';
      return;
    }
    this.loading = true;
    this.error = '';
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
}
