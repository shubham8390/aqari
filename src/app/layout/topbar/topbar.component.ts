import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { LayoutService } from '../../core/services/layout.service';
import { LoginButtonComponent } from '../auth/login-button.component';
import { APP_LOGO_SRC } from '../../core/constants/brand.constants';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent],
  templateUrl: './topbar.component.html',
  host: { style: 'display:block;flex-shrink:0;' },
})
export class TopbarComponent {
  readonly logoSrc = APP_LOGO_SRC;
  nav    = inject(NavigationService);
  layout = inject(LayoutService);
  private router = inject(Router);

  goHome(): void {
    void this.router.navigate(['/']);
  }
}
