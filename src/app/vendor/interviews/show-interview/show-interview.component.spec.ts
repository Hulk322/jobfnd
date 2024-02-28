import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowInterviewComponent } from './show-interview.component';

describe('ShowInterviewComponent', () => {
  let component: ShowInterviewComponent;
  let fixture: ComponentFixture<ShowInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
