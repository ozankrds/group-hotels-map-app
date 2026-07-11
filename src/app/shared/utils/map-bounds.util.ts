import { Hotel } from '../../models/hotel.model';

const singleHotelBoundsOffset = 0.01;

const earthMetersPerLatitudeDegree = 111_320;
const default3dRange = 2_500_000;
const minimum3dRange = 3_500;
const map3dRangePadding = 1.4;

export type HotelMap3dCamera = {
  center: google.maps.LatLngAltitudeLiteral;
  heading: number;
  range: number;
  tilt: number;
};

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

export function createHotelMap3dCamera(
  hotels: readonly Hotel[],
  fallbackCenter: google.maps.LatLngLiteral,
): HotelMap3dCamera {
  const bounds = createHotelBounds(hotels);

  if (!bounds) {
    return {
      center: { ...fallbackCenter, altitude: 0 },
      heading: 0,
      range: default3dRange,
      tilt: 50,
    };
  }

  const center = bounds.getCenter().toJSON();
  const span = bounds.toSpan().toJSON();
  const latSpanInMeters = span.lat * earthMetersPerLatitudeDegree;
  const lngSpanInMeters =
    span.lng * earthMetersPerLatitudeDegree * Math.cos((center.lat * Math.PI) / 180);
  const diagonalSpanInMeters = Math.hypot(latSpanInMeters, lngSpanInMeters);

  return {
    center: { ...center, altitude: 0 },
    heading: 0,
    range: Math.max(minimum3dRange, diagonalSpanInMeters * map3dRangePadding),
    tilt: hotels.length === 1 ? 65 : 50,
  };
}
