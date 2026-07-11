import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Map3dComponent } from './map-3d';

describe('Map3dComponent', () => {
  let component: Map3dComponent;
  let fixture: ComponentFixture<Map3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Map3dComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Map3dComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
