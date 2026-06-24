import { Injectable } from '@angular/core';
import { hotels } from '../mocks/hotels.mock';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  getHotels(): readonly Hotel[] {
    return hotels;
  }
}
