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

Data flow: `HotelInfoWindow` passes the current hotel through the dialog `data` option, Angular Material provides that value through `MAT_DIALOG_DATA`, and `HotelDetail` injects it to render the selected hotel. `HotelDetail` also injects `MatDialogRef<HotelDetail>` so it can close its own dialog instance.

What changed:

- Removed `detailsRequested`, `hotelDetailsRequested`, `selectedHotel`, and the inline detail rendering from `HotelMap`.
- `HotelInfoWindow` now opens `HotelDetail` directly using its current `hotel()` input.
- `HotelDetail` now receives the hotel through `MAT_DIALOG_DATA` and closes through `MatDialogRef`.
- The custom detail overlay wrapper was removed because Angular Material now owns the dialog shell, backdrop, focus behavior, and close lifecycle.
- Added Angular Material dialog setup, animation provider, prebuilt theme import, and dialog panel styling.
- Restored the detail popup size to the previous near-full-page layout using viewport-based dialog width and height.

## 2) Map Marker Rendering Responsibility

The shared 2D and 3D map components were updated so they are responsible for rendering hotel markers directly.

Before this change, `HotelMap2dView` and `HotelMap3dView` passed marker data into their own templates and rendered map-specific marker elements there:

`HotelMap2dView` -> `<map-advanced-marker>`

`HotelMap3dView` -> `<gmp-marker-3d-interactive>`

This made `app-map-2d` and `app-map-3d` too generic because marker rendering still belonged to the hotel-specific view components.

The marker rendering flow is now:

`HotelMap` -> `HotelMap2dView` / `HotelMap3dView` -> `app-map-2d` / `app-map-3d` -> rendered map markers

`HotelMap2dView` and `HotelMap3dView` still provide hotel marker data and keep the hotel info window / popover behavior, but the actual marker elements are now created inside the reusable map components.

What changed:

- Moved the `HotelMarker` interface into `src/app/models/hotel-marker.model.ts`.
- `hotel-marker.util.ts` now only creates hotel marker data and imports the marker model.
- `app-map-2d` now accepts a `markers` input and renders `<map-advanced-marker>` elements internally.
- `app-map-3d` now accepts a `markers` input and renders `<gmp-marker-3d-interactive>` elements internally.
- Both map components emit marker click events so the hotel views can still open the correct info window or popover for the selected hotel.
- Removed the marker rendering loops from `HotelMap2dView` and `HotelMap3dView`.
