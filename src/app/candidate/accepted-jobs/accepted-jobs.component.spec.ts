import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedJobsComponent } from './accepted-jobs.component';

describe('AcceptedJobsComponent', () => {
  let component: AcceptedJobsComponent;
  let fixture: ComponentFixture<AcceptedJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptedJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
