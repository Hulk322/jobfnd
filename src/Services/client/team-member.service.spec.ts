import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

import { TeamMemberService } from './team-member.service';

describe('TeamMemberService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  /* it('should be created', () => {
    const service: TeamMemberService = TestBed.get(TeamMemberService);
    expect(service).toBeTruthy();
  }); */
});
