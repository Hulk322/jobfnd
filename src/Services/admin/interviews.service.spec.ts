import { TestBed } from '@angular/core/testing';

import { InterviewsService } from './interviews.service';

describe('InterviewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterviewsService = TestBed.get(InterviewsService);
    expect(service).toBeTruthy();
  });
});
