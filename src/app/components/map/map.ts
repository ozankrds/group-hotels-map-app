import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { HotelService } from '../../services/hotel.service';
import { createHotelBounds } from '../../shared/utils/map-bounds.util';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  private readonly hotelService = inject(HotelService);
  private readonly googleMapsLoader = inject(GoogleMapsLoaderService);
  private readonly mapBoundsPadding = 48;

  readonly hotels = this.hotelService.getHotels();
  apiLoaded = signal(false);
  apiLoadError = signal<string | null>(null);

  center: google.maps.LatLngLiteral = { lat: 39.92077, lng: 32.85411 };
  zoom = 6;

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

  fitHotelsOnMap(map: google.maps.Map) {
    const bounds = createHotelBounds(this.hotels);

    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, this.mapBoundsPadding);
  }
}
