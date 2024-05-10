export interface DropEvent<T = any> {
    dropData: T;
    clientX: number;
    clientY: number;
    target: EventTarget;
  }