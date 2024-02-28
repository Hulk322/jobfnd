import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOnBoardingComponent } from './edit-on-boarding.component';

describe('EditOnBoardingComponent', () => {
  let component: EditOnBoardingComponent;
  let fixture: ComponentFixture<EditOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
