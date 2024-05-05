import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDynamicTimelineComponent } from './ngx-dynamic-timeline.component';

describe('NgxDynamicTimelineComponent', () => {
  let component: NgxDynamicTimelineComponent;
  let fixture: ComponentFixture<NgxDynamicTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDynamicTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxDynamicTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
