import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../../core/models/property.model';

@Component({
  selector: 'app-property-listing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-listing-card.component.html',
})
export class PropertyListingCardComponent {
  @Input() properties: Property[] = [];
}
