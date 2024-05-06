import { BoundingRectangle } from './bounding-rectangle.interface'
import { Edges } from './edges.interface'

export interface ResizeEvent {
  rectangle: BoundingRectangle
  edges: Edges
}