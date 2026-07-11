import { MapMarkerItem } from '../services/map-markers.service';

/** Opens the project in Google Maps (search by name + location, centered on coordinates). */
export function buildGoogleMapsSearchUrl(marker: MapMarkerItem): string {
  const { lat, lng } = marker.position;
  const label = [marker.title, marker.locality].filter(Boolean).join(', ');
  const params = new URLSearchParams({
    api: '1',
    query: label || `${lat},${lng}`,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function openGoogleMapsForMarker(marker: MapMarkerItem): void {
  window.open(buildGoogleMapsSearchUrl(marker), '_blank', 'noopener,noreferrer');
}
