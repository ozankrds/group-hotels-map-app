import { Component, effect, input, output, signal, viewChild } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { Hotel } from '../../../../models/hotel.model';
import { HotelMarker } from '../../../../shared/utils/hotel-marker.util';
import { createHotelBounds } from '../../../../shared/utils/map-bounds.util';
import { Map2dComponent } from '../../../map-2d/map-2d';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

@Component({
  selector: 'app-hotel-map-2d-view',
  imports: [GoogleMapsModule, Map2dComponent, HotelInfoWindow],
  templateUrl: './hotel-map-2d-view.html',
  styleUrl: './hotel-map-2d-view.scss',
})
export class HotelMap2dView {
  readonly focusedHotels = input.required<readonly Hotel[]>();
  readonly markers = input.required<readonly HotelMarker[]>();

  readonly hotelDetailsRequested = output<Hotel>();

  readonly infoWindowHotel = signal<Hotel | null>(null);

  private map = signal<google.maps.Map | null>(null);
  private readonly hotelInfoWindow = viewChild<MapInfoWindow>('hotelInfoWindow');

  private readonly focusedHotelsEffect = effect(() => {
    this.closeHotelInfoWindow();
    this.fitHotelsOnMap(this.focusedHotels());
  });

  handleMapReady(map: google.maps.Map) {
    this.map.set(map);
    this.fitHotelsOnMap(this.focusedHotels());
  }

  openHotelInfoWindow(marker: MapAdvancedMarker, hotel: Hotel) {
    this.hotelInfoWindow()?.open(marker);
    this.infoWindowHotel.set(hotel);
  }

  closeHotelInfoWindow() {
    this.hotelInfoWindow()?.close();
    this.infoWindowHotel.set(null);
  }

  clearHotelInfoWindow() {
    this.infoWindowHotel.set(null);
  }

  requestHotelDetails(hotel: Hotel) {
    this.closeHotelInfoWindow();
    this.hotelDetailsRequested.emit(hotel);
  }

  private fitHotelsOnMap(hotels: readonly Hotel[]) {
    const map = this.map();

    if (!map) {
      return;
    }

    const bounds = createHotelBounds(hotels);
    map.fitBounds(bounds, 48);
  }
}
