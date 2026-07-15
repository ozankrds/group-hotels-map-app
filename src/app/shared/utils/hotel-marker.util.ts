import { Hotel } from '../../models/hotel.model';
import { HotelMarker } from '../../models/hotel-marker.model';

const hotelMarkerIconUrl = '/building.png';

export function createHotelMarkers(hotels: readonly Hotel[]): readonly HotelMarker[] {
  return hotels.map((hotel) => ({
    id: hotel.id,
    hotel,
    title: hotel.name,
    position2d: {
      lat: hotel.latitude,
      lng: hotel.longitude,
    },
    position3d: `${hotel.latitude},${hotel.longitude},0`,
    content: createHotelMarkerContent(hotel),
  }));
}

function createHotelMarkerContent(hotel: Hotel): HTMLElement {
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = 'hotel-map-marker';
  marker.setAttribute('aria-label', hotel.name);

  const icon = document.createElement('img');
  icon.className = 'hotel-map-marker__icon';
  icon.src = hotelMarkerIconUrl;
  icon.alt = '';
  icon.decoding = 'async';
  icon.draggable = false;

  marker.append(icon);

  return marker;
}
