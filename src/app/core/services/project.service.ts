import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import { ProjectCreate, ProjectRead, ProjectUpdate } from '../models/property-api.model';
import { StatusResponse } from '../models/chat-api.model';
import { PropertyCacheService } from './property-cache.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(PropertyCacheService);

  get(id: number) {
    return this.http.get<ProjectRead>(API.project(id));
  }

  create(payload: ProjectCreate) {
    return this.http.post<ProjectRead>(API.projects, payload);
  }

  update(id: number, payload: ProjectUpdate) {
    return this.http.put<ProjectRead>(API.project(id), payload);
  }

  delete(id: number) {
    return this.http.delete<StatusResponse>(API.project(id));
  }

  cacheProject(project: ProjectRead): void {
    this.cache.addProject(project);
  }

  getCachedProjects() {
    return this.cache.projects();
  }

  removeCachedProject(id: number): void {
    this.cache.removeProject(id);
  }
}
