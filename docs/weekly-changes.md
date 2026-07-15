# Weekly Changes

## 1) Hotel Detail Dialog Refactor

The hotel detail popup was refactored so `HotelInfoWindow` opens the detail view directly with Angular Material `MatDialog`.

Before this change, clicking **See Details** in the info window emitted an event through multiple parent components:

`HotelInfoWindow` -> `HotelMap2dView` / `HotelMap3dView` -> `HotelMap` -> inline `<app-hotel-detail>` rendering.

`HotelMap` also kept a `selectedHotel` signal and rendered the detail component manually:

```angular-html
@if (selectedHotel(); as hotel) {
  <app-hotel-detail [hotel]="hotel" (closed)="closeHotelDetail()"> </app-hotel-detail>
}
```

This was replaced with a direct dialog flow:

`HotelInfoWindow` -> `MatDialog.open(HotelDetail)`

What changed:

- Removed `detailsRequested`, `hotelDetailsRequested`, `selectedHotel`, and the inline detail rendering from `HotelMap`.
- `HotelInfoWindow` now opens `HotelDetail` directly using its current `hotel()` input.
- `HotelDetail` now receives the hotel through `MAT_DIALOG_DATA` and closes through `MatDialogRef`.
- The custom detail overlay wrapper was removed because Angular Material now owns the dialog shell, backdrop, focus behavior, and close lifecycle.
- Added Angular Material dialog setup, animation provider, prebuilt theme import, and dialog panel styling.
