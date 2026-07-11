import { Component, effect, input, output, signal } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { Hotel } from '../../../../models/hotel.model';
import { HotelMapPoint } from '../../../../shared/utils/hotel-marker.util';
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
  private readonly mapBoundsPadding = 48;

  readonly center = input.required<google.maps.LatLngLiteral>();
  readonly zoom = input.required<number>();
  readonly mapId = input<string | undefined>();
  readonly focusHotels = input.required<readonly Hotel[]>();
  readonly points = input.required<readonly HotelMapPoint[]>();

  readonly details = output<Hotel>();

  readonly infoWindowHotel = signal<Hotel | null>(null);

  private map = signal<google.maps.Map | null>(null);
  private activeHotelInfoWindow?: MapInfoWindow;

  private readonly focusHotelsEffect = effect(() => {
    this.closeHotelInfoWindow();
    this.fitHotelsOnMap(this.focusHotels());
  });

  handleMapReady(map: google.maps.Map) {
    this.map.set(map);
    this.fitHotelsOnMap(this.focusHotels());
  }

  openHotelInfoWindow(infoWindow: MapInfoWindow, marker: MapAdvancedMarker, hotel: Hotel) {
    this.activeHotelInfoWindow = infoWindow;
    infoWindow.open(marker);
    this.infoWindowHotel.set(hotel);
  }

  closeHotelInfoWindow(infoWindow = this.activeHotelInfoWindow) {
    infoWindow?.close();
    this.activeHotelInfoWindow = undefined;
    this.infoWindowHotel.set(null);
  }

  clearHotelInfoWindow() {
    this.activeHotelInfoWindow = undefined;
    this.infoWindowHotel.set(null);
  }

  openHotelDetail(hotel: Hotel) {
    this.closeHotelInfoWindow();
    this.details.emit(hotel);
  }

  private fitHotelsOnMap(hotels: readonly Hotel[]) {
    const map = this.map();

    if (!map) {
      return;
    }

    const bounds = createHotelBounds(hotels);

    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, this.mapBoundsPadding);
  }
}
