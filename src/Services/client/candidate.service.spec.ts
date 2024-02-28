import { TestBed } from '@angular/core/testing';

import { CandiateService } from './candiate.service';

describe('CandiateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CandiateService = TestBed.get(CandiateService);
    expect(service).toBeTruthy();
  });
});
