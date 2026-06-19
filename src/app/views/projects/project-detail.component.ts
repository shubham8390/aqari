import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ImageService } from '../../core/services/image.service';
import { ProjectRead } from '../../core/models/property-api.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  projectService = inject(ProjectService);
  imageService = inject(ImageService);

  project = signal<ProjectRead | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.get(id).subscribe({
      next: (p) => { this.project.set(p); this.loading.set(false); },
      error: () => { this.error.set('Project not found.'); this.loading.set(false); },
    });
  }

  imageUrl(filename: string): string {
    return this.imageService.getImageUrl(filename);
  }

  edit(): void {
    const p = this.project();
    if (p) this.router.navigate(['/projects', p.id, 'edit']);
  }
}
