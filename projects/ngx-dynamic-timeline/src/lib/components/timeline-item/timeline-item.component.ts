import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ITimelineItem } from '../../models/item';
import { IScale } from '../../models/scale';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { DragAndDropModule, DragEndEvent } from 'angular-draggable-droppable';

@Component({
  selector: 'timeline-item',
  standalone: true,
  imports: [
    CommonModule,
    ResizableModule,
    DragAndDropModule
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
  // @Input() locale: string = 'de'
  // @Input() contentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined
  @Output() itemResized = new EventEmitter<{ event: ResizeEvent, item: ITimelineItem }>()
  @Output() itemMoved = new EventEmitter<{ event: DragEndEvent, item: ITimelineItem }>()

  get item(): ITimelineItem {
    return this._item
  }

  constructor(private _cdr: ChangeDetectorRef) {}

  // private _calculateItemLeftPosition(item: ITimelineItem): number {
  //   if (!item.startDate || !item.endDate)
  //     return 0;

  //   const columnsOffsetFromStart = this.viewModeAdaptor.getUniqueColumnsWithinRange(this.scale!.startDate, new Date(item.startDate)) - 1;
  //   console.log(`left: ${columnsOffsetFromStart}, \nvom ${item.startDate} \nbis ${item.endDate}`)
  //   return columnsOffsetFromStart * 48;
  // }
  
  onItemResizeStart(event: ResizeEvent): void {
    this.isItemResizingStarted = true
  }

  onItemResizeEnd(event: ResizeEvent): void {
    this.itemResized.emit({event, item: this._item})
    setTimeout(() => this.isItemResizingStarted = false)
  }

  onItemDropped(event: DragEndEvent): void {
    if (!this.isItemResizingStarted) {
      this.itemMoved.emit({event, item: this._item})
    }
  }

  onClick() {
    console.log(this._item)
  }

  private _checkIsInScaleRange(): void {
    if (!this._item || !this._scale) {
      return
    }

    this.isInScaleRange = this._scale.startDate.getTime() <= this._item.startDate.getTime()
      && this._scale.endDate.getTime() >= this._item.endDate.getTime()
  }
}
