import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { RightPanelComponent } from '../right-panel/right-panel.component';
import { NavigationService, ViewKey } from '../../core/services/navigation.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, RightPanelComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent implements OnInit {
  layout = inject(LayoutService);
  private nav = inject(NavigationService);
  private router = inject(Router);

  readonly hideRightPanel = signal(false);

  ngOnInit(): void {
    this.syncFromUrl(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.syncFromUrl(e.urlAfterRedirects);
      });
  }

  private syncFromUrl(url: string): void {
    const path = url.replace(/^#\/?/, '').split('?')[0];
    const segment = path.split('/').filter(Boolean)[0] ?? '';
    const view = segment as ViewKey;
    const valid: ViewKey[] = ['search', 'market', 'negotiate', 'rera', 'history'];
    if (valid.includes(view)) {
      this.nav.activeView.set(view);
    }
    this.hideRightPanel.set(view === 'search');
  }
}
