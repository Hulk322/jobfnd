import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ContractService } from './contract.service';

describe('ContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ContractService = TestBed.get(ContractService);
    expect(service).toBeTruthy();
  });
});
