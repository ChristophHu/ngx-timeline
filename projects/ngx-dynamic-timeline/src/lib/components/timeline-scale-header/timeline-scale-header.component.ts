import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IScale, IScaleColumn, IScaleFormatter, IScaleGroup } from '../../models/scale';
import { IIdObject } from '../../ngx-dynamic-timeline.component';
import { CommonModule } from '@angular/common';

interface IGeneratedGroup {
  id: string
  name: string
  width: number
}

@Component({
  selector: 'timeline-scale-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './timeline-scale-header.component.html',
  styleUrl: './timeline-scale-header.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineScaleHeaderComponent implements OnChanges {
  @Input() scale!: IScale
  @Input() formatter!: IScaleFormatter | undefined

  public groups: IGeneratedGroup[] = []
  get columns(): IScaleColumn[] {
    return this.scale?.columns ?? []
  }

  ngOnChanges(changes: SimpleChanges) {
    this._generateGroups()
    console.log(this.groups)
    console.log(this.columns)
    // console.log(this.formatter?.formatColumn('1', 48, "en"))
  }

  private _groupColumnGroups(): { [groupId: string]: IScaleGroup[] } {
    return this.scale.columns.reduce((groupsMap: any, column) => {
      if(column.groups) {
        column.groups.forEach((group: any) => {
          groupsMap[group.id] = groupsMap[group.id] ?? []
          groupsMap[group.id].push(group)
        })
      }

      return groupsMap
    }, {})
  }

  private _generateGroups(): void {
    const groupedGroups = this._groupColumnGroups()
    this.groups = Object.keys(groupedGroups).map(groupId => ({
      id: groupId,
      name: this.formatter?.formatGroup?.(groupedGroups[groupId][0], 'en') ?? '',
      width: groupedGroups[groupId].reduce((acc, curr) => acc + 48 * curr.coverageInPercents / 100, 0)
    }))
  }

  trackById(index: number, item: IIdObject): number | string {
    return item.id
  }
}
