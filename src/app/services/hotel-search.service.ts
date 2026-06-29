import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelSearchService {
  searchByName(hotels: readonly Hotel[], query: string): readonly Hotel[] {
    const normalizedQuery = this.normalize(query);

    if (!normalizedQuery) {
      return [];
    }

    return hotels.filter((hotel) => this.normalize(hotel.name).includes(normalizedQuery));
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase('tr-TR');
  }
}
