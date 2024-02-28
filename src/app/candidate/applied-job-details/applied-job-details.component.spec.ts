import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedJobDetailsComponent } from './applied-job-details.component';

describe('AppliedJobDetailsComponent', () => {
  let component: AppliedJobDetailsComponent;
  let fixture: ComponentFixture<AppliedJobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppliedJobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
