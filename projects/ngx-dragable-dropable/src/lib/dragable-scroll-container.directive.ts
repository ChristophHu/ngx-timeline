import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mwlDraggableScrollContainer]',
  standalone: true
})
export class DragableScrollContainerDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
