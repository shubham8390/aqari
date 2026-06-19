import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../core/services/image.service';
import { ImageRead } from '../../core/models/property-api.model';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  private imageService = inject(ImageService);

  @Input() imageIds: number[] = [];
  @Output() imageIdsChange = new EventEmitter<number[]>();

  uploaded = signal<ImageRead[]>([]);
  uploading = signal(false);
  error = signal('');

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    this.uploading.set(true);
    this.error.set('');

    Array.from(files).forEach(file => {
      this.imageService.upload(file).subscribe({
        next: (img) => {
          this.uploaded.update(list => [...list, img]);
          const nextIds = [...this.imageIds, img.id];
          this.imageIds = nextIds;
          this.imageIdsChange.emit(nextIds);
          this.uploading.set(false);
        },
        error: () => {
          this.uploading.set(false);
          this.error.set('Image upload failed.');
        },
      });
    });

    input.value = '';
  }

  removeImage(id: number): void {
    this.uploaded.update(list => list.filter(i => i.id !== id));
    const nextIds = this.imageIds.filter(i => i !== id);
    this.imageIds = nextIds;
    this.imageIdsChange.emit(nextIds);
  }

  imageUrl(filename: string): string {
    return this.imageService.getImageUrl(filename);
  }
}
