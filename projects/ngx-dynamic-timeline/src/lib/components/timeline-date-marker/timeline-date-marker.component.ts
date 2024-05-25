import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { IScale } from '../../models/scale';

@Component({
  selector: 'timeline-date-marker',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './timeline-date-marker.component.html',
  styleUrl: './timeline-date-marker.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineDateMarkerComponent {
  public headerHeight: number = 64
  public customTemplate: TemplateRef<{ leftPosition: number }> | undefined
  isInScaleRange: boolean = true
  @Input() leftPosition: number = 0
  @Input() set scale(scale: IScale) { this._checkIsInScaleRange(scale) }

  constructor(private _cdr: ChangeDetectorRef) {}

  private _checkIsInScaleRange(scale: IScale): void {
    const now = Date.now()
    this.isInScaleRange = scale.startDate.getTime() <= now && scale.endDate.getTime() >= now
    this._cdr.detectChanges()
  }
}
