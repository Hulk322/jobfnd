import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCodesComponent } from './billing-codes.component';

describe('BillingCodesComponent', () => {
  let component: BillingCodesComponent;
  let fixture: ComponentFixture<BillingCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
