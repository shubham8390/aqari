import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { MapMarkerItem, MapMarkersService } from '../../../core/services/map-markers.service';
import { loadGoogleMaps } from '../../../core/utils/google-maps-loader';
import { buildGoogleMapsSearchUrl, openGoogleMapsForMarker } from '../../../core/utils/google-maps-url.util';
import { createMarkerLabelOverlay, MarkerLabelOverlay } from './marker-label.overlay';

const PUNE_CENTER: google.maps.LatLngLiteral = { lat: 18.5204, lng: 73.8567 };

@Component({
  selector: 'app-project-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './project-map.component.html',
  styleUrl: './project-map.component.css',
  host: { class: 'project-map-host' },
})
export class ProjectMapComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly markersService = inject(MapMarkersService);

  @ViewChild(GoogleMap) map?: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;
  @ViewChildren(MapMarker) mapMarkerRefs?: QueryList<MapMarker>;

  readonly mapsReady = signal(false);
  readonly mapsError = signal('');
  readonly center = signal<google.maps.LatLngLiteral>(PUNE_CENTER);
  readonly zoom = signal(12);
  readonly selected = signal<MapMarkerItem | null>(null);
  readonly hoveredId = signal<number | null>(null);

  private lastViewKey = '';
  private labelOverlay: MarkerLabelOverlay | null = null;
  private labelOverlayMarkerId: number | null = null;
  private readonly markerOptionsCache = new Map<number, google.maps.MarkerOptions>();
  private readonly markerRefById = new Map<number, MapMarker>();
  private readonly markerListenerHandles: google.maps.MapsEventListener[] = [];
  private mapIdleListener: google.maps.MapsEventListener | null = null;

  readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
  };

  constructor() {
    effect(() => {
      const markers = this.markersService.markers();
      const focusedId = this.markersService.focusedId();
      if (!this.mapsReady() || !this.map?.googleMap) return;

      const viewKey = `${markers.map(m => m.id).join(',')}|${focusedId ?? ''}`;
      if (viewKey === this.lastViewKey) return;
      this.lastViewKey = viewKey;

      untracked(() => this.applyMapView(markers, focusedId));
    });

    effect(() => {
      const markers = this.markersService.markers();
      const focusedId = this.markersService.focusedId();
      const hoveredId = this.hoveredId();
      if (!this.mapsReady() || !this.map?.googleMap) return;

      untracked(() => this.syncLabelOverlay(markers, focusedId, hoveredId));
    });

    effect(() => {
      this.markersService.markers().length;
      if (!this.mapsReady()) return;
      queueMicrotask(() => this.bindMarkerHoverListeners());
    });
  }

  ngOnInit(): void {
    loadGoogleMaps()
      .then(() => {
        this.mapsReady.set(true);
        queueMicrotask(() => this.attachMapIdleListener());
      })
      .catch(() => this.mapsError.set('Unable to load Google Maps. Check your API key and network.'));
  }

  ngAfterViewInit(): void {
    this.mapMarkerRefs?.changes.subscribe(() => this.bindMarkerHoverListeners());
    this.bindMarkerHoverListeners();
  }

  ngOnDestroy(): void {
    this.clearMarkerHoverListeners();
    this.mapIdleListener?.remove();
    this.mapIdleListener = null;
    this.removeLabelOverlay();
    this.markersService.focus(null);
  }

  markerOptions(marker: MapMarkerItem): google.maps.MarkerOptions {
    const focused = this.markersService.focusedId() === marker.id;
    let base = this.markerOptionsCache.get(marker.id);
    if (!base) {
      base = { title: marker.title };
      this.markerOptionsCache.set(marker.id, base);
    }
    return { ...base, zIndex: focused ? 2 : 1 };
  }

  onMarkerClick(marker: MapMarkerItem, mapMarker: MapMarker): void {
    this.selectMarker(marker, mapMarker);
  }

  openInGoogleMaps(marker: MapMarkerItem): void {
    openGoogleMapsForMarker(marker);
  }

  googleMapsUrl(marker: MapMarkerItem): string {
    return buildGoogleMapsSearchUrl(marker);
  }

  onMapClick(): void {
    this.selected.set(null);
    this.markersService.focus(null);
    this.hoveredId.set(null);
    this.infoWindow?.close();
    this.removeLabelOverlay();
  }

  /** Call after the map container becomes visible (e.g. mobile toggle). */
  refreshSize(): void {
    const map = this.map?.googleMap;
    if (!map) return;

    const mapDiv = map.getDiv();
    if (mapDiv) {
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
    }

    google.maps.event.trigger(map, 'resize');
    const markers = this.markersService.markers();
    if (markers.length) {
      this.fitToMarkers(markers);
    } else {
      map.setCenter(PUNE_CENTER);
      map.setZoom(12);
    }
    this.labelOverlay?.draw();
  }

  private selectMarker(marker: MapMarkerItem, mapMarker?: MapMarker): void {
    this.selected.set(marker);
    this.markersService.focus(marker.id);
    const ref = mapMarker ?? this.markerRefById.get(marker.id);
    if (ref) {
      this.infoWindow?.open(ref);
    }
  }

  private syncLabelOverlay(
    markers: MapMarkerItem[],
    focusedId: number | null,
    hoveredId: number | null,
  ): void {
    const activeId = focusedId ?? hoveredId;
    if (activeId == null) {
      this.removeLabelOverlay();
      return;
    }

    const activeMarker = markers.find(m => m.id === activeId);
    if (!activeMarker) {
      this.removeLabelOverlay();
      return;
    }

    const map = this.map?.googleMap;
    if (!map) return;

    if (this.labelOverlay && this.labelOverlayMarkerId === activeId) {
      this.labelOverlay.draw();
      return;
    }

    this.removeLabelOverlay();
    this.labelOverlay = createMarkerLabelOverlay(
      activeMarker,
      (item) => this.openInGoogleMaps(item),
      () => this.hoveredId.set(activeMarker.id),
      () => {
        if (this.markersService.focusedId() !== activeMarker.id && this.hoveredId() === activeMarker.id) {
          this.hoveredId.set(null);
        }
      },
    );
    this.labelOverlay.setMap(map);
    this.labelOverlayMarkerId = activeId;
  }

  private removeLabelOverlay(): void {
    this.labelOverlay?.setMap(null);
    this.labelOverlay = null;
    this.labelOverlayMarkerId = null;
  }

  private bindMarkerHoverListeners(): void {
    this.clearMarkerHoverListeners();
    this.markerRefById.clear();

    const markers = this.markersService.markers();
    const refs = this.mapMarkerRefs?.toArray() ?? [];

    refs.forEach((ref, index) => {
      const marker = markers[index];
      if (!marker) return;

      this.markerRefById.set(marker.id, ref);
      const nativeMarker = ref.marker;
      if (!nativeMarker) return;

      const enter = nativeMarker.addListener('mouseover', () => {
        this.hoveredId.set(marker.id);
      });
      const leave = nativeMarker.addListener('mouseout', () => {
        if (this.hoveredId() === marker.id) {
          this.hoveredId.set(null);
        }
      });

      this.markerListenerHandles.push(enter, leave);
    });
  }

  private clearMarkerHoverListeners(): void {
    this.markerListenerHandles.forEach(handle => handle.remove());
    this.markerListenerHandles.length = 0;
  }

  private attachMapIdleListener(): void {
    const map = this.map?.googleMap;
    if (!map) return;
    this.mapIdleListener?.remove();
    this.mapIdleListener = map.addListener('idle', () => {
      this.labelOverlay?.draw();
    });
  }

  private applyMapView(markers: MapMarkerItem[], focusedId: number | null): void {
    const map = this.map?.googleMap;
    if (!map) return;

    if (!markers.length) {
      this.selected.set(null);
      map.setCenter(PUNE_CENTER);
      map.setZoom(12);
      this.center.set(PUNE_CENTER);
      this.zoom.set(12);
      this.removeLabelOverlay();
      return;
    }

    if (focusedId != null) {
      const match = markers.find(m => m.id === focusedId);
      if (match) {
        this.selected.set(match);
        map.panTo(match.position);
        if ((map.getZoom() ?? 0) < 14) map.setZoom(15);
        const center = map.getCenter();
        const zoom = map.getZoom();
        if (center && zoom != null) {
          this.center.set({ lat: center.lat(), lng: center.lng() });
          this.zoom.set(zoom);
        }
        queueMicrotask(() => this.bindMarkerHoverListeners());
        return;
      }
    }

    this.fitToMarkers(markers);
    queueMicrotask(() => this.bindMarkerHoverListeners());
  }

  private fitToMarkers(markers: MapMarkerItem[]): void {
    const map = this.map?.googleMap;
    if (!map || !markers.length) return;

    if (markers.length === 1) {
      map.setCenter(markers[0].position);
      map.setZoom(14);
      this.center.set(markers[0].position);
      this.zoom.set(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.position));
    map.fitBounds(bounds, 64);
    google.maps.event.addListenerOnce(map, 'idle', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom != null) {
        this.center.set({ lat: center.lat(), lng: center.lng() });
        this.zoom.set(zoom);
      }
      this.labelOverlay?.draw();
    });
  }
}
