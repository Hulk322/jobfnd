import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryPortalComponent } from './education-history.component';

describe('EducationHistoryPortalComponent', () => {
  let component: EducationHistoryPortalComponent;
  let fixture: ComponentFixture<EducationHistoryPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationHistoryPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationHistoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
