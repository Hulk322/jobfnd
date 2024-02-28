import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorErrorsComponent } from './errors.component';

describe('ErrorsComponent', () => {
  let component: VendorErrorsComponent;
  let fixture: ComponentFixture<VendorErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
