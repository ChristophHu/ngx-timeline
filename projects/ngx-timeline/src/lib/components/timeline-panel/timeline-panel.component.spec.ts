import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePanelComponent } from './timeline-panel.component';

describe('TimelinePanelComponent', () => {
  let component: TimelinePanelComponent;
  let fixture: ComponentFixture<TimelinePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelinePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
