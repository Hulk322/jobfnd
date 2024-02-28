import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStep2Component } from './submission-step2.component';

describe('SubmissionStep2Component', () => {
  let component: SubmissionStep2Component;
  let fixture: ComponentFixture<SubmissionStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
