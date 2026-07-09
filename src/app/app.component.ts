import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileSetupModalComponent } from './layout/auth/profile-setup-modal.component';
import { LogoutConfirmComponent } from './layout/auth/logout-confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProfileSetupModalComponent, LogoutConfirmComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
