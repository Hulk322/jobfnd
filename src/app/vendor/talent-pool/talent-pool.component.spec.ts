import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentPoolComponent } from './talent-pool.component';

describe('TalentPoolComponent', () => {
  let component: TalentPoolComponent;
  let fixture: ComponentFixture<TalentPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();  
  }); */
});
