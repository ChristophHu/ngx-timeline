import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineIconsComponent } from './timeline-icons.component';

describe('IconsComponent', () => {
  let component: TimelineIconsComponent;
  let fixture: ComponentFixture<TimelineIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineIconsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
