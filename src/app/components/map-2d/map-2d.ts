import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  OnInit,
  TemplateRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { MapContentOutlet } from './map-content-outlet/map-content-outlet';

@Component({
  selector: 'app-map-2d',
  imports: [GoogleMapsModule, CommonModule, MapContentOutlet],
  templateUrl: './map-2d.html',
  styleUrl: './map-2d.scss',
})
export class Map2dComponent implements OnInit {
  private readonly googleMapsLoader = inject(GoogleMapsLoaderService);

  readonly center = input<google.maps.LatLngLiteral>({ lat: 39.92077, lng: 32.85411 });
  readonly zoom = input(6);
  readonly mapId = input<string | undefined>();
  readonly options = input<google.maps.MapOptions>({});

  readonly mapReady = output<google.maps.Map>();
  readonly loadError = output<string>();

  apiLoaded = signal(false);
  apiLoadError = signal<string | null>(null);

  @ContentChild(TemplateRef) contentTemplate?: TemplateRef<unknown>;

  ngOnInit() {
    void this.loadGoogleMapsApi();
  }

  async loadGoogleMapsApi() {
    this.apiLoadError.set(null);

    try {
      await this.googleMapsLoader.load2d();
      this.apiLoaded.set(true);
    } catch (error) {
      console.error('Google Maps script could not be loaded', error);
      const errorMessage = error instanceof Error ? ` ${error.message}` : '';
      const loadError = `Google Maps script dosyasi yuklenemedi.${errorMessage}`;
      this.apiLoadError.set(loadError);
      this.loadError.emit(loadError);
    }
  }

  handleMapsAuthFailure() {
    this.apiLoaded.set(false);
    const loadError = 'Google Maps API key veya billing ayarlarinda yetkilendirme hatasi var.';
    this.apiLoadError.set(loadError);
    this.loadError.emit(loadError);
  }

  handleMapInitialized(map: google.maps.Map) {
    this.mapReady.emit(map);
  }
}
