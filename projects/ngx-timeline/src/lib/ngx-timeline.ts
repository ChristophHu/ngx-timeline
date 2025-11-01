import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, ModuleWithProviders, NgModule, OnInit, Output, Provider, TemplateRef } from '@angular/core'
import { IScale, IScaleGenerator, IScaleGeneratorConfig } from './models/scale'
import { CommonModule } from '@angular/common'
import { TimelineDateMarkerComponent } from './components/timeline-date-marker/timeline-date-marker.component'
import { TimelineItemComponent } from './components/timeline-item/timeline-item.component'
import { TimelinePanelComponent } from './components/timeline-panel/timeline-panel.component'
import { TimelineScaleHeaderComponent } from './components/timeline-scale-header/timeline-scale-header.component'
import { IViewModeAdaptor } from './models/view-adapter'
import { IItemsIterator } from './models/items-iterator'
import { ItemsIterator } from './helpers/items-iterator'
import { Item, ITimelineItem } from './models/item'
import { Lane } from './models/lane'
import { Observable, of } from 'rxjs'
import { ITimelineZoom, TimelineViewMode } from './models/zoom'
import { StrategyManager } from './helpers/strategy-manager'
import { NgxTimelineService } from './services/ngx-timeline.service'
import { ResizeEvent } from '@christophhu/ngx-resizeable'
import { IOverlappingItem } from './models/overlapping-item'
import { DAY_SCALE_GENERATOR_CONFIG, DayScaleGenerator } from './helpers/scale-generator/day-scale-generator'
import { DragEndEvent } from '@christophhu/ngx-drag-n-drop'

interface ITimelineModuleConfig {
  strategyManager?: Provider
  dayScaleGenerator?: Provider
  dayScaleConfig?: Partial<IScaleGeneratorConfig>
}

