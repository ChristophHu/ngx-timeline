import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTimeline } from './ngx-timeline';

describe('NgxTimeline', () => {
  let component: NgxTimeline;
  let fixture: ComponentFixture<NgxTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
