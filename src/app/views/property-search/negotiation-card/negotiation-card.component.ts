import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NegotiationAnalysis } from '../../../core/models/property.model';

@Component({
  selector: 'app-negotiation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './negotiation-card.component.html',
})
export class NegotiationCardComponent {
  @Input() negotiation!: NegotiationAnalysis;

  formatAED(value: number): string {
    return 'AED ' + value.toLocaleString();
  }
}
