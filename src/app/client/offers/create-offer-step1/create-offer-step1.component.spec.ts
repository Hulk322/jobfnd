import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferStep1Component } from './create-offer-step1.component';

describe('CreateOfferStep1Component', () => {
  let component: CreateOfferStep1Component;
  let fixture: ComponentFixture<CreateOfferStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOfferStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfferStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
