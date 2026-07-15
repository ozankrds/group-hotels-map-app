import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hotel } from '../../../../models/hotel.model';

@Component({
  selector: 'app-hotel-detail',
  imports: [],
  templateUrl: './hotel-detail.html',
  styleUrl: './hotel-detail.scss',
})
export class HotelDetail {
  private readonly dialogRef = inject(MatDialogRef<HotelDetail>);

  readonly hotel = signal(inject<Hotel>(MAT_DIALOG_DATA));

  close() {
    this.dialogRef.close();
  }
}
