import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendJobInEmailComponent } from './send-job-in-email.component';

describe('SendJobInEmailComponent', () => {
  let component: SendJobInEmailComponent;
  let fixture: ComponentFixture<SendJobInEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendJobInEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendJobInEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
