import { Injectable } from '@angular/core';
import { Lane } from '../models/lane.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxTimelineService {
  private readonly _lanes = new BehaviorSubject<Lane[]>([])
  lanes$: Observable<Lane[]> = this._lanes.asObservable()

  constructor() {
    // this.lanes$.subscribe({
    //   next: data => console.log(data)
    // })
  }

  setLanes(lanes: Lane[]) {
    this._lanes.next(lanes)
  }
}
