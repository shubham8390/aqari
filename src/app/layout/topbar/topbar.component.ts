import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { LayoutService } from '../../core/services/layout.service';
import { ThemeService } from '../../core/services/theme.service';
import { LoginButtonComponent } from '../auth/login-button.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent],
  templateUrl: './topbar.component.html',
  host: { style: 'display:block;flex-shrink:0;' },
})
export class TopbarComponent {
  nav = inject(NavigationService);
  layout = inject(LayoutService);
  theme = inject(ThemeService);
  private router = inject(Router);

  goHome(): void {
    void this.router.navigate(['/']);
  }
}
