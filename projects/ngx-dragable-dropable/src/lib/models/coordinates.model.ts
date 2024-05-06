import { ReplaySubject } from "rxjs"

export interface Coordinates {
    x: number
    y: number
}

export interface DragPointerDownEvent extends Coordinates {}

export interface DragStartEvent {
  cancelDrag$: ReplaySubject<void>
}

export interface DragMoveEvent extends Coordinates {}

export interface DragEndEvent extends Coordinates {
  dragCancelled: boolean
}

export interface ValidateDragParams extends Coordinates {
    transform: {
        x: number
        y: number
    }
}