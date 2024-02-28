import { TestBed } from '@angular/core/testing';

import { IndustriesService } from './industries.service';

describe('IndustriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndustriesService = TestBed.get(IndustriesService);
    expect(service).toBeTruthy();
  });
});
