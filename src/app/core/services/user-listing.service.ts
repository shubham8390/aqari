import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API } from '../config/api.config';
import { UserListingCreate, UserListingRead, UserListingUpdate } from '../models/property-api.model';
import { StatusResponse } from '../models/chat-api.model';
import { PropertyCacheService } from './property-cache.service';

@Injectable({ providedIn: 'root' })
export class UserListingService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(PropertyCacheService);

  list() {
    return this.http.get<UserListingRead[]>(API.userListings);
  }

  refreshForUser(userId: number) {
    return this.list().pipe(
      tap(listings => this.cache.setUserListings(listings.filter(l => l.user_id === userId))),
    );
  }

  get(id: number) {
    return this.http.get<UserListingRead>(API.userListing(id));
  }

  create(payload: UserListingCreate) {
    return this.http.post<UserListingRead>(API.userListings, payload);
  }

  update(id: number, payload: UserListingUpdate) {
    return this.http.put<UserListingRead>(API.userListing(id), payload);
  }

  delete(id: number) {
    return this.http.delete<StatusResponse>(API.userListing(id));
  }

  cacheUserListing(listing: UserListingRead): void {
    this.cache.addUserListing(listing);
  }

  getCachedUserListings() {
    return this.cache.userListings();
  }

  removeCachedUserListing(id: number): void {
    this.cache.removeUserListing(id);
  }
}
