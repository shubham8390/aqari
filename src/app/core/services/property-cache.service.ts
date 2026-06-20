import { Injectable, signal } from '@angular/core';
import { ListingRead, ProjectRead, UserListingRead } from '../models/property-api.model';

const LISTINGS_KEY     = 'aqari_cached_listings';
const PROJECTS_KEY     = 'aqari_cached_projects';
const USER_LISTINGS_KEY = 'aqari_cached_user_listings';

@Injectable({ providedIn: 'root' })
export class PropertyCacheService {
  listings     = signal<ListingRead[]>(this.load<ListingRead>(LISTINGS_KEY));
  projects     = signal<ProjectRead[]>(this.load<ProjectRead>(PROJECTS_KEY));
  userListings = signal<UserListingRead[]>(this.load<UserListingRead>(USER_LISTINGS_KEY));

  addListing(item: ListingRead): void {
    this.listings.update(list => this.upsert(list, item));
    this.persist(LISTINGS_KEY, this.listings());
  }

  addProject(item: ProjectRead): void {
    this.projects.update(list => this.upsert(list, item));
    this.persist(PROJECTS_KEY, this.projects());
  }

  addUserListing(item: UserListingRead): void {
    this.userListings.update(list => this.upsert(list, item));
    this.persist(USER_LISTINGS_KEY, this.userListings());
  }

  removeListing(id: number): void {
    this.listings.update(list => list.filter(i => i.id !== id));
    this.persist(LISTINGS_KEY, this.listings());
  }

  removeProject(id: number): void {
    this.projects.update(list => list.filter(i => i.id !== id));
    this.persist(PROJECTS_KEY, this.projects());
  }

  removeUserListing(id: number): void {
    this.userListings.update(list => list.filter(i => i.id !== id));
    this.persist(USER_LISTINGS_KEY, this.userListings());
  }

  clearAll(): void {
    this.listings.set([]);
    this.projects.set([]);
    this.userListings.set([]);
    localStorage.removeItem(LISTINGS_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(USER_LISTINGS_KEY);
  }

  private upsert<T extends { id: number }>(list: T[], item: T): T[] {
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      const next = [...list];
      next[idx] = item;
      return next;
    }
    return [item, ...list];
  }

  private load<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T[] : [];
    } catch {
      return [];
    }
  }

  private persist(key: string, data: unknown[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
