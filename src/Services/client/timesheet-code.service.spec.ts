import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

import { TimesheetCodeService } from './timesheet-code.service';

describe('TimesheetCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: TimesheetCodeService = TestBed.get(TimesheetCodeService);
    expect(service).toBeTruthy();
  }); */
});
