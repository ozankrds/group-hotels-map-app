import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../environments/environment.development';
import { HotelService } from '../../services/hotel.service';
import { createHotelBounds } from '../../shared/utils/map-bounds.util';

type GoogleMapsBootstrap = {
  Map?: unknown;
  importLibrary?: (libraryName: string) => Promise<unknown>;
  __ib__?: () => void;
};

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  private readonly hotelService = inject(HotelService);
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
      await this.loadMapsLibrary();
      this.apiLoaded.set(true);
    } catch (error) {
      console.error('Google Maps script could not be loaded', error);
      this.apiLoadError.set('Google Maps script dosyasi yuklenemedi.');
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

  private async loadMapsLibrary() {
    const maps = this.getGoogleMapsNamespace();

    if (maps.Map) {
      return;
    }

    if (!maps.importLibrary) {
      this.installGoogleMapsBootstrapLoader(maps);
    }

    await maps.importLibrary?.('maps');
  }

  private getGoogleMapsNamespace(): GoogleMapsBootstrap {
    const googleWindow = window as Window & {
      google?: { maps?: GoogleMapsBootstrap };
    };

    googleWindow.google ??= {};
    googleWindow.google.maps ??= {};

    return googleWindow.google.maps;
  }

  private installGoogleMapsBootstrapLoader(maps: GoogleMapsBootstrap) {
    let scriptPromise: Promise<void> | undefined;
    const requestedLibraries = new Set<string>();

    const bootstrapImportLibrary = (libraryName: string) => {
      requestedLibraries.add(libraryName);

      scriptPromise ??= new Promise<void>((resolve, reject) => {
        const params = new URLSearchParams({
          key: environment.googleMapsApiKey,
          v: 'weekly',
          libraries: [...requestedLibraries].join(','),
          callback: 'google.maps.__ib__',
        });

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Google Maps JavaScript API could not load.'));

        maps.__ib__ = resolve;
        document.head.append(script);
      });

      return scriptPromise.then(() => {
        if (maps.importLibrary === bootstrapImportLibrary) {
          throw new Error('Google Maps importLibrary was not installed by the API script.');
        }

        return maps.importLibrary?.(libraryName) ?? Promise.resolve();
      });
    };

    maps.importLibrary = bootstrapImportLibrary;
  }
}
