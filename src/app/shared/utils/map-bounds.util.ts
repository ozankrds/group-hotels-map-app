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

type HotelBoundsLiteral = {
  east: number;
  north: number;
  south: number;
  west: number;
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
  const bounds = createHotelBoundsLiteral(hotels);

  if (!bounds) {
    return createDefaultMap3dCamera(fallbackCenter);
  }

  const center = {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
  const span = {
    lat: bounds.north - bounds.south,
    lng: bounds.east - bounds.west,
  };
  const latSpanInMeters = span.lat * earthMetersPerLatitudeDegree;
  const lngSpanInMeters =
    span.lng * earthMetersPerLatitudeDegree * Math.cos((center.lat * Math.PI) / 180);
  const diagonalSpanInMeters = Math.hypot(latSpanInMeters, lngSpanInMeters);
  const range = Math.max(minimum3dRange, diagonalSpanInMeters * map3dRangePadding);

  if (range > default3dRange) {
    return createDefaultMap3dCamera(fallbackCenter);
  }

  return {
    center: { ...center, altitude: 0 },
    heading: 0,
    range,
    tilt: hotels.length === 1 ? 65 : 50,
  };
}

function createDefaultMap3dCamera(center: google.maps.LatLngLiteral): HotelMap3dCamera {
  return {
    center: { ...center, altitude: 0 },
    heading: 0,
    range: default3dRange,
    tilt: 50,
  };
}

function createHotelBoundsLiteral(hotels: readonly Hotel[]): HotelBoundsLiteral | null {
  if (hotels.length === 0) {
    return null;
  }

  if (hotels.length === 1) {
    const [hotel] = hotels;

    return {
      east: hotel.longitude + singleHotelBoundsOffset,
      north: hotel.latitude + singleHotelBoundsOffset,
      south: hotel.latitude - singleHotelBoundsOffset,
      west: hotel.longitude - singleHotelBoundsOffset,
    };
  }

  return hotels.reduce<HotelBoundsLiteral>(
    (bounds, hotel) => ({
      east: Math.max(bounds.east, hotel.longitude),
      north: Math.max(bounds.north, hotel.latitude),
      south: Math.min(bounds.south, hotel.latitude),
      west: Math.min(bounds.west, hotel.longitude),
    }),
    {
      east: hotels[0].longitude,
      north: hotels[0].latitude,
      south: hotels[0].latitude,
      west: hotels[0].longitude,
    },
  );
}
