import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OnBoardService } from './on-board.service';

describe('OnBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: OnBoardService = TestBed.get(OnBoardService);
    expect(service).toBeTruthy();
  });
});
