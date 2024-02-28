import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareCandidatesComponent } from './compare-candidates.component';

describe('CompareCandidatesComponent', () => {
  let component: CompareCandidatesComponent;
  let fixture: ComponentFixture<CompareCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
