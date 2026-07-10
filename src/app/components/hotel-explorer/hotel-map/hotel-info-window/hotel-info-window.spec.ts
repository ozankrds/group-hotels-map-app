import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInfoWindow } from './hotel-info-window';

describe('HotelInfoWindow', () => {
  let component: HotelInfoWindow;
  let fixture: ComponentFixture<HotelInfoWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelInfoWindow],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelInfoWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
