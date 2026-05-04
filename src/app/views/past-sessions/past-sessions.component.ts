import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SESSIONS, ACTIVITY_STATS } from '../../core/data/sessions.data';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-past-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-sessions.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class PastSessionsComponent {
  nav    = inject(NavigationService);
  router = inject(Router);
  sessions       = SESSIONS;
  activityStats  = ACTIVITY_STATS;

  openSession(): void {
    this.nav.navigate('search');
    this.router.navigate(['/search']);
  }
}
