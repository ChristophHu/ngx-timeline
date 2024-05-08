import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject, ElementRef, TemplateRef, NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineDateMarkerComponent } from './components/timeline-date-marker/timeline-date-marker.component';
import { TimelineScaleHeaderComponent } from './components/timeline-scale-header/timeline-scale-header.component';
import { TimelinePanelComponent } from './components/timeline-panel/timeline-panel.component';
import { IScale, IScaleGenerator, IScaleGeneratorConfig } from './models/scale';
import { IViewModeAdaptor } from './models/view-adapter';
import { IItemsIterator } from './models/items-iterator';
import { ITimelineItem, Item } from './models/item';
import { ItemsIterator } from './helpers/items-iterator';
import { Lane } from './models/lane.model';
import { ErrorItem } from './models/erroritem.model';
import { Observable, of } from 'rxjs';
import { ITimelineZoom, TimelineViewMode } from './models/zoom';
import { DragEndEvent } from 'angular-draggable-droppable';
// import { ResizeEvent } from 'angular-resizable-element';
import { StrategyManager } from './helpers/strategy-manager';
import { NgxDynamicTimelineService } from './services/ngx-dynamic-timeline.service';
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component';
import { DAY_SCALE_GENERATOR_CONFIG, DayScaleGenerator } from './helpers/scale-generator/day-scale-generator';
import { ResizeEvent } from '../../../ngx-resizeable-element/src/public-api';

interface ITimelineModuleConfig {
  strategyManager?: Provider;
  dayScaleGenerator?: Provider;
  dayScaleConfig?: Partial<IScaleGeneratorConfig>;
}

export interface IIdObject {
  id: number | string
}

