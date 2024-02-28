import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardCandidateRedirectService } from './auth-guard-candidate-redirect.service';

describe('AuthGuardCandidateRedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[RouterTestingModule]
  }));

  /* it('should be created', () => {
    const service: AuthGuardCandidateRedirectService = TestBed.get(AuthGuardCandidateRedirectService);
    expect(service).toBeTruthy();
  }); */
});
