import { Hotel } from '../models/hotel.model';

export const hotels: Hotel[] = [
  {
    id: 1,
    name: 'Birinci Otel',
    rating: 4.5,
    segment: 'Segment 1',
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1676657954811-9409c4830467?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    latitude: 36.895872,
    longitude: 30.629969,
  },
  {
    id: 2,
    name: 'İkinci Otel',
    rating: 4.7,
    segment: 'Segment 2',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    latitude: 36.886255,
    longitude: 30.652088,
  },
  {
    id: 3,
    name: 'Üçüncü Otel',
    rating: 4.2,
    segment: 'Segment 2',
    imageUrl:
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    latitude: 36.903277,
    longitude: 30.644887,
  },
];
