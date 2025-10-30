import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core"
import { Observable } from "rxjs"
import { NgxTimelineService } from "../../services/ngx-timeline.service"
import { CommonModule } from '@angular/common'
import { Lane } from "../../models/lane"
import { ITimelineItem } from "../../models/item"

import { ResizeableDirective, ResizeEvent, ResizeHandleDirective } from "@christophhu/ngx-resizeable"

@Component({
  selector: 'timeline-panel',
  standalone: true,
  imports: [
    CommonModule,
    ResizeableDirective,
    ResizeHandleDirective
  ],
  templateUrl: './timeline-panel.component.html',
  styleUrl: './timeline-panel.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePanelComponent {
  @Input() width: number = 100
  @Input() resizable: boolean = true
  @Input() minWidth: number = 48
  @Input() maxWidth: number = 48
  public rowHeight: number = 40

  @Output() widthChanged = new EventEmitter<number>()

  lanes$: Observable<Lane[]>
  
  constructor(private _NgxTimelineService: NgxTimelineService) {
    this.lanes$ = this._NgxTimelineService.lanes$
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).some(key => ['width', 'minWidth', 'maxWidth'].includes(key))) {
      this._validateWidth()
    }
  }

  handleResize(event: ResizeEvent | any): void {
    const newWidth = event.rectangle.width

    if (newWidth && (newWidth < this.minWidth || newWidth > this.maxWidth))
      return

    this.width = newWidth!
    this.widthChanged.emit(this.width)
  }

  toggleExpand(item: ITimelineItem): void {
    item.expanded = !item.expanded
  }

  private _validateWidth(): void {
    if (this.width < this.minWidth) {
      this.width = this.minWidth
    }

    if (this.width > this.maxWidth) {
      this.width = this.maxWidth
    }
  }
}
