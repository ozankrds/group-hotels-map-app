import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMap } from './hotel-map';

describe('HotelMap', () => {
  let component: HotelMap;
  let fixture: ComponentFixture<HotelMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelMap],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh focused hotels when showing the default view', () => {
    const previousFocusedHotels = component.focusedHotels();

    component.showHotelsOnMap();

    expect(component.focusedHotels()).not.toBe(previousFocusedHotels);
    expect(component.focusedHotels()).toEqual(component.hotels);
  });
});
