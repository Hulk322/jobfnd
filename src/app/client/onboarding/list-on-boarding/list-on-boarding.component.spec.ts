import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOnBoardingComponent } from './list-on-boarding.component';

describe('ListOnBoardingComponent', () => {
  let component: ListOnBoardingComponent;
  let fixture: ComponentFixture<ListOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
