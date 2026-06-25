import { Component } from '@angular/core';
import { MapComponent } from './components/map/map';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
