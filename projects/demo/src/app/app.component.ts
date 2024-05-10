import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgxDynamicTimelineComponent } from '../../../ngx-dynamic-timeline/src/public-api'
import { NgxDynamicTimelineService } from '../../../ngx-dynamic-timeline/src/lib/services/ngx-dynamic-timeline.service'
import { Lane } from '../../../ngx-dynamic-timeline/src/lib/models/lane.model'
import { NgxResizeableDirective, ResizeEvent, ResizeHandleDirective } from '../../../ngx-resizeable-element/src/public-api'
import { NgStyle } from '@angular/common'
// import { DropEvent } from 'angular-draggable-droppable';
// import { DroppableDirective, ValidateDrop } from 'projects/angular-draggable-droppable/src/lib/droppable.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxDynamicTimelineComponent,
    NgxResizeableDirective,
    ResizeHandleDirective,
    RouterOutlet,
    NgStyle
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
  }

  public style: object = {};

  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: any): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  // droppedData: string = '';
  // droppedData2: string = '';

  // @ViewChild(DroppableDirective, { read: ElementRef, static: true })
  // droppableElement: ElementRef;

  // onDrop({ dropData }: DropEvent<string>): void {
  //   this.droppedData = dropData;
  //   setTimeout(() => {
  //     this.droppedData = '';
  //   }, 2000);
  // }

  // onDrop2({ dropData }: DropEvent<string>): void {
  //   this.droppedData2 = dropData;
  //   setTimeout(() => {
  //     this.droppedData2 = '';
  //   }, 2000);
  // }

  // validateDrop: ValidateDrop = ({ target }) =>
  //   this.droppableElement.nativeElement.contains(target as Node);
}