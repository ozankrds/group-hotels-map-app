import { Component, input, output } from '@angular/core';
import { Hotel } from '../../../../models/hotel.model';

@Component({
  selector: 'app-hotel-detail',
  imports: [],
  templateUrl: './hotel-detail.html',
  styleUrl: './hotel-detail.scss',
})
export class HotelDetail {
  hotel = input.required<Hotel>();
  closed = output<void>();

  close() {
    this.closed.emit();
  }
}
