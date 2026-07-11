import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
  selector: 'gmp-marker-3d-interactive',
})
export class GmpMarker3dInteractiveClick {
  private readonly elementRef =
    inject<ElementRef<google.maps.maps3d.Marker3DInteractiveElement>>(ElementRef);

  @Output() readonly gmpClick = new EventEmitter<google.maps.maps3d.Marker3DInteractiveElement>();

  @HostListener('gmp-click')
  handleGmpClick() {
    this.gmpClick.emit(this.elementRef.nativeElement);
  }

  @HostListener('click')
  handleClick() {
    this.gmpClick.emit(this.elementRef.nativeElement);
  }
}
