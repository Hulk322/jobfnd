import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ClientChangePasswordComponent;
  let fixture: ComponentFixture<ClientChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
