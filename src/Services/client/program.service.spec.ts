import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

import { ProgramService } from './program.service';

describe('ProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: ProgramService = TestBed.get(ProgramService);
    expect(service).toBeTruthy();
  }); */
});
