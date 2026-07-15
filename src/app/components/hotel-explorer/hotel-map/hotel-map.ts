import { Component, inject, signal } from '@angular/core';
import { Hotel } from '../../../models/hotel.model';
import { HotelService } from '../../../services/hotel.service';
import { createHotelMarkers } from '../../../shared/utils/hotel-marker.util';
import { HotelMap2dView } from './hotel-map-2d-view/hotel-map-2d-view';
import { HotelMap3dView } from './hotel-map-3d-view/hotel-map-3d-view';

@Component({
  selector: 'app-hotel-map',
  imports: [HotelMap2dView, HotelMap3dView],
  templateUrl: './hotel-map.html',
  styleUrl: './hotel-map.scss',
})
export class HotelMap {
  private readonly hotelService = inject(HotelService);

  readonly hotels = this.hotelService.getHotels();
  readonly hotelMarkers = createHotelMarkers(this.hotels);

  readonly focusedHotels = signal<readonly Hotel[]>(this.hotels);
  viewMode = signal<HotelMapViewMode>('2d');

  setViewMode(viewMode: HotelMapViewMode) {
    this.viewMode.set(viewMode);
  }

  showHotelsOnMap(hotels: readonly Hotel[] = this.hotels) {
    this.focusedHotels.set([...hotels]);
  }
}

type HotelMapViewMode = '2d' | '3d';
