import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobComponentComponent } from './client-job-component.component';

describe('ClientJobComponentComponent', () => {
  let component: ClientJobComponentComponent;
  let fixture: ComponentFixture<ClientJobComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientJobComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientJobComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
