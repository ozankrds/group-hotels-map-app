import { Component, ViewChild, inject } from '@angular/core';
import { HotelMap } from './components/hotel-map/hotel-map';
import { HotelSearch } from './components/hotel-search/hotel-search';
import { Hotel } from './models/hotel.model';
import { HotelService } from './services/hotel.service';

@Component({
  selector: 'app-root',
  imports: [HotelMap, HotelSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly hotelService = inject(HotelService);

  readonly hotels = this.hotelService.getHotels();

  @ViewChild(HotelMap) private hotelMap?: HotelMap;

  focusHotel(hotel: Hotel) {
    this.hotelMap?.focusHotel(hotel);
  }

  showDefaultView() {
    this.hotelMap?.fitHotelsOnMap();
  }
}
