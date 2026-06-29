import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { HotelService } from '../../services/hotel.service';
import { createHotelBounds } from '../../shared/utils/map-bounds.util';
import { createHotelMarkers } from '../../shared/utils/hotel-marker.util';
import { Hotel } from '../../models/hotel.model';
import { environment } from '../../environments/environment.development';
import { HotelDetail } from '../hotel-detail/hotel-detail';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule, HotelDetail, HotelInfoWindow],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements OnInit {
  private readonly hotelService = inject(HotelService);
  private readonly googleMapsLoader = inject(GoogleMapsLoaderService);
  private readonly mapBoundsPadding = 48;
  private readonly focusedHotelBoundsOffset = 0.01;

  readonly hotels = this.hotelService.getHotels();
  readonly hotelMarkers = createHotelMarkers(this.hotels);

  apiLoaded = signal(false);
  apiLoadError = signal<string | null>(null);

  center: google.maps.LatLngLiteral = { lat: 39.92077, lng: 32.85411 };
  zoom = 6;
  mapId = environment.googleMapsMapId;
  private map?: google.maps.Map;

  readonly hotelInfoWindowOptions: google.maps.InfoWindowOptions = {
    headerDisabled: true,
    maxWidth: 260,
  };

  @ViewChild(MapInfoWindow) hotelInfoWindow?: MapInfoWindow;
  infoWindowHotel = signal<Hotel | null>(null);
  selectedHotel = signal<Hotel | null>(null);

  ngOnInit() {
    void this.loadGoogleMapsApi();
  }

  async loadGoogleMapsApi() {
    this.apiLoadError.set(null);

    try {
      await this.googleMapsLoader.load();
      this.apiLoaded.set(true);
    } catch (error) {
      console.error('Google Maps script could not be loaded', error);
      const errorMessage = error instanceof Error ? ` ${error.message}` : '';
      this.apiLoadError.set(`Google Maps script dosyasi yuklenemedi.${errorMessage}`);
    }
  }

  handleMapsAuthFailure() {
    this.apiLoaded.set(false);
    this.apiLoadError.set('Google Maps API key veya billing ayarlarinda yetkilendirme hatasi var.');
  }

  fitHotelsOnMap(map = this.map, hotels: readonly Hotel[] = this.hotels) {
    if (!map) {
      return;
    }

    this.map = map;

    const bounds = this.createBoundsForView(hotels);

    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, this.mapBoundsPadding);
  }

  focusHotel(hotel: Hotel) {
    this.closeHotelInfoWindow();
    this.selectedHotel.set(null);
    this.fitHotelsOnMap(this.map, [hotel]);
  }

  openHotelInfoWindow(marker: MapAdvancedMarker, hotel: Hotel) {
    this.hotelInfoWindow?.open(marker);
    this.infoWindowHotel.set(hotel);
  }

  closeHotelInfoWindow() {
    this.hotelInfoWindow?.close();
    this.infoWindowHotel.set(null);
  }

  openHotelDetail(hotel: Hotel) {
    this.hotelInfoWindow?.close();
    this.infoWindowHotel.set(null);
    this.selectedHotel.set(hotel);
  }

  closeHotelDetail() {
    this.selectedHotel.set(null);
  }

  private createBoundsForView(hotels: readonly Hotel[]): google.maps.LatLngBounds | null {
    if (hotels.length !== 1) {
      return createHotelBounds(hotels);
    }

    const [hotel] = hotels;
    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: hotel.latitude - this.focusedHotelBoundsOffset,
      lng: hotel.longitude - this.focusedHotelBoundsOffset,
    });
    bounds.extend({
      lat: hotel.latitude + this.focusedHotelBoundsOffset,
      lng: hotel.longitude + this.focusedHotelBoundsOffset,
    });

    return bounds;
  }
}
