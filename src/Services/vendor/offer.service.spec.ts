import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OfferService } from './offer.service';

describe('OfferService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: OfferService = TestBed.get(OfferService);
    expect(service).toBeTruthy();
  }); */
});