@Component({
  selector: 'ngx-timeline',
  imports: [
    CommonModule,
    TimelineDateMarkerComponent,
    TimelineItemComponent,
    TimelinePanelComponent,
    TimelineScaleHeaderComponent
  ],
  templateUrl: './ngx-timeline.html',
  styleUrls: ['./ngx-timeline.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxTimeline implements OnInit, AfterViewInit {
// datemarker
  public currentDate: Date = new Date()
  public dateMarkerLeftPosition: number = 0
  @Input() showDateMarker: boolean = true

  // scale
  @Input() scaler: { startDate: Date, endDate: Date } = { startDate: new Date('2024-05-01T00:00:00'), endDate: new Date('2024-06-03T00:00:00')}
  public scaleGenerator: IScaleGenerator
  public scale!: IScale
  public viewModeAdaptor!: IViewModeAdaptor

  // item
  @Input() verticalDrag: boolean = true
  public itemsIterator: IItemsIterator = new ItemsIterator()

  // drag n drop highlight
  public showDropHightlight: boolean = true
  public dropHighlightTop: number = 0
  public dropHighlightLeft: number = 0
  public dropHighlightWidth: number = 0

  // show overlapping items
  public showOverlappingItems: boolean = true
  public overlappingItems: IOverlappingItem[] = []

  // overlay items
  public showOverlayItems: boolean = false
  overlayIssueTop: number = 0
  overlayIssueLeft: number = 0
  overlayIssueWidth: number = 0

  // errorItem: ErrorItem[] = []

  @Output() itemMoved: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>()
  @Output() itemResized: EventEmitter<ITimelineItem> = new EventEmitter<ITimelineItem>()

  @Input() items: ITimelineItem[] = []
  @Input() insertSorted: boolean = true
  @Input() set lanes(lanes: Lane[]) {
    if (this.items && this.items.length) {
      this._distributeItemsToLanes(lanes, this.items)
    }

    const itemsForIterator = this.setItems(lanes)
    this.itemsIterator.setItems(itemsForIterator)
    this.redraw()
  }

  private _distributeItemsToLanes(lanes: Lane[], items: ITimelineItem[]): void {
    if (!lanes || !lanes.length) return

    lanes.forEach(l => { if (!l.sub) l.items = [] })

    const map: Record<string, Lane> = {}
    const buildIndex = (arr: Lane[] | undefined) => {
      if (!arr) return
      arr.forEach(l => {
        map[String(l.id)] = l
        buildIndex(l.sub)
      })
    }
    buildIndex(lanes)

    items.forEach(it => {
      const laneId = (it as any).lane
      const lane = map[String(laneId)]
      if (lane) {
        lane.items = lane.items || []
        lane.items.push(it as Item)
      }
    })
    if (this.insertSorted) {
      Object.values(map).forEach(l => {
        if (l.items && l.items.length) {
          l.items.sort((a: Item, b: Item) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        }
      })
    }
  }

  setItems(lanes: Lane[]): Item[] {
    let items: Item[] = []
    if (lanes) lanes.forEach((lane: Lane, index: number) => {
      if (!lane.sub && lane.items?.length) {
        items.push(...lane.items)
      } else {
        items.push(...this.setItems(lane.sub!))
      }
    })
    return items
  }

  sortItems(arr: any[]): any[] {
    return arr.sort((a, b) => (a.endDate < b.endDate ? 1 : (a.startDate > b.startDate ? 1 : 0)))
  }
  lanes$: Observable<Lane[]> = of()
  private _latestLanes: Lane[] = []

  @Input() itemContentTemplate: TemplateRef<{ $implicit: ITimelineItem, locale: string }> | undefined

  // view
  @Input() panelWidth: number = 160
  @Input() isPanelResizable: boolean = true
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

  constructor(private _cdr: ChangeDetectorRef, private _strategyManager: StrategyManager, private _NgxTimelineService: NgxTimelineService, @Inject(ElementRef) private _elementRef: ElementRef) {
    this._setStrategies(this.zoom)
    this.scaleGenerator = this._strategyManager.getScaleGenerator(this.zoom.viewMode)
  }

  ngOnInit(): void {
    this.lanes$ = this._NgxTimelineService.lanes$
    this._NgxTimelineService.lanes$.subscribe({
      next: (data: Lane[]) => {
        console.log('NgxTimeline: received lanes update', data)
        this._latestLanes = data || []
      }
    })
  }
  
  ngAfterViewInit(): void {
    this._setStrategies(this.zoom)
    // this.redraw()
  }

  redraw(): void {
    this._generateScale()
    this._updateItemsPosition()
    this._recalculateDateMarkerPosition()
    this._cdr.detectChanges()
    this.attachCameraToDate(this.currentDate)
  }

  attachCameraToDate(date: Date): void {
    this.currentDate = date
    const duration = this.viewModeAdaptor.getDurationInColumns(this.scale!.startDate, date)
    const scrollLeft = (duration * this.zoom.columnWidth) - (this.visibleScaleWidth / 2)

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
    this.scale = this.scaleGenerator.generateScale(scaleStartDate, scaleEndDate)
  }

  private _updateItemsPosition(): void {
    this.itemsIterator.forEach((item: ITimelineItem) => this._updateItemPosition(item))
  }
  private _updateOverlappingItemsPosition(): void {
    this.findOverlappingItems(this.itemsIterator.items).forEach((overlap: IOverlappingItem) => this._updateOverlappingItemPosition(overlap))
  }
  private _updateOverlappingItemPosition(item: IOverlappingItem) {
    item._width = this._calculateItemWidth(item)
    item._top = this._calculateItemTopPosition(item)
    item._left = this._calculateItemLeftPosition(item)
  }
  private _updateItemPosition(item: ITimelineItem): void {
    item._width = this._calculateItemWidth(item)
    item._top = this._calculateItemTopPosition(item)
    item._left = this._calculateItemLeftPosition(item)
    
    item.updateView && item.updateView()
  }

  private _calculateItemWidth(item: ITimelineItem | IOverlappingItem): number {
    if (!item.startDate || !item.endDate)
      return 0

    const columnsOccupied = this.viewModeAdaptor.getUniqueColumnsWithinRange(new Date(item.startDate), new Date(item.endDate))

    return columnsOccupied * 48 -48
  }

  private _calculateItemTopPosition(item: ITimelineItem | IOverlappingItem): number {
    const host: HTMLElement | null = this._elementRef?.nativeElement ?? null
    if (!host) return 0

    const laneElements = host.querySelector(`[data-lane-id]`) as HTMLElement | null
    const itemElement = host.querySelector(`[data-item-id="${(item as any).id}"]`) as HTMLElement | null

    if (!laneElements) return 0
    const laneElementTop = laneElements.parentElement?.getBoundingClientRect().top || 0    

    if (!itemElement) return 0
    const itemTop = itemElement.getBoundingClientRect().top || 0

    return itemTop - laneElementTop
  }
  private _calculateItemLeftPosition(item: ITimelineItem | IOverlappingItem): number {
    if (!item.startDate || !item.endDate) return 0
    const columnsOffsetFromStart = this.viewModeAdaptor.getUniqueColumnsWithinRange(this.scale!.startDate, new Date(item.startDate)) - 1
    return columnsOffsetFromStart * this.zoom.columnWidth
  }
  private _recalculateDateMarkerPosition(): void {
    const countOfColumns = this.viewModeAdaptor.getDurationInColumns(this.scale!.startDate, new Date())

    this.dateMarkerLeftPosition = countOfColumns * this.zoom.columnWidth // fehler
  }

  private findOverlappingItems(items: ITimelineItem[]): any[] {
    const overlaps: IOverlappingItem[] = []

    const lanes = items.reduce<Record<string | number, ITimelineItem[]>>((acc, item) => {
      const laneKey = item.lane
      acc[laneKey] = acc[laneKey] || []
      acc[laneKey].push(item)
      return acc
    }, {})

    for (const [lane, laneItems] of Object.entries(lanes)) {
      const sorted = laneItems.sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const itemA = sorted[i]
          const itemB = sorted[j]

          const startA = new Date(itemA.startDate).getTime()
          const endA = new Date(itemA.endDate).getTime()
          const startB = new Date(itemB.startDate).getTime()
          const endB = new Date(itemB.endDate).getTime()

          const startDate = Math.max(startA, startB)
          const endDate = Math.min(endA, endB)

          if (startDate < endDate) {
            console.log(startDate, endDate, itemA)
            overlaps.push({
              lane,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              items: [itemA.id.toString(), itemB.id.toString()],
              _top: this._calculateItemTopPosition(itemA),
              _left: this._calculateItemLeftPosition(Object.assign({ startDate, endDate })),
              _width: this._calculateItemWidth(Object.assign({ startDate, endDate }))
            })
          }
        }
      }
    }

    return overlaps
  }

  _onItemMoved(event: DragEndEvent, movedItem: ITimelineItem): void {
    this.showDropHightlight = false

    switch (true) {
      case event.y >= 10 || event.y <= -10 && (event.x >= 10 || event.x <= -10):
        movedItem = this.movedHorizontally(event, movedItem)
        movedItem = this.movedVertically(event, movedItem)
        break
      case event.y >= 10 || event.y <= -10:
        movedItem = this.movedVertically(event, movedItem)
        break
      case event.x >= 10 || event.x <= -10:
        movedItem = this.movedHorizontally(event, movedItem)
        break
      default:
        return
    }

    this._updateItemPosition(movedItem)
    this.itemMoved.emit(movedItem)

    if (this.items && this.items.length) {
      const idx = this.items.findIndex(i => i.id === movedItem.id)
      if (idx > -1) {
        this.items[idx].startDate = movedItem.startDate
        this.items[idx].endDate = movedItem.endDate

        this._distributeItemsToLanes(this._latestLanes, this.items)
        const itemsForIterator = this.setItems(this._latestLanes)
        this.itemsIterator.setItems(itemsForIterator)
      }
    }

    this.redraw()
    this.overlappingItems = this.findOverlappingItems(this.itemsIterator.items)
    this.showDropHightlight = false
    
    this._cdr.detectChanges()
  }

  movedHorizontally(event: DragEndEvent, movedItem: ITimelineItem): ITimelineItem {
    const transferColumns = Math.round(event.x / this.zoom.columnWidth)
  
    if (transferColumns !== 0) {
      movedItem.startDate = this.viewModeAdaptor.addColumnToDate(new Date(movedItem.startDate), transferColumns)
      movedItem.endDate = this.viewModeAdaptor.addColumnToDate(new Date(movedItem.endDate), transferColumns)
    }

    return movedItem
  }
  movedVertically(event: DragEndEvent, movedItem: ITimelineItem): ITimelineItem {
    let absoluteY: number | null = null
    if (event.y != null) {
      let srcEl: HTMLElement | null = null
      try {
        srcEl = (event as any).target ?? null
      } catch (e) {
        srcEl = null
      }
      if (!srcEl && this._elementRef?.nativeElement) {
        try {
          srcEl = this._elementRef.nativeElement.querySelector(`[data-item-id="${movedItem.id}"]`)
        } catch (e) {
          srcEl = null
        }
      }
      if (srcEl) {
        const rect = srcEl.getBoundingClientRect()
        absoluteY = rect.top + (rect.height / 2) + event.y
      } else {
        absoluteY = event.y
      }
    }

    let movedBetweenLanes = false

    if (absoluteY != null) {
      const targetLaneId = this._detectLaneIdAtY(absoluteY)
      
      if (targetLaneId != null) {
        if (this.items?.length) {
          const idx = this.items.findIndex(i => i.id === movedItem.id)
          if (idx > -1) {
            ;(this.items[idx] as any).lane = targetLaneId
            if (this._latestLanes?.length) {
              this._distributeItemsToLanes(this._latestLanes, this.items)
              const itemsForIterator = this.setItems(this._latestLanes)
              this.itemsIterator.setItems(itemsForIterator)
            }
            movedBetweenLanes = true
          }
        }
      }
    }
    return movedItem
  }

  private _detectLaneIdAtY(clientY: number): string | number | null {
    if (!this._elementRef || !this._elementRef.nativeElement) return null
    const host: HTMLElement = this._elementRef.nativeElement
    const laneEls: NodeListOf<HTMLElement> = host.querySelectorAll('[data-lane-id]')
    for (let i = 0; i < laneEls.length; i++) {
      const el = laneEls[i]
      const rect = el.getBoundingClientRect()
      if (clientY >= rect.top && clientY <= rect.bottom) {
        const idAttr = el.getAttribute('data-lane-id')
        if (idAttr == null) continue
        const num = Number(idAttr)
        return isNaN(num) ? idAttr : num
      }
    }
    return null
  }
  _onItemDragStart(event: any, item: ITimelineItem): void {
    const snappedLeft = this._calculateItemLeftPosition(item)
    const snappedWidth = this._calculateItemWidth(item)
    this.dropHighlightTop = this._calculateItemTopPosition(item)
    this.dropHighlightLeft = snappedLeft
    this.dropHighlightWidth = snappedWidth
    this.showDropHightlight = true
    this._cdr.detectChanges()
  }

  _onItemDragEnd(event: any, item: ITimelineItem): void {
    // this._checkItemsOverlayIssue(item)
    // this.showDropHightlight = false
    // this._cdr.detectChanges()
  }

  _onItemDragging(event: any, item: ITimelineItem): void {
    const transferColumns = Math.round(event.x / this.zoom.columnWidth)
    const provisionalItem: ITimelineItem = Object.assign({}, item)
    provisionalItem.startDate = this.viewModeAdaptor.addColumnToDate(new Date(item.startDate), transferColumns)
    provisionalItem.endDate = this.viewModeAdaptor.addColumnToDate(new Date(item.endDate), transferColumns)

    const snappedLeft = this._calculateItemLeftPosition(provisionalItem)
    const snappedWidth = this._calculateItemWidth(provisionalItem)
    let targetTop = this._calculateItemTopPosition(item)
    try {
      if (typeof event.y === 'number') {
        let absoluteY: number | null = null
        let srcEl: HTMLElement | null = null
        try { srcEl = (event as any).target ?? null } catch (e) { srcEl = null }
        if (!srcEl && this._elementRef?.nativeElement) {
          try { srcEl = this._elementRef.nativeElement.querySelector(`[data-item-id="${item.id}"]`) } catch (e) { srcEl = null }
        }
        if (srcEl) {
          const rect = srcEl.getBoundingClientRect()
          absoluteY = rect.top + (rect.height / 2) + event.y
        } else {
          absoluteY = event.y
        }

        if (absoluteY != null) {
          const laneId = this._detectLaneIdAtY(absoluteY)
          if (laneId != null && this._elementRef?.nativeElement) {
            const host: HTMLElement = this._elementRef.nativeElement
            const targetLaneEl = host.querySelector(`[data-lane-id="${laneId}"]`) as HTMLElement | null
            if (targetLaneEl) {
              const hostRect = host.getBoundingClientRect()
              const rawTop = targetLaneEl.getBoundingClientRect().top - hostRect.top
              const rowHeight = 48
              targetTop = Math.round(rawTop / rowHeight) * rowHeight - rowHeight
            }
          }
        }
      }
    } catch (e) {
      // ignore DOM errors and keep fallback
    }

    this.dropHighlightTop = targetTop
    this.dropHighlightLeft = snappedLeft
    this.dropHighlightWidth = snappedWidth
    this.showDropHightlight = true
    this._cdr.detectChanges()
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
}

@NgModule({
  declarations: [],
  imports: [
    NgxTimeline
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
