import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import { ProfileUpdate } from '../models/profile.model';
import { UserRead } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile() {
    return this.http.get<UserRead>(API.profile);
  }

  updateProfile(payload: ProfileUpdate) {
    return this.http.put<UserRead>(API.profile, payload);
  }
}
