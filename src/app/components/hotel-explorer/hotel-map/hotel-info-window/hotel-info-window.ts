import { Component, computed, input, output } from '@angular/core';
import { Hotel } from '../../../../models/hotel.model';

@Component({
  selector: 'app-hotel-info-window',
  imports: [],
  templateUrl: './hotel-info-window.html',
  styleUrl: './hotel-info-window.scss',
})
export class HotelInfoWindow {
  hotel = input.required<Hotel>();
  detailsRequested = output<void>();
  closed = output<void>();

  readonly rows = computed(() => {
    const hotel = this.hotel();

    return [{ label: 'Rating', value: hotel.rating }];
  });

  requestDetails() {
    this.detailsRequested.emit();
  }

  close() {
    this.closed.emit();
  }
}
