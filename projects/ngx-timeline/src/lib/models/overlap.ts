export interface Overlap {
    lane: string | number
    overlapStart: Date
    overlapEnd: Date
    items: string[]
    _top?: number
    _left?: number
    _width?: number
}