import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { HotelMarker } from '../../../../models/hotel-marker.model';
import { Hotel } from '../../../../models/hotel.model';
import { createHotelMap3dCamera } from '../../../../shared/utils/map-bounds.util';
import { Map3dComponent } from '../../../map-3d/map-3d';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

type Marker3DInteractiveElement = google.maps.maps3d.Marker3DInteractiveElement;
type PopoverElement = google.maps.maps3d.PopoverElement;

@Component({
  selector: 'app-hotel-map-3d-view',
  imports: [Map3dComponent, HotelInfoWindow],
  templateUrl: './hotel-map-3d-view.html',
  styleUrl: './hotel-map-3d-view.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotelMap3dView {
  readonly focusedHotels = input.required<readonly Hotel[]>();
  readonly markers = input.required<readonly HotelMarker[]>();

  readonly popoverHotel = signal<Hotel | null>(null);
  readonly camera = computed(() => createHotelMap3dCamera(this.focusedHotels()));

  private readonly popover = viewChild<ElementRef<PopoverElement>>('hotelPopover');

  private readonly focusedHotelsEffect = effect(() => {
    this.focusedHotels();
    this.popoverHotel.set(null);
  });

  openHotelPopover(marker: Marker3DInteractiveElement, hotel: Hotel) {
    const hotelPopover = this.getPopover();

    if (!hotelPopover) {
      return;
    }

    this.popoverHotel.set(hotel);
    hotelPopover.positionAnchor = marker;
    hotelPopover.open = true;
  }

  closePopover() {
    const hotelPopover = this.getPopover();

    if (hotelPopover) {
      hotelPopover.open = false;
    }

    this.popoverHotel.set(null);
  }

  private getPopover() {
    return this.popover()?.nativeElement;
  }
}
