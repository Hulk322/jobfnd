import { CandidateModule } from './candidate.module';

describe('CandidateModule', () => {
  let candidateModule: CandidateModule;

  beforeEach(() => {
    candidateModule = new CandidateModule();
  });

  it('should create an instance', () => {
    expect(candidateModule).toBeTruthy();
  });
});
