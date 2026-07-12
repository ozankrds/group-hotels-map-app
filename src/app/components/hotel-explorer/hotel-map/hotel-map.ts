import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Hotel } from '../../../models/hotel.model';
import { HotelService } from '../../../services/hotel.service';
import { createHotelMarkers } from '../../../shared/utils/hotel-marker.util';
import { HotelMap2dView } from './hotel-map-2d-view/hotel-map-2d-view';
import { HotelMap3dView } from './hotel-map-3d-view/hotel-map-3d-view';
import { HotelDetail } from './hotel-detail/hotel-detail';

@Component({
  selector: 'app-hotel-map',
  imports: [HotelMap2dView, HotelMap3dView, HotelDetail],
  templateUrl: './hotel-map.html',
  styleUrl: './hotel-map.scss',
})
export class HotelMap {
  private readonly hotelService = inject(HotelService);

  readonly hotels = this.hotelService.getHotels();
  readonly hotelMapPoints = createHotelMarkers(this.hotels);

  readonly center: google.maps.LatLngLiteral = { lat: 39.92077, lng: 32.85411 };
  readonly zoom = 6;
  readonly mapId = environment.googleMapsMapId;

  readonly focusedHotels = signal<readonly Hotel[]>(this.hotels);
  selectedHotel = signal<Hotel | null>(null);
  viewMode = signal<HotelMapViewMode>('2d');

  setViewMode(viewMode: HotelMapViewMode) {
    this.viewMode.set(viewMode);
  }

  showHotelsOnMap(hotels: readonly Hotel[] = this.hotels) {
    this.selectedHotel.set(null);
    this.focusedHotels.set([...hotels]);
  }

  openHotelDetail(hotel: Hotel) {
    this.selectedHotel.set(hotel);
  }

  closeHotelDetail() {
    this.selectedHotel.set(null);
  }
}

type HotelMapViewMode = '2d' | '3d';
