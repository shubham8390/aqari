import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';
import { PropertyListingCardComponent } from '../property-listing-card/property-listing-card.component';
import { NegotiationCardComponent } from '../negotiation-card/negotiation-card.component';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, PropertyListingCardComponent, NegotiationCardComponent],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
}
