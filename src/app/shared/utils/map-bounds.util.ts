import { Hotel } from '../../models/hotel.model';
import { Map3dCamera } from '../../models/map-3d-camera.model';

const singleHotelBoundsOffset = 0.01;

const earthMetersPerLatitudeDegree = 111_320;
const maximum3dRange = 2_500_000;
const minimum3dRange = 3_500;
const map3dRangePadding = 1.4;
const worldBoundsLiteral: HotelBoundsLiteral = {
  east: 179.999,
  north: 85,
  south: -85,
  west: -179.999,
};
const world3dRange = 20_000_000;

type HotelBoundsLiteral = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export function createHotelBounds(hotels: readonly Hotel[]): google.maps.LatLngBounds {
  if (hotels.length === 0) {
    return createLatLngBounds(worldBoundsLiteral);
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

export function createHotelMap3dCamera(hotels: readonly Hotel[]): Map3dCamera {
  const bounds = createHotelBoundsLiteral(hotels);

  if (!bounds) {
    return createWorldMap3dCamera();
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

  if (range > maximum3dRange) {
    return createWorldMap3dCamera();
  }

  return {
    center: { ...center, altitude: 0 },
    heading: 0,
    range,
    tilt: hotels.length === 1 ? 65 : 50,
  };
}

function createLatLngBounds(bounds: HotelBoundsLiteral): google.maps.LatLngBounds {
  const latLngBounds = new google.maps.LatLngBounds();

  latLngBounds.extend({ lat: bounds.south, lng: bounds.west });
  latLngBounds.extend({ lat: bounds.north, lng: bounds.east });

  return latLngBounds;
}

function createWorldMap3dCamera(): Map3dCamera {
  return {
    center: { lat: 0, lng: 0, altitude: 0 },
    heading: 0,
    range: world3dRange,
    tilt: 0,
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
