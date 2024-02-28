import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateErrorsComponent } from './errors.component';

describe('ErrorsComponent', () => {
  let component: CandidateErrorsComponent;
  let fixture: ComponentFixture<CandidateErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
