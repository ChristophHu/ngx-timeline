import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from "@angular/core"
import { Observable } from "rxjs"
import { NgxDynamicTimelineService } from "../../services/ngx-dynamic-timeline.service"
import { ResizeEvent } from "angular-resizable-element"
import { ResizableModule } from 'angular-resizable-element'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'timeline-panel',
  standalone: true,
  imports: [
    CommonModule,
    ResizableModule
  ],
  templateUrl: './timeline-panel.component.html',
  styleUrl: './timeline-panel.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePanelComponent {
  @Input() lanes: Lane[]
  @Input() items: ITimelineItem[]
  @Input() width: number = 100
  @Input() resizable: boolean
  @Input() minWidth: number
  @Input() maxWidth: number
  public rowHeight: number = 40
  // @Input() itemTemplate: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>
  @Input() laneTemplate: TemplateRef<{ lane: Lane, index: number, depth: number, locale: string }>
  @Output() widthChanged = new EventEmitter<number>()

  lanes$: Observable<Lane[]>
  
  constructor(private _NgxDynamicTimelineService: NgxDynamicTimelineService) {
    this.lanes$ = this._NgxDynamicTimelineService.lanes$
    this._NgxDynamicTimelineService.lanes$.subscribe({
      next: (data) => console.log(data)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).some(key => ['width', 'minWidth', 'maxWidth'].includes(key))) {
      this._validateWidth()
    }
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id
  }

  handleResize(event: ResizeEvent) {
    const newWidth = event.rectangle.width

    if (newWidth < this.minWidth || newWidth > this.maxWidth)
      return

    this.width = newWidth
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
