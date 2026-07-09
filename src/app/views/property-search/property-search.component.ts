import { Component, inject, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { NavigationService } from '../../core/services/navigation.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { AGENT_INITIAL, AGENT_LABEL, AGENT_NAME } from '../../core/constants/agent.constants';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: './property-search.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;min-height:0;' },
})
export class PropertySearchComponent implements OnInit, AfterViewChecked {
  chat = inject(ChatService);
  nav  = inject(NavigationService);
  theme = inject(ThemeService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

  inputText = '';

  readonly agentName = AGENT_NAME;
  readonly agentLabel = AGENT_LABEL;
  readonly agentInitial = AGENT_INITIAL;

  get isLight(): boolean {
    return this.theme.theme() === 'light';
  }

  ngOnInit(): void {
    this.nav.navigate('search');

    const q = this.route.snapshot.queryParamMap.get('q')?.trim();
    if (!q) return;

    if (!this.auth.isAuthenticated()) {
      this.authModal.open('signin', `/search?q=${encodeURIComponent(q)}`);
      return;
    }

    void this.router.navigate(['/search'], { replaceUrl: true });
    queueMicrotask(() => this.chat.sendMessage(q));
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  send(): void {
    if (!this.inputText.trim()) return;
    this.chat.sendMessage(this.inputText.trim());
    this.inputText = '';
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
