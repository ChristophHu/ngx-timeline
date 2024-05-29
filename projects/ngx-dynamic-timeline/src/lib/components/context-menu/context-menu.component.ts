import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContextMenu } from '../../models/context-menu.model';

@Component({
  selector: 'context-menu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.sass'
})
export class ContextMenuComponent {
  @Input() contextMenuItems: Array<ContextMenu> = [
    {
      menuText: 'Refactor',
      menuEvent: 'Handle refactor',
    },
    {
      menuText: 'Format',
      menuEvent: 'Handle format',
    }
  ]
  @Output() onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  onContextMenuClick(event: any, data: any): any {
    this.onContextMenuItemClick.emit({
      event,
      data,
    });
  }
}
