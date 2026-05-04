import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RERA_CARDS, RERA_RULES } from '../../core/data/insights.data';

@Component({
  selector: 'app-rera-compliance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rera-compliance.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class ReraComplianceComponent {
  cards = RERA_CARDS;
  rules = RERA_RULES;
}
