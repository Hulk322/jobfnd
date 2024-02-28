import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationJobQuestionsComponent } from './application-job-questions.component';

describe('ApplicationJobQuestionsComponent', () => {
  let component: ApplicationJobQuestionsComponent;
  let fixture: ComponentFixture<ApplicationJobQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationJobQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationJobQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
