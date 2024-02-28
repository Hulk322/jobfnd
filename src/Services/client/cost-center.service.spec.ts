import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CostCenterService } from './cost-center.service';

describe('CostCenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: CostCenterService = TestBed.get(CostCenterService);
    expect(service).toBeTruthy();
  }); */
});
