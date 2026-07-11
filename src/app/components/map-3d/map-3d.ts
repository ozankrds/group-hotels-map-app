import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';

@Component({
  selector: 'app-map-3d',
  imports: [NgTemplateOutlet],
  templateUrl: './map-3d.html',
  styleUrl: './map-3d.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Map3dComponent implements OnInit, OnDestroy {
  private readonly googleMapsLoader = inject(GoogleMapsLoaderService);

  readonly center = input<google.maps.LatLngLiteral>({ lat: 39.92077, lng: 32.85411 });
  readonly centerAltitude = input(1200);
  readonly heading = input(0);
  readonly mapId = input<string | undefined>();
  readonly mode = input<google.maps.maps3d.MapModeString>('HYBRID');
  readonly range = input(2500000);
  readonly tilt = input(55);

  readonly mapReady = output<google.maps.maps3d.Map3DElement>();
  readonly loadError = output<string>();

  readonly apiLoadError = signal<string | null>(null);
  readonly apiLoaded = signal(false);
  readonly mapElement = signal<google.maps.maps3d.Map3DElement | null>(null);

  readonly centerAttribute = computed(() => {
    const center = this.center();

    return `${center.lat},${center.lng},${this.centerAltitude()}`;
  });

  @ContentChild(TemplateRef) contentTemplate?: TemplateRef<unknown>;

  @ViewChild('map3d') set map3dElement(
    map3dElement: ElementRef<google.maps.maps3d.Map3DElement> | undefined,
  ) {
    const map = map3dElement?.nativeElement ?? null;
    this.mapElement.set(map);

    if (map) {
      this.mapReady.emit(map);
    }
  }

  private readonly syncMapOptionsEffect = effect(() => {
    const map = this.mapElement();

    if (!map) {
      return;
    }

    const center = this.center();
    map.center = {
      lat: center.lat,
      lng: center.lng,
      altitude: this.centerAltitude(),
    };
    map.heading = this.heading();
    map.mapId = this.mapId() ?? null;
    map.mode = this.mode();
    map.range = this.range();
    map.tilt = this.tilt();
  });

  ngOnInit() {
    void this.loadGoogleMapsApi();
  }

  ngOnDestroy() {
    this.mapElement.set(null);
  }

  async loadGoogleMapsApi() {
    this.apiLoadError.set(null);

    try {
      await this.googleMapsLoader.load3d();
      this.apiLoaded.set(true);
    } catch (error) {
      console.error('Google Maps 3D script could not be loaded', error);
      const errorMessage = error instanceof Error ? ` ${error.message}` : '';
      const loadError = `Google Maps 3D haritasi yuklenemedi.${errorMessage}`;
      this.apiLoadError.set(loadError);
      this.loadError.emit(loadError);
    }
  }
}
