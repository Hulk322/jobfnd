import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInformationPortalComponent } from './contact-information.component';

describe('ContactInformationPortalComponent', () => {
  let component: ContactInformationPortalComponent;
  let fixture: ComponentFixture<ContactInformationPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInformationPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInformationPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {   
    expect(component).toBeTruthy();
  }); */
});
