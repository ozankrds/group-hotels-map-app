import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Hotel } from '../../../../models/hotel.model';
import { createHotelMap3dCamera } from '../../../../shared/utils/map-bounds.util';
import { HotelMapPoint } from '../../../../shared/utils/hotel-marker.util';
import { GmpMarker3dInteractiveClick } from '../../../map-3d/gmp-marker-3d-interactive-click';
import { Map3dComponent } from '../../../map-3d/map-3d';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

type Map3DElement = google.maps.maps3d.Map3DElement;
type Marker3DInteractiveElement = google.maps.maps3d.Marker3DInteractiveElement;
type PopoverElement = google.maps.maps3d.PopoverElement;

@Component({
  selector: 'app-hotel-map-3d-view',
  imports: [GmpMarker3dInteractiveClick, Map3dComponent, HotelInfoWindow],
  templateUrl: './hotel-map-3d-view.html',
  styleUrl: './hotel-map-3d-view.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotelMap3dView {
  readonly center = input.required<google.maps.LatLngLiteral>();
  readonly focusHotels = input.required<readonly Hotel[]>();
  readonly mapId = input<string | undefined>();
  readonly points = input.required<readonly HotelMapPoint[]>();

  readonly details = output<Hotel>();

  readonly popoverHotel = signal<Hotel | null>(null);

  private readonly map = signal<Map3DElement | null>(null);
  private readonly hotelPopover = viewChild<ElementRef<PopoverElement>>('hotelPopover');

  private readonly cameraEffect = effect(() => {
    const map = this.map();

    if (!map) {
      return;
    }

    this.clearPopover();
    this.fitHotelsOnMap(this.focusHotels());
  });

  handleMapReady(map: Map3DElement) {
    this.map.set(map);
  }

  openHotelPopover(marker: Marker3DInteractiveElement, hotel: Hotel) {
    const hotelPopover = this.getHotelPopover();

    if (!hotelPopover) {
      return;
    }

    this.popoverHotel.set(hotel);
    hotelPopover.positionAnchor = marker;
    hotelPopover.open = true;
  }

  closePopover() {
    const hotelPopover = this.getHotelPopover();

    if (hotelPopover) {
      hotelPopover.open = false;
    }

    this.popoverHotel.set(null);
  }

  private getHotelPopover() {
    return this.hotelPopover()?.nativeElement;
  }

  openHotelDetail(hotel: Hotel) {
    this.closePopover();
    this.details.emit(hotel);
  }

  private fitHotelsOnMap(hotels: readonly Hotel[]) {
    const map = this.map();

    if (!map) {
      return;
    }

    const camera = createHotelMap3dCamera(hotels, this.center());
    map.center = camera.center;
    map.heading = camera.heading;
    map.range = camera.range;
    map.tilt = camera.tilt;
  }

  private clearPopover() {
    this.popoverHotel.set(null);
  }
}
