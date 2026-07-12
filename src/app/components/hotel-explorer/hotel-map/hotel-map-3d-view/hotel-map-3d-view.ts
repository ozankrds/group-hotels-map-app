import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Hotel } from '../../../../models/hotel.model';
import { createHotelMap3dCamera } from '../../../../shared/utils/map-bounds.util';
import { HotelMarker } from '../../../../shared/utils/hotel-marker.util';
import { GmpMarker3dInteractiveClick } from '../../../map-3d/gmp-marker-3d-interactive-click';
import { Map3dComponent } from '../../../map-3d/map-3d';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

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
  readonly focusedHotels = input.required<readonly Hotel[]>();
  readonly markers = input.required<readonly HotelMarker[]>();

  readonly hotelDetailsRequested = output<Hotel>();

  readonly popoverHotel = signal<Hotel | null>(null);
  readonly camera = computed(() => createHotelMap3dCamera(this.focusedHotels()));

  private readonly hotelPopover = viewChild<ElementRef<PopoverElement>>('hotelPopover');

  private readonly focusedHotelsEffect = effect(() => {
    this.focusedHotels();
    this.popoverHotel.set(null);
  });

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

  requestHotelDetails(hotel: Hotel) {
    this.closePopover();
    this.hotelDetailsRequested.emit(hotel);
  }
}
