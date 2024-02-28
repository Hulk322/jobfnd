import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverCandidatesComponent } from './discover-candidates.component';

describe('DiscoverCandidatesComponent', () => {
  let component: DiscoverCandidatesComponent;
  let fixture: ComponentFixture<DiscoverCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
