import { Hotel } from './hotel.model';

export interface HotelMarker {
  id: number;
  hotel: Hotel;
  title: string;
  position2d: google.maps.LatLngLiteral;
  position3d: string;
  content: HTMLElement;
}
