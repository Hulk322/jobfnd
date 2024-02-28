import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardAdminService } from './auth-guard-admin.service';

describe('AuthGuardAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([])
        ]
  }));

  /* it('should be created', () => {
    const service: AuthGuardAdminService = TestBed.get(AuthGuardAdminService);
    expect(service).toBeTruthy();
  }); */
});
