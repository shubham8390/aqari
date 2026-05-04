import { Component, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: './property-search.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class PropertySearchComponent implements AfterViewChecked {
  chat = inject(ChatService);
  nav  = inject(NavigationService);

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

  inputText = '';

  quickPills = [
    { label: '✍️ Draft negotiation message', text: 'Draft the negotiation message for me' },
    { label: '📋 Documents checklist',       text: 'What documents do I need to rent in Dubai?' },
    { label: '📈 Marina market trends',      text: 'Show Marina market trends' },
    { label: '🏛️ Ejari process',             text: 'How does Ejari registration work?' },
  ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  send(): void {
    if (!this.inputText.trim()) return;
    this.chat.sendMessage(this.inputText.trim());
    this.inputText = '';
  }

  sendQuick(text: string): void {
    this.chat.sendMessage(text);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.send();
  }

  private scrollToBottom(): void {
    if (this.chatScroll) {
      const el = this.chatScroll.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
