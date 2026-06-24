import { Hotel } from '../models/hotel.model';

export const hotels: Hotel[] = [
  {
    id: 1,
    name: 'Birinci Otel',
    rating: 4.5,
    segment: 'Segment 1',
    imageUrl: 'Image Url 1',
    latitude: 36.895872,
    longitude: 30.629969,
  },
  {
    id: 2,
    name: 'İkinci Otel',
    rating: 4.7,
    segment: 'Segment 2',
    imageUrl: 'Image Url 3',
    latitude: 36.886255,
    longitude: 30.652088,
  },
  {
    id: 3,
    name: 'Üçüncü Otel',
    rating: 4.2,
    segment: 'Segment 2',
    imageUrl: 'Image Url 3',
    latitude: 36.903277,
    longitude: 30.644887,
  },
];
