import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';

import { AdminErrorsComponent } from './errors.component';

describe('ErrorsComponent', () => {
  let component: AdminErrorsComponent;
  let fixture: ComponentFixture<AdminErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminErrorsComponent ],
      imports: [
                  HttpClientTestingModule, 
                  RouterTestingModule.withRoutes([])
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
