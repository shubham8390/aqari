import { Injectable, signal } from '@angular/core';
import { ListingRead, ProjectRead, UserListingRead } from '../models/property-api.model';

const LISTINGS_KEY      = 'aqari_cached_listings';
const PROJECTS_KEY      = 'aqari_cached_projects';
const USER_LISTINGS_KEY = 'aqari_cached_user_listings';

@Injectable({ providedIn: 'root' })
export class PropertyCacheService {
  private currentUserId: number | null = null;

  listings     = signal<ListingRead[]>([]);
  projects     = signal<ProjectRead[]>([]);
  userListings = signal<UserListingRead[]>([]);

  loadForUser(userId: number): void {
    this.currentUserId = userId;
    this.listings.set(this.loadScoped<ListingRead>(LISTINGS_KEY, userId));
    this.projects.set(this.loadScoped<ProjectRead>(PROJECTS_KEY, userId));
    this.userListings.set(this.loadScoped<UserListingRead>(USER_LISTINGS_KEY, userId));
  }

  clearSession(): void {
    this.currentUserId = null;
    this.listings.set([]);
    this.projects.set([]);
    this.userListings.set([]);
  }

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

  setProjects(items: ProjectRead[]): void {
    this.projects.set(items);
    this.persist(PROJECTS_KEY, items);
  }

  setListings(items: ListingRead[]): void {
    this.listings.set(items);
    this.persist(LISTINGS_KEY, items);
  }

  setUserListings(items: UserListingRead[]): void {
    this.userListings.set(items);
    this.persist(USER_LISTINGS_KEY, items);
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

  private loadScoped<T>(base: string, userId: number): T[] {
    const scopedKey = `${base}_${userId}`;
    let data = this.load<T>(scopedKey);
    if (!data.length) {
      const legacy = this.load<T>(base);
      if (legacy.length) {
        data = legacy;
        localStorage.setItem(scopedKey, JSON.stringify(data));
      }
    }
    return data;
  }

  private load<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T[] : [];
    } catch {
      return [];
    }
  }

  private persist(base: string, data: unknown[]): void {
    localStorage.setItem(this.scopedKey(base), JSON.stringify(data));
  }

  private scopedKey(base: string): string {
    return this.currentUserId ? `${base}_${this.currentUserId}` : base;
  }
}
