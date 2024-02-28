import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobQuestionsComponent } from './job-questions.component';

describe('JobQuestionsComponent', () => {
  let component: JobQuestionsComponent;
  let fixture: ComponentFixture<JobQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
