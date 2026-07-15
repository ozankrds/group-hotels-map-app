import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  constructor() {
    setOptions({
      key: environment.googleMapsApiKey,
      v: 'weekly',
    });
  }

  async load2d(): Promise<void> {
    await importLibrary('maps');
  }

  async load3d(): Promise<google.maps.Maps3DLibrary> {
    return await importLibrary('maps3d');
  }
}