@Component({
  selector: 'ngx-dynamic-timeline',
  standalone: true,
  imports: [
    CommonModule,
    TimelineDateMarkerComponent,
    TimelineItemComponent,
    TimelinePanelComponent,
    TimelineScaleHeaderComponent
  ],
  templateUrl: './ngx-dynamic-timeline.component.html',
  styleUrls: ['./ngx-dynamic-timeline.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxDynamicTimelineComponent implements OnInit, AfterViewInit {
  // datemarker
  public currentDate: Date = new Date()
  public dateMarkerLeftPosition: number = 0
  @Input() showDateMarker: boolean = true

  // scale
  @Input() scaler: { startDate: Date, endDate: Date } = { startDate: new Date('2023-01-01T00:00:00'), endDate: new Date('2023-09-30T00:00:00')}
  public scaleGenerator: IScaleGenerator
  public scale!: IScale
  public viewModeAdaptor!: IViewModeAdaptor

  // item
  @Input() verticalDrag: boolean = true
  public itemsIterator: IItemsIterator = new ItemsIterator()
  public itemsIterator2: any
  // public itemsGroupIterator: GroupIterator = new GroupIterator()

  errorItem: ErrorItem[] = []

  @Output() itemMoved: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>()
  @Output() itemResized: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>()
  // @Input() set items(items: ITimelineItem[]) {
  //   this.itemsIterator.setItems(items)
  //   this.redraw()
  // }
  @Input() set lanes(lanes: Lane[]) {
    let items = this.setItems(lanes)
    this.itemsIterator.setItems(items)
    this.redraw()
  }
  setItems(lanes: Lane[]): Item[] {
    let items: Item[] = []
    lanes.forEach((lane: Lane, index: number) => {
      if (!lane.sub && lane.items?.length) {
        // check overlaping items
        let errorItems: any[] = this.checkOverlapingItems(lane.items)
        lanes[index].errorItems = errorItems
        items.push(...lane.items)
      } else {
        items.push(...this.setItems(lane.sub!))
      }
    })
    return items
  }
  checkOverlapingItems(arr: Item[]): any[] {
    arr = this.sortItems(arr)
    console.log(arr)
    for(let i = 0; i < (arr.length - 1); i++) {
      if (arr[i].endDate > arr[i+1].startDate) {
        let errorItem: ErrorItem = { id: '0', errortype: 'overlap', startDate: arr[i+1].startDate, endDate: arr[i].endDate, itemIds: [arr[i].id, arr[i+1].id] }
        errorItem._width = this._calculateItemWidth(errorItem)
        errorItem._left = this._calculateItemLeftPosition(errorItem)
        this.errorItem.push(errorItem)
      }
    }
    return this.errorItem
  }
  sortItems(arr: any[]): any[] {
    return arr.sort((a, b) => (a.endDate < b.endDate ? 1 : (a.startDate > b.startDate ? 1 : 0)))
  }
  lanes$: Observable<Lane[]> = of()

  @Input() itemContentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined

  // view
  @Input() panelWidth: number = 160
  @Input() isPanelResizable: boolean = true
  // @Input() panelItemTemplate!: TemplateRef<{ item: ITimelineItem, index: number, depth: number, locale: string }>
  @Input() panelLaneTemplate!: TemplateRef<{ lane: Lane, index: number, depth: number, locale: string }>

  get visibleScaleWidth(): number {
    return this._elementRef.nativeElement.clientWidth - this.panelWidth
  }

  public zoom: ITimelineZoom = {columnWidth: 48, viewMode: TimelineViewMode.Day}
  // public zoomsHandler: IZoomsHandler = new ZoomsHandler(DefaultZooms)
  // get zoom(): ITimelineZoom {
  //   return this.zoomsHandler.activeZoom
  // }

  // @HostListener('scroll', ['$event'])
  // private _onScroll(event: Event): void {
  //   // if (!this._ignoreNextScrollEvent) {
  //     this.currentDate = this._getCurrentDate()
  //   // }
  //   // this._ignoreNextScrollEvent = false
  // }

  constructor(private _cdr: ChangeDetectorRef, private _strategyManager: StrategyManager, private _NgxDynamicTimelineService: NgxDynamicTimelineService, @Inject(ElementRef) private _elementRef: ElementRef) {
    this._setStrategies(this.zoom)
    this.scaleGenerator = this._strategyManager.getScaleGenerator(this.zoom.viewMode)
  }

  ngOnInit(): void {
    this.lanes$ = this._NgxDynamicTimelineService.lanes$
    this._NgxDynamicTimelineService.lanes$.subscribe({
      next: (data: any) => console.log(data)
    })
  }
  
  ngAfterViewInit(): void {
    this._setStrategies(this.zoom)
    this.redraw()
  }

  redraw(): void {
    this._generateScale()
    this._updateItemsPosition()
    this._recalculateDateMarkerPosition()
    // this._ignoreNextScrollEvent = true
    this._cdr.detectChanges()
    this.attachCameraToDate(this.currentDate)
  }

  attachCameraToDate(date: Date): void {
    this.currentDate = date
    const duration = this.viewModeAdaptor.getDurationInColumns(this.scale!.startDate, date)
    const scrollLeft = (duration * this.zoom.columnWidth) - (this.visibleScaleWidth / 2)
    // this._ignoreNextScrollEvent = true

    if (this._elementRef.nativeElement) {
      this._elementRef.nativeElement.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft
    }
  }

  _getCurrentDate(): Date {
    const currentScrollLeft = this._elementRef.nativeElement.scrollLeft ?? 0
    const scrollLeftToCenterScreen = currentScrollLeft + (this.visibleScaleWidth / 2)
    const columns = Math.round(scrollLeftToCenterScreen / this.zoom.columnWidth)

    return this.viewModeAdaptor.addColumnToDate(this.scale!.startDate, columns)
  }

  private _generateScale(): void {
    const scaleStartDate = this.scaler.startDate
    const scaleEndDate = this.scaler.endDate
    // const scaleStartDate = this.scaleGenerator.getStartDate(this.itemsIterator)
    // const scaleEndDate = this.scaleGenerator.getEndDate(this.itemsIterator)
    this.scale = this.scaleGenerator.generateScale(scaleStartDate, scaleEndDate)
  }

  private _updateItemsPosition(): void {
    this.itemsIterator.forEach((item) => this._updateItemPosition(item))
  }
  private _updateItemPosition(item: ITimelineItem): void {
    item._width = this._calculateItemWidth(item)
    item._left = this._calculateItemLeftPosition(item)
    item.updateView && item.updateView()
  }
  private _calculateItemWidth(item: ITimelineItem | ErrorItem): number {
    if (!item.startDate || !item.endDate)
      return 0

    const columnsOccupied = this.viewModeAdaptor.getUniqueColumnsWithinRange(new Date(item.startDate), new Date(item.endDate))

    return columnsOccupied * 48 -48
  }
  private _calculateItemLeftPosition(item: ITimelineItem | ErrorItem): number {
    if (!item.startDate || !item.endDate)
      return 0

    const columnsOffsetFromStart = this.viewModeAdaptor.getUniqueColumnsWithinRange(this.scale!.startDate, new Date(item.startDate)) - 1

    return columnsOffsetFromStart * this.zoom.columnWidth
  }
  private _recalculateDateMarkerPosition(): void {
    const countOfColumns = this.viewModeAdaptor.getDurationInColumns(this.scale!.startDate, new Date())

    this.dateMarkerLeftPosition = countOfColumns * this.zoom.columnWidth // fehler
  }

  _onItemMoved(event: DragEndEvent, movedItem: ITimelineItem): void {
    const transferColumns = Math.round(event.x / this.zoom.columnWidth)
    console.log(event.y)
    movedItem.startDate = this.viewModeAdaptor.addColumnToDate(new Date(movedItem.startDate), transferColumns)
    movedItem.endDate = this.viewModeAdaptor.addColumnToDate(new Date(movedItem.endDate), transferColumns)
    console.log(movedItem)
    // check id of errors
    // this.lanes.forEach((lane: Lane) => {
    //   let found = lane.items.find((item: Item) => item.id == movedItem.id)
    //   if (found) {
    //     // lane.errorItems.find((item: ErrorItem) => item.itemIds != moved)
    //   }
    //     // if (lane.errorItems.filter('three') > -1)
    //     // return true
      
    //   return false
    // })
    this._updateItemPosition(movedItem)
    this.itemMoved.emit(movedItem)
  }
  _onItemResized(event: ResizeEvent, item: ITimelineItem): void {
    const calculateNewDate = (movedPx: number, oldDate: Date): Date => {
      const countOfColumnsMoved = Math.round(movedPx as number / this.zoom.columnWidth)
      return this.viewModeAdaptor.addColumnToDate(oldDate, countOfColumnsMoved)
    }

    if (event.edges.left) {
      const newStartDate = calculateNewDate(<number>event.edges.left, new Date(item.startDate))
      if (newStartDate.getTime() <= new Date(item.endDate).getTime()) {
        item.startDate = newStartDate
      }
    } else {
      const newEndDate = calculateNewDate(<number>event.edges.right, new Date(item.endDate))
      if (newEndDate.getTime() >= new Date(item.startDate).getTime()) {
        item.endDate = newEndDate
      }
    }

    this._updateItemPosition(item)
    this.itemResized.emit(item)
  }
  fitToContent(paddings: number): void {
    const firstItem = this.itemsIterator.getFirstItem(true)
    const lastItem = this.itemsIterator.getLastItem(true)

    if (!firstItem || !lastItem)
      return

    const startDate = new Date(firstItem.startDate)
    const endDate = new Date(lastItem.endDate)
    // const zoom = this._calculateOptimalZoom(startDate, endDate, paddings)
    const viewModeAdaptor = this._strategyManager.getViewModeAdaptor(this.zoom.viewMode)

    this.currentDate = new Date(viewModeAdaptor.getMiddleDate(startDate, endDate))

    // if (this.zoomsHandler.isZoomActive(zoom)) {
    //   this.attachCameraToDate(this.currentDate)
    // } else {
    //   this.changeZoom(zoom)
    // }
  }

  private _setStrategies(zoom: ITimelineZoom): void {
    this.viewModeAdaptor = this._strategyManager.getViewModeAdaptor(zoom.viewMode)
    this.scaleGenerator = this._strategyManager.getScaleGenerator(zoom.viewMode)
  }

  _trackById(index: number, item: IIdObject): number | string {
    return item.id
  }
}

@NgModule({
  declarations: [],
  imports: [
    NgxDynamicTimelineComponent
  ],
  exports: [],
  providers: []
})
export class TimelineModule {
  static forChild(config: ITimelineModuleConfig | null): ModuleWithProviders<TimelineModule> {
    return {
      ngModule: TimelineModule,
      providers: [
        config?.strategyManager ?? StrategyManager,
        config?.dayScaleGenerator ?? DayScaleGenerator,
        {
          provide: DAY_SCALE_GENERATOR_CONFIG,
          useValue: config?.dayScaleConfig
        }
      ]
    }
  }
}
