import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgxDynamicTimelineComponent } from '../../../ngx-dynamic-timeline/src/public-api'
import { NgxDynamicTimelineService } from '../../../ngx-dynamic-timeline/src/lib/services/ngx-dynamic-timeline.service'
import { Lane } from '../../../ngx-dynamic-timeline/src/lib/models/lane.model'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxDynamicTimelineComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  scaler: { startDate: Date, endDate: Date } = { startDate: new Date('2023-02-01T00:00:00'), endDate: new Date('2023-08-30T00:00:00')}
  verticalDrag: boolean = true
  showDateMarker: boolean = true
  lanes: Lane[] = [
    {
      id: '1',
      name: 'Sub 1',
      description: 'Description',
      canDrag: false,
      isExpanded: false,
      items: [
        {
          id: '2',
          name: 'Item',
          startDate: new Date('2023-02-25T00:00:00'),
          endDate: new Date('2023-02-27T00:00:00'),// new Date(),
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true,
          canSwitchLane: true
        },
        {
          id: '3',
          name: 'Item2',
          startDate: new Date('2023-02-27T00:00:00'),
          endDate: new Date('2023-02-28T00:00:00'),
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true
        },
        {
          id: '3x',
          name: 'Item3',
          startDate: new Date('2023-02-28T00:00:00'),
          endDate: new Date('2023-03-01T00:00:00'),
          canResizeLeft: true,
          canResizeRight: true,
          canDrag: true
        }
      ],
      errorItems: []
    },
    // {
    //   id: '4',
    //   name: 'Sub',
    //   description: 'Description',
    //   canDrag: false,
    //   items: [
    //     {
    //       id: '5',
    //       name: 'Item3',
    //       startDate: new Date('2023-02-15T00:00:00'),
    //       endDate: new Date('2023-02-16T00:00:00'),
    //       canResizeLeft: true,
    //       canResizeRight: true,
    //       canDrag: true
    //     },
    //     {
    //       id: '6',
    //       name: 'Item4',
    //       startDate: new Date('2023-02-17T00:00:00'),
    //       endDate: new Date('2023-02-20T00:00:00'),
    //       canResizeLeft: true,
    //       canResizeRight: true,
    //       canDrag: true
    //     }
    //   ]
    // },
    {
      id: '7',
      name: 'Group 1',
      description: 'Description',
      canDrag: true,
      isExpanded: false,
      sub: [
        {
          id: '8',
          name: 'Sub 2',
          description: 'Description',
          canDrag: false,
          items: [
            {
              id: '9',
              name: 'Item5',
              startDate: new Date('2023-02-16T00:00:00'),
              endDate: new Date('2023-02-19T00:00:00'),
              canResizeLeft: true,
              canResizeRight: true,
              canDrag: true
            },
          ]
        },
        {
          id: '10',
          name: 'Sub 3',
          description: 'Description',
          canDrag: false,
          items: [
            {
              id: '11',
              name: 'Item6',
              startDate: new Date('2023-02-21T00:00:00'),
              endDate: new Date('2023-02-22T00:00:00'),
              canResizeLeft: true,
              canResizeRight: true,
              canDrag: true
            },
          ]
        }
      ]
    }
  ]

  constructor(private _NgxDynamicTimelineService: NgxDynamicTimelineService) {
    this._NgxDynamicTimelineService.setLanes(this.lanes)
    // console.log(new Date())
  }

  // items: ITimelineItem[] = [
  //   {
  //     startDate: new Date('2023-02-16T00:00:00'),
  //     endDate: new Date(),
  //     id: 1,
  //     name: "First",
  //     canResizeLeft: true,
  //     canResizeRight: true,
  //     canDrag: true
  //   },
  //   {
  //     startDate: new Date('2023-02-15T00:00:00'),
  //     endDate: new Date('2023-02-16T00:00:00'),
  //     id: 2,
  //     name: "Secons",
  //     canResizeLeft: true,
  //     canResizeRight: true,
  //     canDrag: true
  //   },
  //   {
  //     startDate: new Date('2022-07-09T00:00:00'),
  //     endDate: new Date('2022-07-19T00:00:00'),
  //     id: 3,
  //     name: "Second",
  //     canResizeLeft: true,
  //     canResizeRight: true,
  //     canDrag: true,
  //     items: [
  //       {
  //         startDate: new Date('2022-07-09T00:00:00'),
  //         endDate: new Date('2022-07-20T00:00:00'),
  //         id: 4,
  //         name: "2.1",
  //         canResizeLeft: true,
  //         canResizeRight: true,
  //         canDrag: true,
  //         items: [
  //           {
  //             startDate: new Date('2022-07-19T00:00:00'),
  //             endDate: new Date('2022-07-20T00:00:00'),
  //             id: 6,
  //             name: "2.1.1",
  //             canResizeLeft: true,
  //             canResizeRight: true,
  //             canDrag: true,
  //           }
  //         ]
  //       },
  //       {
  //         startDate: new Date('2022-07-09T00:00:00'),
  //         endDate: new Date('2022-07-20T00:00:00'),
  //         id: 5,
  //         name: "2.2",
  //         canResizeLeft: true,
  //         canResizeRight: true,
  //         canDrag: true,
  //       }
  //     ]
  //   },
  // ]
}
