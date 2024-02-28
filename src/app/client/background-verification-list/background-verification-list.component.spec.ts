import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundVerificationListComponent } from './background-verification-list.component';

describe('BackgroundVerificationListComponent', () => {
  let component: BackgroundVerificationListComponent;
  let fixture: ComponentFixture<BackgroundVerificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundVerificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundVerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
