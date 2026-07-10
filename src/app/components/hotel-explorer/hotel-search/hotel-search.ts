import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Hotel } from '../../../models/hotel.model';
import { HotelSearchService } from '../../../services/hotel-search.service';

@Component({
  selector: 'app-hotel-search',
  imports: [],
  templateUrl: './hotel-search.html',
  styleUrl: './hotel-search.scss',
})
export class HotelSearch {
  private readonly hotelSearchService = inject(HotelSearchService);

  hotels = input.required<readonly Hotel[]>();
  hotelSelected = output<Hotel>();
  defaultViewSelected = output<void>();

  readonly query = signal('');
  private readonly hasSelection = signal(false);
  readonly results = computed(() =>
    this.hasSelection() ? [] : this.hotelSearchService.searchByName(this.hotels(), this.query()),
  );

  updateQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.hasSelection.set(false);
    this.query.set(input.value);
  }

  selectHotel(hotel: Hotel) {
    this.hotelSelected.emit(hotel);
    this.hasSelection.set(true);
    this.query.set(hotel.name);
  }

  selectDefaultView() {
    this.defaultViewSelected.emit();
  }
}
