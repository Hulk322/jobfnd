import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BackgroundVerificationService } from './background-verification.service';

describe('BackgroundVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: BackgroundVerificationService = TestBed.get(BackgroundVerificationService);
    expect(service).toBeTruthy();
  }); */
});
