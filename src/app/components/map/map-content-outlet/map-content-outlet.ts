import { CommonModule } from '@angular/common';
import { Component, Injector, TemplateRef, computed, inject, input } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-map-content-outlet',
  imports: [CommonModule],
  templateUrl: './map-content-outlet.html',
  styleUrl: './map-content-outlet.scss',
})
export class MapContentOutlet {
  private readonly injector = inject(Injector);

  readonly googleMap = input.required<GoogleMap>();
  readonly content = input<TemplateRef<unknown>>();

  readonly contentInjector = computed(() =>
    Injector.create({
      providers: [{ provide: GoogleMap, useValue: this.googleMap() }],
      parent: this.injector,
    }),
  );
}
