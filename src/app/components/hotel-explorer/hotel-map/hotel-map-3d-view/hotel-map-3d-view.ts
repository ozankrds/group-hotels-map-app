import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { Hotel } from '../../../../models/hotel.model';
import {
  HotelMapPoint,
} from '../../../../shared/utils/hotel-marker.util';
import { GmpMarker3dInteractiveClick } from '../../../map-3d/gmp-marker-3d-interactive-click';
import { Map3dComponent } from '../../../map-3d/map-3d';
import { HotelInfoWindow } from '../hotel-info-window/hotel-info-window';

@Component({
  selector: 'app-hotel-map-3d-view',
  imports: [GmpMarker3dInteractiveClick, Map3dComponent, HotelInfoWindow],
  templateUrl: './hotel-map-3d-view.html',
  styleUrl: './hotel-map-3d-view.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotelMap3dView {
  readonly center = input.required<google.maps.LatLngLiteral>();
  readonly focusHotels = input.required<readonly Hotel[]>();
  readonly mapId = input<string | undefined>();
  readonly points = input.required<readonly HotelMapPoint[]>();

  readonly details = output<Hotel>();

  readonly popoverHotel = signal<Hotel | null>(null);

  private readonly map = signal<google.maps.maps3d.Map3DElement | null>(null);

  private readonly cameraEffect = effect(() => {
    const map = this.map();

    if (!map) {
      return;
    }

    this.clearPopover();
    this.fitHotelsOnMap(map, this.focusHotels());
  });

  handleMapReady(map: google.maps.maps3d.Map3DElement) {
    this.map.set(map);
  }

  openHotelPopover(
    popover: HTMLElement,
    marker: google.maps.maps3d.Marker3DInteractiveElement,
    hotel: Hotel,
  ) {
    this.popoverHotel.set(hotel);
    const hotelPopover = popover as google.maps.maps3d.PopoverElement;
    hotelPopover.open = false;

    setTimeout(() => {
      hotelPopover.positionAnchor = marker;
      hotelPopover.open = true;
    }, 0);
  }

  closePopover(popover: HTMLElement) {
    (popover as google.maps.maps3d.PopoverElement).open = false;
    this.popoverHotel.set(null);
  }

  openHotelDetail(hotel: Hotel, popover: HTMLElement) {
    this.closePopover(popover);
    this.details.emit(hotel);
  }

  private fitHotelsOnMap(map: google.maps.maps3d.Map3DElement, hotels: readonly Hotel[]) {
    if (!hotels.length) {
      map.center = { ...this.center(), altitude: 0 };
      map.range = 2500000;
      return;
    }

    const focus = calculateHotelFocus(hotels);
    map.center = {
      lat: focus.center.lat,
      lng: focus.center.lng,
      altitude: 0,
    };
    map.heading = 0;
    map.range = focus.range;
    map.tilt = hotels.length === 1 ? 65 : 50;
  }

  private clearPopover() {
    this.popoverHotel.set(null);
  }
}

function calculateHotelFocus(hotels: readonly Hotel[]) {
  const latitudes = hotels.map((hotel) => hotel.latitude);
  const longitudes = hotels.map((hotel) => hotel.longitude);
  const center = {
    lat: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    lng: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
  };

  const farthestDistance = Math.max(
    ...hotels.map((hotel) =>
      calculateDistanceInMeters(center, {
        lat: hotel.latitude,
        lng: hotel.longitude,
      }),
    ),
  );

  return {
    center,
    range: Math.max(3500, farthestDistance * 2.8),
  };
}

function calculateDistanceInMeters(
  first: google.maps.LatLngLiteral,
  second: google.maps.LatLngLiteral,
): number {
  const earthRadiusInMeters = 6371000;
  const latDelta = toRadians(second.lat - first.lat);
  const lngDelta = toRadians(second.lng - first.lng);
  const firstLat = toRadians(first.lat);
  const secondLat = toRadians(second.lat);
  const halfChordLength =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(firstLat) * Math.cos(secondLat) * Math.sin(lngDelta / 2) ** 2;

  return (
    earthRadiusInMeters * 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength))
  );
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
