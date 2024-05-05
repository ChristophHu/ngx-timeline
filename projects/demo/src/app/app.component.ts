import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NgxDynamicTimelineComponent } from '../../../ngx-dynamic-timeline/src/public-api'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxDynamicTimelineComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'demo';
}
