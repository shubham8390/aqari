import { MapMarkerItem } from '../../../core/services/map-markers.service';

/** Pixel offset from the pin anchor to place the label chip to the right. */
const LABEL_OFFSET_X = 18;
const LABEL_OFFSET_Y = -10;

export type MarkerLabelOverlay = google.maps.OverlayView;

/**
 * Creates a label overlay after Google Maps is loaded.
 * Must not extend OverlayView at module scope — google is undefined until the script loads.
 */
export function createMarkerLabelOverlay(
  item: MapMarkerItem,
  onClick: (item: MapMarkerItem) => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
): MarkerLabelOverlay {
  class MarkerLabelOverlayImpl extends google.maps.OverlayView {
    private container: HTMLDivElement | null = null;

    override onAdd(): void {
      this.container = document.createElement('div');
      this.container.className = 'map-marker-label';
      this.container.setAttribute('role', 'button');
      this.container.setAttribute('tabindex', '0');
      this.container.setAttribute('aria-label', item.title);

      const title = document.createElement('div');
      title.className = 'map-marker-label-title';
      title.textContent = item.title;
      this.container.appendChild(title);

      if (item.locality) {
        const meta = document.createElement('div');
        meta.className = 'map-marker-label-meta';
        meta.textContent = item.locality;
        this.container.appendChild(meta);
      }

      this.container.addEventListener('click', (event) => {
        event.stopPropagation();
        onClick(item);
      });

      this.container.addEventListener('mouseenter', () => {
        onMouseEnter?.();
      });

      this.container.addEventListener('mouseleave', () => {
        onMouseLeave?.();
      });

      this.container.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          onClick(item);
        }
      });

      const panes = this.getPanes();
      panes?.overlayMouseTarget?.appendChild(this.container);
    }

    override draw(): void {
      if (!this.container) return;

      const projection = this.getProjection();
      if (!projection) return;

      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(item.position.lat, item.position.lng),
      );
      if (!point) return;

      this.container.style.left = `${point.x + LABEL_OFFSET_X}px`;
      this.container.style.top = `${point.y + LABEL_OFFSET_Y}px`;
    }

    override onRemove(): void {
      this.container?.remove();
      this.container = null;
    }
  }

  return new MarkerLabelOverlayImpl();
}
