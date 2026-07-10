import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelExplorer } from './hotel-explorer';

describe('HotelExplorer', () => {
  let component: HotelExplorer;
  let fixture: ComponentFixture<HotelExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelExplorer],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelExplorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
