import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateService } from './candidate.service';

describe('Admin Candidates Service', () => {

  let candidateService: CandidateService,
      httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CandidateService
      ]
    });

    candidateService = TestBed.get(CandidateService);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    const service: CandidateService = TestBed.get(CandidateService);
    expect(service).toBeTruthy();
  });

  it('should retrieve all candidates', () => {

    expect(candidateService).toBeTruthy();
  });

  it('create new candidate', () => {
    const service: CandidateService = TestBed.get(CandidateService);
    expect(service).toBeTruthy();
  });

});
