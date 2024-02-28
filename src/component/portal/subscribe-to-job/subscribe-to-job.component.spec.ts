import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeToJobComponent } from './subscribe-to-job.component';

describe('SubscribeToJobComponent', () => {
  let component: SubscribeToJobComponent;
  let fixture: ComponentFixture<SubscribeToJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeToJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeToJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
