import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTalentComponent } from './upload-talent.component';

describe('UploadTalentComponent', () => {
  let component: UploadTalentComponent;
  let fixture: ComponentFixture<UploadTalentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTalentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
