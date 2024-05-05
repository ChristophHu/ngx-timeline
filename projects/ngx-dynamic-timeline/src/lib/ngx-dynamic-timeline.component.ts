import { Component } from '@angular/core';

export interface IIdObject {
  id: number | string
}

@Component({
  selector: 'ngx-dynamic-timeline',
  standalone: true,
  imports: [],
  templateUrl: './ngx-dynamic-timeline.component.html',
  styleUrls: ['ngx-dynamic-timeline.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDynamicTimelineComponent {

}
