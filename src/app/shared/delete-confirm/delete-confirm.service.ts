import { Injectable, signal } from '@angular/core';

export type DeleteTargetType = 'project' | 'listing' | 'user-listing';

export interface DeleteConfirmTarget {
  type: DeleteTargetType;
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class DeleteConfirmService {
  isOpen = signal(false);
  target = signal<DeleteConfirmTarget | null>(null);

  open(target: DeleteConfirmTarget): void {
    this.target.set(target);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.target.set(null);
  }
}
