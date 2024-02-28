import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsArchivesComponent } from './jobs-archives.component';

describe('JobsArchivesComponent', () => {
  let component: JobsArchivesComponent;
  let fixture: ComponentFixture<JobsArchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsArchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
