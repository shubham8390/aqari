import { Component, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { NavigationService } from '../../core/services/navigation.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { AGENT_INITIAL, AGENT_LABEL, AGENT_NAME } from '../../core/constants/agent.constants';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: './property-search.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;min-height:0;' },
})
export class PropertySearchComponent implements AfterViewChecked {
  chat = inject(ChatService);
  nav  = inject(NavigationService);

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

  inputText = '';

  readonly agentName = AGENT_NAME;
  readonly agentLabel = AGENT_LABEL;
  readonly agentInitial = AGENT_INITIAL;

  // TODO: Quick suggestion pills — implement later
  // showQuickPills = computed(() =>
  //   this.chat.messages().some(m => m.role === 'user'),
  // );
  //
  // quickPills = [
  //   { label: '🏢 Project details',       text: 'Give me details about Galaxy Orizzonte' },
  //   { label: '📋 RERA & builder info',   text: 'What is the RERA number and builder for Galaxy Orizzonte?' },
  //   { label: '💰 Pricing & configs',     text: 'What are the 2 BHK and 3 BHK prices for Galaxy Orizzonte?' },
  //   { label: '📅 Possession timeline',   text: 'When is Galaxy Orizzonte expected to be completed?' },
  // ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  send(): void {
    if (!this.inputText.trim()) return;
    this.chat.sendMessage(this.inputText.trim());
    this.inputText = '';
  }

  // sendQuick(text: string): void {
  //   this.chat.sendMessage(text);
  // }

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
