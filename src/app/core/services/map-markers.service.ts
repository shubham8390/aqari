import { Injectable, computed, inject, signal } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatSource } from '../models/chat-api.model';
import { formatSourceLocation, formatSourcePrice } from '../utils/chat-source.util';

export interface MapMarkerItem {
  id: number;
  position: google.maps.LatLngLiteral;
  title: string;
  locality: string;
  status?: string;
  price?: string | null;
  source: ChatSource;
}

@Injectable({ providedIn: 'root' })
export class MapMarkersService {
  private readonly chat = inject(ChatService);

  /** Project id to focus / highlight on the map (from chat card click). */
  readonly focusedId = signal<number | null>(null);

  readonly markers = computed<MapMarkerItem[]>(() => {
    const messages = this.chat.messages();
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role !== 'agent' || !msg.sources?.length) continue;
      return msg.sources
        .filter(s => Number.isFinite(s.lat) && Number.isFinite(s.lon))
        .map(s => ({
          id: s.id,
          position: { lat: s.lat as number, lng: s.lon as number },
          title: s.project_name,
          locality: formatSourceLocation(s),
          status: s.status,
          price: formatSourcePrice(s),
          source: s,
        }));
    }
    return [];
  });

  focus(id: number | null): void {
    this.focusedId.set(id);
  }
}
