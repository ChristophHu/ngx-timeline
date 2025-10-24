import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDateMarkerComponent } from './timeline-date-marker.component';

describe('TimelineDateMarkerComponent', () => {
  let component: TimelineDateMarkerComponent;
  let fixture: ComponentFixture<TimelineDateMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineDateMarkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineDateMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
