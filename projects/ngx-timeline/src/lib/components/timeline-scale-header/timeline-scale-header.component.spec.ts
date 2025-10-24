import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineScaleHeaderComponent } from './timeline-scale-header.component';

describe('TimelineScaleHeaderComponent', () => {
  let component: TimelineScaleHeaderComponent;
  let fixture: ComponentFixture<TimelineScaleHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineScaleHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineScaleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
