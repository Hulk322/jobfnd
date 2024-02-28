import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BillingCodeService } from './billing-code.service';

describe('BillingCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

 /*  it('should be created', () => {
    const service: BillingCodeService = TestBed.get(BillingCodeService);
    expect(service).toBeTruthy();
  }); */
});
