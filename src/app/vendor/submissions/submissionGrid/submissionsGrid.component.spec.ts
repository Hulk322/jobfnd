import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsGridComponent } from './submissionsGrid.component';

describe('SubmissionsGridComponent', () => {
  let component: SubmissionsGridComponent;
  let fixture: ComponentFixture<SubmissionsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
