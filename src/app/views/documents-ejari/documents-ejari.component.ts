import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PERSONAL_DOCS, PROPERTY_DOCS, EJARI_STEPS } from '../../core/data/documents.data';

@Component({
  selector: 'app-documents-ejari',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents-ejari.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class DocumentsEjariComponent {
  personalDocs = PERSONAL_DOCS;
  propertyDocs = PROPERTY_DOCS;
  ejariSteps   = EJARI_STEPS;
}
