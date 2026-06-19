import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileSetupService } from './profile-setup.service';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileUpdate } from '../../core/models/profile.model';

@Component({
  selector: 'app-profile-setup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-setup-modal.component.html',
})
export class ProfileSetupModalComponent {
  profileSetup = inject(ProfileSetupService);
  profileService = inject(ProfileService);
  auth = inject(AuthService);

  form: ProfileUpdate = {
    name: '',
    phone: '',
    requirement: '',
    min_budget: undefined,
    max_budget: undefined,
    preferred_areas: '',
    company_name: '',
    website: '',
    builder_description: '',
  };

  loading = false;
  error = '';

  get isBuilder(): boolean {
    return this.auth.user()?.user_type === 'builder';
  }

  close(): void {
    this.profileSetup.close();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['overlay'] === 'true') {
      this.close();
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    const payload: ProfileUpdate = { ...this.form };
    if (!payload.min_budget) delete payload.min_budget;
    if (!payload.max_budget) delete payload.max_budget;

    this.profileService.updateProfile(payload).subscribe({
      next: (user) => {
        this.auth.updateUser(user);
        this.loading = false;
        this.close();
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not save profile. Please try again.';
      },
    });
  }
}
