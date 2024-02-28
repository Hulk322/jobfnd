import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeProfileComponent } from './first-time-profile.component';

describe('FirstTimeProfileComponent', () => {
  let component: FirstTimeProfileComponent;
  let fixture: ComponentFixture<FirstTimeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTimeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTimeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
