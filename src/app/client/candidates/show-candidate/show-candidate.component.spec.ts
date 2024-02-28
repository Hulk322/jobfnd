import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCandidateComponent } from './show-candidate.component';

describe('ShowCandidateComponent', () => {
  let component: ShowCandidateComponent;
  let fixture: ComponentFixture<ShowCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
