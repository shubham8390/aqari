import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  host: { style: 'display:block;flex-shrink:0;' },
})
export class TopbarComponent {
  nav = inject(NavigationService);
}
