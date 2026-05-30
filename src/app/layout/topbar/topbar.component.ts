import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { LayoutService } from '../../core/services/layout.service';
import { LoginButtonComponent } from '../auth/login-button.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent],
  templateUrl: './topbar.component.html',
  host: { style: 'display:block;flex-shrink:0;' },
})
export class TopbarComponent {
  nav    = inject(NavigationService);
  layout = inject(LayoutService);
}
