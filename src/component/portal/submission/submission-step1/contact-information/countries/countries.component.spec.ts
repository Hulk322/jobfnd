import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesPortalComponent } from './countries.component';

describe('CountriesPortalComponent', () => {
  let component: CountriesPortalComponent;
  let fixture: ComponentFixture<CountriesPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
