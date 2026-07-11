import { Component, inject, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { NavigationService } from '../../core/services/navigation.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../layout/auth/auth-modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { MapMarkersService } from '../../core/services/map-markers.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ProjectMapComponent } from './project-map/project-map.component';
import { AGENT_INITIAL, AGENT_LABEL, AGENT_NAME } from '../../core/constants/agent.constants';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent, ProjectMapComponent],
  templateUrl: './property-search.component.html',
  host: {
    class: 'property-search-host',
    style: 'display:flex;flex-direction:column;flex:1;width:100%;min-width:0;overflow:hidden;min-height:0;',
  },
})
export class PropertySearchComponent implements OnInit, AfterViewInit, OnDestroy {
  chat = inject(ChatService);
  nav = inject(NavigationService);
  theme = inject(ThemeService);
  private readonly mapMarkers = inject(MapMarkersService);
  private auth = inject(AuthService);
  private authModal = inject(AuthModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;
  @ViewChild(ProjectMapComponent) projectMap?: ProjectMapComponent;

  inputText = '';
  mobileMapOpen = false;
  private chatResizeObserver?: ResizeObserver;
  private scrollRaf = 0;

  readonly agentName = AGENT_NAME;
  readonly agentLabel = AGENT_LABEL;
  readonly agentInitial = AGENT_INITIAL;

  get isLight(): boolean {
    return this.theme.theme() === 'light';
  }

  constructor() {
    effect(() => {
      this.chat.messages().length;
      this.chat.isTyping();
      this.scheduleScrollToBottom(true);
    });
  }

  ngOnInit(): void {
    document.documentElement.classList.add('search-map-active');
    document.body.classList.add('search-map-active');
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

  ngAfterViewInit(): void {
    const el = this.chatScroll?.nativeElement;
    if (!el) return;

    this.chatResizeObserver = new ResizeObserver(() => {
      this.scheduleScrollToBottom(false);
    });
    this.chatResizeObserver.observe(el);
    this.scheduleScrollToBottom(true);
  }

  ngOnDestroy(): void {
    this.chatResizeObserver?.disconnect();
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    document.documentElement.classList.remove('search-map-active');
    document.body.classList.remove('search-map-active');
  }

  send(): void {
    if (!this.inputText.trim()) return;
    this.chat.sendMessage(this.inputText.trim());
    this.inputText = '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.send();
  }

  toggleMobileMap(): void {
    this.mobileMapOpen = !this.mobileMapOpen;
    if (this.mobileMapOpen) {
      this.scheduleMapResize();
    }
  }

  onFocusProject(id: number): void {
    this.mapMarkers.focus(id);
    if (window.matchMedia('(max-width: 899px)').matches) {
      this.mobileMapOpen = true;
      this.scheduleMapResize();
    }
  }

  private scheduleMapResize(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.projectMap?.refreshSize();
        setTimeout(() => this.projectMap?.refreshSize(), 150);
        setTimeout(() => this.projectMap?.refreshSize(), 250);
      });
    });
  }

  private scheduleScrollToBottom(force: boolean): void {
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0;
      this.scrollToBottom(force);
    });
  }

  private shouldAutoScroll(): boolean {
    const el = this.chatScroll?.nativeElement;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  private scrollToBottom(force: boolean): void {
    if (!this.chatScroll) return;
    if (!force && !this.shouldAutoScroll()) return;

    const el = this.chatScroll.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
