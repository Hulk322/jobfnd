import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedResumeComponent } from './completed-resume.component';

describe('CompletedResumeComponent', () => {
  let component: CompletedResumeComponent;
  let fixture: ComponentFixture<CompletedResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
