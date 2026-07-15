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
    this.dialog.open(HotelDetail, {
      data: this.hotel(),
      width: 'min(940px, calc(100vw - 32px))',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 32px)',
      panelClass: 'hotel-detail-dialog',
      autoFocus: 'dialog',
    });
    this.closed.emit();
  }

  close() {
    this.closed.emit();
  }
}
