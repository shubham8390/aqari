import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { UserRead } from '../models/auth.model';
import { ListingService } from './listing.service';
import { ProjectService } from './project.service';
import { UserListingService } from './user-listing.service';

@Injectable({ providedIn: 'root' })
export class PropertySyncService {
  private readonly projectService = inject(ProjectService);
  private readonly listingService = inject(ListingService);
  private readonly userListingService = inject(UserListingService);

  refreshForUser(user: UserRead): Observable<unknown> {
    if (user.user_type === 'builder') {
      return forkJoin([
        this.projectService.refreshForBuilder(user.id),
        this.listingService.refreshForBuilder(user.id),
      ]);
    }
    return this.userListingService.refreshForUser(user.id);
  }
}
