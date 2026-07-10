import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { MapMarkerItem, MapMarkersService } from '../../../core/services/map-markers.service';
import { loadGoogleMaps } from '../../../core/utils/google-maps-loader';

const PUNE_CENTER: google.maps.LatLngLiteral = { lat: 18.5204, lng: 73.8567 };

@Component({
  selector: 'app-project-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './project-map.component.html',
  styleUrl: './project-map.component.css',
  host: { class: 'project-map-host' },
})
export class ProjectMapComponent implements OnInit, OnDestroy {
  readonly markersService = inject(MapMarkersService);

  @ViewChild(GoogleMap) map?: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  readonly mapsReady = signal(false);
  readonly mapsError = signal('');
  readonly center = signal<google.maps.LatLngLiteral>(PUNE_CENTER);
  readonly zoom = signal(12);
  readonly selected = signal<MapMarkerItem | null>(null);

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

      if (!markers.length) {
        this.center.set(PUNE_CENTER);
        this.zoom.set(12);
        this.selected.set(null);
        return;
      }

      if (focusedId != null) {
        const match = markers.find(m => m.id === focusedId);
        if (match) {
          this.selected.set(match);
          this.center.set(match.position);
          this.zoom.set(15);
          return;
        }
      }

      this.fitToMarkers(markers);
    });
  }

  ngOnInit(): void {
    loadGoogleMaps()
      .then(() => this.mapsReady.set(true))
      .catch(() => this.mapsError.set('Unable to load Google Maps. Check your API key and network.'));
  }

  ngOnDestroy(): void {
    this.markersService.focus(null);
  }

  markerOptions(marker: MapMarkerItem): google.maps.MarkerOptions {
    const focused = this.markersService.focusedId() === marker.id;
    return {
      title: marker.title,
      animation: focused && typeof google !== 'undefined'
        ? google.maps.Animation.BOUNCE
        : undefined,
    };
  }

  onMarkerClick(marker: MapMarkerItem, mapMarker: MapMarker): void {
    this.selected.set(marker);
    this.markersService.focus(marker.id);
    this.infoWindow?.open(mapMarker);
  }

  onMapClick(): void {
    this.selected.set(null);
    this.markersService.focus(null);
    this.infoWindow?.close();
  }

  /** Call after the map container becomes visible (e.g. mobile toggle). */
  refreshSize(): void {
    const map = this.map?.googleMap;
    if (!map) return;
    google.maps.event.trigger(map, 'resize');
    const markers = this.markersService.markers();
    if (markers.length) {
      this.fitToMarkers(markers);
    } else {
      map.setCenter(PUNE_CENTER);
      map.setZoom(12);
    }
  }

  private fitToMarkers(markers: MapMarkerItem[]): void {
    const map = this.map?.googleMap;
    if (!map || !markers.length) return;

    if (markers.length === 1) {
      this.center.set(markers[0].position);
      this.zoom.set(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend(m.position));
    map.fitBounds(bounds, 64);
  }
}
