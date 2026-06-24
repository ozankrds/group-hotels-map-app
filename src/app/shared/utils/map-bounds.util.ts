import { Hotel } from '../../models/hotel.model';

export function createHotelBounds(hotels: readonly Hotel[]): google.maps.LatLngBounds | null {
  if (hotels.length === 0) {
    return null;
  }

  const bounds = new google.maps.LatLngBounds();

  for (const hotel of hotels) {
    bounds.extend({
      lat: hotel.latitude,
      lng: hotel.longitude,
    });
  }

  return bounds;
}
