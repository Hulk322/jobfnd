import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOnBoardingComponent } from './create-on-boarding.component';

describe('CreateOnBoardingComponent', () => {
  let component: CreateOnBoardingComponent;
  let fixture: ComponentFixture<CreateOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
