export interface IOverlappingItem {
    lane: string | number
    startDate: Date
    endDate: Date
    items: string[]
    _top?: number
    _left?: number
    _width?: number
}