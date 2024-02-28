import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResumePortalComponent } from './upload-resume.component';

describe('UploadResumeComponent', () => {
  let component: UploadResumePortalComponent;
  let fixture: ComponentFixture<UploadResumePortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadResumePortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadResumePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
