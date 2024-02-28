import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTabsComponent } from './application-tabs.component';

describe('ApplicationTabsComponent', () => {
  let component: ApplicationTabsComponent;
  let fixture: ComponentFixture<ApplicationTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
