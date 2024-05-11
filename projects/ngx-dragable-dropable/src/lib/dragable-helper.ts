import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CurrentDragData {
  clientX: number;
  clientY: number;
  dropData: any;
  target: EventTarget;
}

@Injectable({
  providedIn: 'root'
})
export class DragableHelper {
  currentDrag = new Subject<Subject<CurrentDragData>>()
}
