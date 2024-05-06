import { TestBed } from '@angular/core/testing';

import { NgxDynamicTimelineService } from './ngx-dynamic-timeline.service';

describe('NgxDynamicTimelineService', () => {
  let service: NgxDynamicTimelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDynamicTimelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
