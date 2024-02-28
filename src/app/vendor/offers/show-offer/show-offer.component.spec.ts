import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOfferComponent } from './show-offer.component';

describe('ShowOfferComponent', () => {
  let component: ShowOfferComponent;
  let fixture: ComponentFixture<ShowOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
