import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsPortalComponent } from './skills.component';

describe('SkillsPortalComponent', () => {
  let component: SkillsPortalComponent;
  let fixture: ComponentFixture<SkillsPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
