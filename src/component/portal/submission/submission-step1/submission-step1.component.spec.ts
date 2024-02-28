import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSubmissionStep1Component } from './submission-step1.component';

describe('SubmissionStep1Component', () => {
  let component: PortalSubmissionStep1Component;
  let fixture: ComponentFixture<PortalSubmissionStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalSubmissionStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalSubmissionStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
