import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import { ImageRead } from '../models/property-api.model';

export interface ImageUploadOptions {
  listing_id?: number;
  project_id?: number;
  user_listing_id?: number;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);

  upload(file: File, options: ImageUploadOptions = {}) {
    const form = new FormData();
    form.append('file', file);
    const params: Record<string, string> = {};
    if (options.listing_id != null) params['listing_id'] = String(options.listing_id);
    if (options.project_id != null) params['project_id'] = String(options.project_id);
    if (options.user_listing_id != null) params['user_listing_id'] = String(options.user_listing_id);

    return this.http.post<ImageRead>(API.images, form, { params });
  }

  getImageUrl(filename: string): string {
    return API.image(filename);
  }
}
