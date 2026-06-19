import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api.config';
import { ListingCreate, ListingRead, ListingUpdate } from '../models/property-api.model';
import { StatusResponse } from '../models/chat-api.model';
import { PropertyCacheService } from './property-cache.service';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(PropertyCacheService);

  get(id: number) {
    return this.http.get<ListingRead>(API.listing(id));
  }

  create(payload: ListingCreate) {
    return this.http.post<ListingRead>(API.listings, payload);
  }

  update(id: number, payload: ListingUpdate) {
    return this.http.put<ListingRead>(API.listing(id), payload);
  }

  delete(id: number) {
    return this.http.delete<StatusResponse>(API.listing(id));
  }

  cacheListing(listing: ListingRead): void {
    this.cache.addListing(listing);
  }

  getCachedListings() {
    return this.cache.listings();
  }

  removeCachedListing(id: number): void {
    this.cache.removeListing(id);
  }
}
