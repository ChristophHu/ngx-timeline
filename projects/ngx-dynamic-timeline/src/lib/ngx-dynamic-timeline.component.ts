import { Component } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IIdObject {
  id: number | string
}

@Component({
  selector: 'ngx-dynamic-timeline',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ngx-dynamic-timeline.component.html',
  styleUrls: ['./ngx-dynamic-timeline.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDynamicTimelineComponent {

}
