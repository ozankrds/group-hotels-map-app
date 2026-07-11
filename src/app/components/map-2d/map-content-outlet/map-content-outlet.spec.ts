import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapContentOutlet } from './map-content-outlet';

describe('MapContentOutlet', () => {
  let component: MapContentOutlet;
  let fixture: ComponentFixture<MapContentOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapContentOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(MapContentOutlet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
