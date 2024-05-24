import { ErrorItem } from "./erroritem.model"
import { Item } from "./item"

export interface Lane {
    id: string
    name: string
    description: string
    canDragLane: boolean
    isExpanded?: boolean
    sub?: Lane[]
    items?: Item[]
    errorItems?: ErrorItem[]
    updateView?(): void
}

// items are stacked by Lane (Person)
// export interface SubLane {
//   id: string
//   name: string
//   description: string
//   canDrag: boolean
//   items: Item[]
// }
// items (Dienst)
