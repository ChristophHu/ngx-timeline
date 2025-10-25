import { Component } from '@angular/core'
import { Lane, NgxTimeline } from '../../../ngx-timeline/src/public-api'

@Component({
  selector: 'app-root',
  imports: [
    NgxTimeline
  ],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  scaler: { startDate: Date, endDate: Date } = { startDate: new Date('2024-05-01T00:00:00'), endDate: new Date('2024-06-03T00:00:00')}
  verticalDrag: boolean = true
  showDateMarker: boolean = true
  lanes: Lane[] = [
    {
      id: '1',
      name: 'Sub 1',
      description: 'Description',
      canDrag: false,
      isExpanded: false,
    },
    {
      id: '2',
      name: 'Sub 2',
      description: 'Description',
      canDrag: false,
      isExpanded: false
    },
    {
      id: '3',
      name: 'Sub 3',
      description: 'Description',
      canDrag: false,
      isExpanded: false
    },
    {
      id: '4',
      name: 'Sub 4',
      description: 'Description',
      canDrag: false,
      isExpanded: false
    },
    {
      id: '5',
      name: 'Sub 5',
      description: 'Description',
      canDrag: false,
      isExpanded: false
    }
  ]
  items: any[] = [
    {
      id: '11',
      lane: '1',
      name: 'Item XY',
      startDate: new Date('2024-05-25T00:00:00'),
      endDate: new Date('2024-05-27T00:00:00'),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      canSwitchLane: true
    },
    {
      id: '12',
      lane: '1',
      name: 'Item2',
      startDate: new Date('2024-05-27T00:00:00'),
      endDate: new Date('2024-05-28T00:00:00'),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true
    },
    {
      id: '13',
      lane: '1',
      name: 'Item3',
      startDate: new Date('2024-05-28T00:00:00'),
      endDate: new Date('2024-06-01T00:00:00'),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true
    },
    {
      id: '21',
      lane: '2',
      name: 'Item',
      startDate: new Date('2024-05-25T00:00:00'),
      endDate: new Date('2024-05-27T00:00:00'),// new Date(),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      canSwitchLane: true
    },
    {
      id: '31',
      lane: '3',
      name: 'Item',
      startDate: new Date('2024-05-01T00:00:00'),
      endDate: new Date('2024-05-04T00:00:00'),// new Date(),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      canSwitchLane: true
    } ,
    {
      id: '51',
      lane: '5',
      name: 'Item',
      startDate: new Date('2024-05-01T00:00:00'),
      endDate: new Date('2024-05-04T00:00:00'),// new Date(),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      canSwitchLane: true
    }
  ]
}
