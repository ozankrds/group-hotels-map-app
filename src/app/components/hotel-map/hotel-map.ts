import { Component, inject, signal } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { environment } from '../../environments/environment.development';
import { Hotel } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';
import { createHotelMarkers } from '../../shared/utils/hotel-marker.util';
import { createHotelBounds } from '../../shared/utils/map-bounds.util';
import { HotelDetail } from '../hotel-detail/hotel-detail';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-hotel-map',
  imports: [GoogleMapsModule, MapComponent, HotelDetail, HotelInfoWindow],
  templateUrl: './hotel-map.html',
  styleUrl: './hotel-map.scss',
})
export class HotelMap {
  private readonly hotelService = inject(HotelService);
  private readonly mapBoundsPadding = 48;

  readonly hotels = this.hotelService.getHotels();
  readonly hotelMarkers = createHotelMarkers(this.hotels);

  readonly center: google.maps.LatLngLiteral = { lat: 39.92077, lng: 32.85411 };
  readonly zoom = 6;
  readonly mapId = environment.googleMapsMapId;

  readonly hotelInfoWindowOptions: google.maps.InfoWindowOptions = {
    headerDisabled: true,
    maxWidth: 260,
  };

  infoWindowHotel = signal<Hotel | null>(null);
  selectedHotel = signal<Hotel | null>(null);

  private map?: google.maps.Map;
  private activeHotelInfoWindow?: MapInfoWindow;

  handleMapReady(map: google.maps.Map) {
    this.map = map;
    this.fitHotelsOnMap();
  }

  showHotelsOnMap(hotels: readonly Hotel[] = this.hotels) {
    this.closeHotelInfoWindow();
    this.selectedHotel.set(null);
    this.fitHotelsOnMap(hotels);
  }

  private fitHotelsOnMap(hotels: readonly Hotel[] = this.hotels) {
    if (!this.map) {
      return;
    }

    const bounds = createHotelBounds(hotels);

    if (!bounds) {
      return;
    }

    this.map.fitBounds(bounds, this.mapBoundsPadding);
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
    this.selectedHotel.set(hotel);
  }

  closeHotelDetail() {
    this.selectedHotel.set(null);
  }
}
