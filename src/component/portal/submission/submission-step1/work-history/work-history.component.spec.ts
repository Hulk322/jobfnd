import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHistoryPortalComponent } from './work-history.component';

describe('WorkHistoryComponent', () => {
  let component: WorkHistoryPortalComponent;
  let fixture: ComponentFixture<WorkHistoryPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkHistoryPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkHistoryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
