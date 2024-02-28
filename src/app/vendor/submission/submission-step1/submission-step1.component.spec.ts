import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStep1Component } from './submission-step1.component';

describe('SubmissionStep1Component', () => {
  let component: SubmissionStep1Component;
  let fixture: ComponentFixture<SubmissionStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
