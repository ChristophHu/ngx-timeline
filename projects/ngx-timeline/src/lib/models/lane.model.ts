import { ErrorItem } from "./erroritem.model"
import { Item } from "./item"

export interface Lane {
    id: string
    name: string
    description: string
    canDrag: boolean
    isExpanded?: boolean
    sub?: Lane[]
    items?: Item[]
    errorItems?: ErrorItem[]
    updateView?(): void
}