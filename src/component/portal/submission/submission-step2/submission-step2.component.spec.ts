import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSubmissionStep2Component } from './submission-step2.component';

describe('SubmissionStep2Component', () => {
  let component: PortalSubmissionStep2Component;
  let fixture: ComponentFixture<PortalSubmissionStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalSubmissionStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalSubmissionStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */ 
});
