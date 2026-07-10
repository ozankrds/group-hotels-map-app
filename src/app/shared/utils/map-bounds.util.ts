import { Hotel } from '../../models/hotel.model';

const singleHotelBoundsOffset = 0.01;

export function createHotelBounds(hotels: readonly Hotel[]): google.maps.LatLngBounds | null {
  if (hotels.length === 0) {
    return null;
  }

  const bounds = new google.maps.LatLngBounds();

  if (hotels.length === 1) {
    const [hotel] = hotels;

    bounds.extend({
      lat: hotel.latitude - singleHotelBoundsOffset,
      lng: hotel.longitude - singleHotelBoundsOffset,
    });
    bounds.extend({
      lat: hotel.latitude + singleHotelBoundsOffset,
      lng: hotel.longitude + singleHotelBoundsOffset,
    });

    return bounds;
  }

  for (const hotel of hotels) {
    bounds.extend({
      lat: hotel.latitude,
      lng: hotel.longitude,
    });
  }

  return bounds;
}
