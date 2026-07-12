import { Hotel } from '../../models/hotel.model';
import { createHotelMap3dCamera } from './map-bounds.util';

describe('map bounds utilities', () => {
  const fallbackCenter: google.maps.LatLngLiteral = { lat: 39.92077, lng: 32.85411 };

  it('uses the default 3D camera when there are no hotels', () => {
    const camera = createHotelMap3dCamera([], fallbackCenter);

    expect(camera).toEqual({
      center: { ...fallbackCenter, altitude: 0 },
      heading: 0,
      range: 2_500_000,
      tilt: 50,
    });
  });

  it('fits a nearby hotel group in 3D', () => {
    const camera = createHotelMap3dCamera(
      [
        createHotel({ id: 1, latitude: 36.895872, longitude: 30.629969 }),
        createHotel({ id: 2, latitude: 36.903277, longitude: 30.644887 }),
      ],
      fallbackCenter,
    );

    expect(camera.center).toEqual({
      lat: 36.8995745,
      lng: 30.637428,
      altitude: 0,
    });
    expect(camera.range).toBeGreaterThanOrEqual(3_500);
    expect(camera.range).toBeLessThan(2_500_000);
    expect(camera.tilt).toBe(50);
  });

  it('uses the default 3D camera instead of fitting over-wide hotel bounds', () => {
    const camera = createHotelMap3dCamera(
      [
        createHotel({ id: 1, latitude: 36.895872, longitude: 30.629969 }),
        createHotel({ id: 2, latitude: -33.8688, longitude: 151.2093 }),
      ],
      fallbackCenter,
    );

    expect(camera).toEqual({
      center: { ...fallbackCenter, altitude: 0 },
      heading: 0,
      range: 2_500_000,
      tilt: 50,
    });
  });

  it('uses a closer, tilted camera for a single hotel', () => {
    const camera = createHotelMap3dCamera(
      [createHotel({ id: 1, latitude: 36.895872, longitude: 30.629969 })],
      fallbackCenter,
    );

    expect(camera.center).toEqual({
      lat: 36.895872,
      lng: 30.629969,
      altitude: 0,
    });
    expect(camera.range).toBeGreaterThan(3_500);
    expect(camera.range).toBeLessThan(2_500_000);
    expect(camera.tilt).toBe(65);
  });
});

function createHotel(overrides: Pick<Hotel, 'id' | 'latitude' | 'longitude'>): Hotel {
  return {
    id: overrides.id,
    name: `Hotel ${overrides.id}`,
    rating: 4,
    segment: 'Segment',
    imageUrl: '',
    description: '',
    latitude: overrides.latitude,
    longitude: overrides.longitude,
  };
}
