import { Component, computed, inject, input, output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Hotel } from '../../../../models/hotel.model';
import { HotelDetail } from '../hotel-detail/hotel-detail';

@Component({
  selector: 'app-hotel-info-window',
  imports: [MatDialogModule],
  templateUrl: './hotel-info-window.html',
  styleUrl: './hotel-info-window.scss',
})
export class HotelInfoWindow {
  private readonly dialog = inject(MatDialog);

  hotel = input.required<Hotel>();
  closed = output<void>();

  readonly rows = computed(() => {
    const hotel = this.hotel();

    return [{ label: 'Rating', value: hotel.rating }];
  });

  requestDetails() {
    const dialogMargin = 'clamp(32px, 6vw, 84px)';

    this.dialog.open(HotelDetail, {
      data: this.hotel(),
      width: `calc(100vw - ${dialogMargin})`,
      height: `calc(100vh - ${dialogMargin})`,
      maxWidth: `calc(100vw - ${dialogMargin})`,
      maxHeight: `calc(100vh - ${dialogMargin})`,
      panelClass: 'hotel-detail-dialog',
      autoFocus: 'dialog',
    });
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
