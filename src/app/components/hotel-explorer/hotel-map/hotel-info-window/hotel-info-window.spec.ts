import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { hotels } from '../../../../mocks/hotels.mock';
import { HotelInfoWindow } from './hotel-info-window';

describe('HotelInfoWindow', () => {
  let component: HotelInfoWindow;
  let fixture: ComponentFixture<HotelInfoWindow>;
  let dialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HotelInfoWindow],
      providers: [{ provide: MatDialog, useValue: dialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelInfoWindow);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hotel', hotels[0]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open hotel details from the current hotel', () => {
    component.requestDetails();

    expect(dialog.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ data: hotels[0] }),
    );
  });
});
