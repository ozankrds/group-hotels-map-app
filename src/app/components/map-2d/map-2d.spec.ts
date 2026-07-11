import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Map2dComponent } from './map-2d';

describe('Map2dComponent', () => {
  let component: Map2dComponent;
  let fixture: ComponentFixture<Map2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Map2dComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Map2dComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
