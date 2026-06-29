import { Component, ViewChild, inject } from '@angular/core';
import { HotelSearch } from './components/hotel-search/hotel-search';
import { MapComponent } from './components/map/map';
import { Hotel } from './models/hotel.model';
import { HotelService } from './services/hotel.service';

@Component({
  selector: 'app-root',
  imports: [MapComponent, HotelSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly hotelService = inject(HotelService);

  readonly hotels = this.hotelService.getHotels();

  @ViewChild(MapComponent) private mapComponent?: MapComponent;

  focusHotel(hotel: Hotel) {
    this.mapComponent?.focusHotel(hotel);
  }

  showDefaultView() {
    this.mapComponent?.fitHotelsOnMap();
  }
}
