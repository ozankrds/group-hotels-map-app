import { Component } from '@angular/core';
import { HotelExplorer } from './components/hotel-explorer/hotel-explorer';

@Component({
  selector: 'app-root',
  imports: [HotelExplorer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
