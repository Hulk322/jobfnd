import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalJobComponent } from './job.component';

describe('PortalJobComponent', () => {
  let component: PortalJobComponent;
  let fixture: ComponentFixture<PortalJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
