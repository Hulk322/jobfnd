import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetCodesComponent } from './time-sheet-codes.component';

describe('TimeSheetCodesComponent', () => {
  let component: TimeSheetCodesComponent;
  let fixture: ComponentFixture<TimeSheetCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
