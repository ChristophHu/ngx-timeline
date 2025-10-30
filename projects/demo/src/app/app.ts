import { Component } from '@angular/core'
import { Lane, NgxTimeline } from '../../../ngx-timeline/src/public-api'
import { NgxTimelineService } from '../../../ngx-timeline/src/lib/services/ngx-timeline.service'

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
      icon: "https://placehold.co/50x50",
      canDrag: false,
      isExpanded: false,
    },
    {
      id: '2',
      name: 'Sub 2',
      description: 'Description',
      icon: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
      canDrag: false,
      isExpanded: false
    },
    {
      id: '3',
      name: 'Sub 3',
      description: 'Description',
      icon: "https://placehold.jp/50x50.png",
      canDrag: false,
      isExpanded: false
    },
    {
      id: '4',
      name: 'Sub 4',
      description: 'Description',
      icon:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSERIXFhQYHzMhHxwcHz8tLyUzSkFOTUlBSEZSXHZkUldvWEZIZoxob3p9hIWET2ORm4+AmnaBhH//2wBDARYXFx8bHzwhITx/VEhUf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3//wAARCAAyADIDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAECAwQF/8QAJRAAAgIBAwQBBQAAAAAAAAAAAAECAzEEERIhQVFxYRQzUoGR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APeBeyPCxx8FAALOEoreUWvaIUXJ7RTb+AIBLTi9mmn8kAAbRobin5QAnVfefowNdRLldJ/oyA66Zq6t1TysEpLTVNvrNlNLXm2XRLBe1LUVc4ZXYDkbcm28sgErIHbG+lRS5YXhgp9Gvzf8AHISskADay/nBQjHivZFNrqk3tun2MgBeySnNyUeO/YoABdWzS2UmCgAAAAAAAAAAAD/2Q==",
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
      name: 'Item 3',
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
      name: 'Item 5',
      startDate: new Date('2024-05-01T00:00:00'),
      endDate: new Date('2024-05-04T00:00:00'),// new Date(),
      canResizeLeft: true,
      canResizeRight: true,
      canDrag: true,
      canSwitchLane: true
    }
  ]

  constructor(private _NgxTimelineService: NgxTimelineService) {
    this._NgxTimelineService.setLanes(this.lanes)
  }
}
