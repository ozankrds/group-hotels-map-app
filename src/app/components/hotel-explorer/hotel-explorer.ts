import { Component, ViewChild, inject } from '@angular/core';
import { Hotel } from '../../models/hotel.model';
import { HotelService } from '../../services/hotel.service';
import { HotelMap } from './hotel-map/hotel-map';
import { HotelSearch } from './hotel-search/hotel-search';

@Component({
  selector: 'app-hotel-explorer',
  imports: [HotelMap, HotelSearch],
  templateUrl: './hotel-explorer.html',
  styleUrl: './hotel-explorer.scss',
})
export class HotelExplorer {
  private readonly hotelService = inject(HotelService);

  readonly hotels = this.hotelService.getHotels();

  @ViewChild(HotelMap) private hotelMap?: HotelMap;

  showHotel(hotel: Hotel) {
    this.hotelMap?.showHotelsOnMap([hotel]);
  }

  showAllHotels() {
    this.hotelMap?.showHotelsOnMap();
  }
}
