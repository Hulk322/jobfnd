import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSuccessComponent } from './submission-success.component';

describe('SubmissionSuccessComponent', () => {
  let component: SubmissionSuccessComponent;
  let fixture: ComponentFixture<SubmissionSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
