import { TestBed } from '@angular/core/testing';

import { DiscoverCandidateService } from './discover-candidate.service';

describe('DiscoverCandidateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscoverCandidateService = TestBed.get(DiscoverCandidateService);
    expect(service).toBeTruthy();
  });
});
