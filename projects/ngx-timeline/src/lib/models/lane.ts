import { ErrorItem } from "./erroritem.model"
import { Item } from "./item"

export interface Lane {
    id: string
    name: string
    description: string
    canDrag: boolean
    icon?: string
    isExpanded?: boolean
    items?: Item[]
    sub?: Lane[]
    updateView?(): void
}