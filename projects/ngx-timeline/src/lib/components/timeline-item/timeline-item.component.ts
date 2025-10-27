import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ITimelineItem } from '../../models/item';
import { IScale } from '../../models/scale';
import { DragDirective, DragEndEvent } from '@christophhu/ngx-drag-n-drop'
import { TimelineIconComponent } from '../timeline-icon/timeline-icon.component';
import { dateDiff, getDateRangeString } from '../../helpers/utils';
import { ResizeEvent, ResizeHandleDirective } from '@christophhu/ngx-resizeable';
import { ResizeableDirective } from '@christophhu/ngx-resizeable';

@Component({
  selector: 'timeline-item',
  standalone: true,
  imports: [
    CommonModule,
    DragDirective,
    ResizeableDirective,
    ResizeHandleDirective,
    TimelineIconComponent
  ],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineItemComponent {
  private _item!: ITimelineItem
  private _scale!: IScale

  public isInScaleRange: boolean = false
  isItemResizingStarted = false

  @Input() set item(item: ITimelineItem) {
    this._item = Object.assign({}, item)
    item!.updateView = () => this._cdr.detectChanges()
    this._checkIsInScaleRange()
  }

  @Input() set scale(scale: IScale | undefined) {
    if (scale) {
      this._scale = scale
      this._checkIsInScaleRange()
    } 
  }

  @Input() height: number = 40
  @Output() itemResized = new EventEmitter<{ event: ResizeEvent, item: ITimelineItem }>()
  @Output() itemMoved = new EventEmitter<{ event: DragEndEvent, item: ITimelineItem }>()
  @Output() dragStart = new EventEmitter<{ event: any, item: ITimelineItem }>()
  @Output() dragging = new EventEmitter<{ event: any, item: ITimelineItem }>()
  @Output() dragEnd = new EventEmitter<{ event: any, item: ITimelineItem }>()

  get item(): ITimelineItem {
    return this._item
  }

  constructor(private _cdr: ChangeDetectorRef, private _el: ElementRef) {}
 
  onItemResizeStart(event: any): void {
    this.isItemResizingStarted = true
  }

  onItemResizeEnd(event: any): void {
    this.itemResized.emit({event, item: this._item})
    setTimeout(() => this.isItemResizingStarted = false)
  }

  onDragStart(event: any): void {
    const itemTop = this._calculateItemTopPosition(this._item)
    this.dragStart.emit({event, item: this._item})
  }
  private _calculateItemTopPosition(item: ITimelineItem): number {
    const parentElement = this._el.nativeElement.parentElement
    const childrenArray = Array.from(parentElement.children)
    const itemIndex = childrenArray.indexOf(this._el.nativeElement)
    const itemTop = itemIndex * (this.height + 8)
    return itemTop
  }

  onDragging(event: any): void {
    this.dragging.emit({event, item: this._item})
  }
  onDragEnd(event: any): void {
    console.log('NgxTimeline: drag end event', event)
    if (!this.isItemResizingStarted) {
      this.dragEnd.emit({event, item: this._item})
    }
  }

  onItemDropped(event: any): void {
    if (!this.isItemResizingStarted) {
      this.itemMoved.emit({event, item: this._item})
      this.dragEnd.emit({event, item: this._item})
    }
  }

  onClick() {
    // console.log(this._item)
  }

  private _checkIsInScaleRange(): void {
    if (!this._item || !this._scale) {
      return
    }

    this.isInScaleRange = this._scale.startDate.getTime() <= this._item.startDate.getTime()
      && this._scale.endDate.getTime() >= this._item.endDate.getTime()
  }

  getDateRange(item: ITimelineItem): string {
    switch (true) {
      case dateDiff(item.endDate, item.startDate) == 1:
        return ''
      case dateDiff(item.endDate, item.startDate) == 2:
        return getDateRangeString(item.startDate, item.endDate)
      case dateDiff(item.endDate, item.startDate) > 2:
        return getDateRangeString(item.startDate, item.endDate) + ' (' + dateDiff(item.endDate, item.startDate) + ' Tage)'
      default:
        return 'unzulässige Länge'
    }
  }
}
