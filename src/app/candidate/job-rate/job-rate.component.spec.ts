import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRateComponent } from './job-rate.component';

describe('JobRateComponent', () => {
  let component: JobRateComponent;
  let fixture: ComponentFixture<JobRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
