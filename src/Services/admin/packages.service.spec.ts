import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

import { PackagesService } from './packages.service';

describe('PackagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: PackagesService = TestBed.get(PackagesService);
    expect(service).toBeTruthy();
  });
});
