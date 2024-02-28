import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplySuccessComponent } from './job-apply-success.component';

describe('JobApplySuccessComponent', () => {
  let component: JobApplySuccessComponent;
  let fixture: ComponentFixture<JobApplySuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplySuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
