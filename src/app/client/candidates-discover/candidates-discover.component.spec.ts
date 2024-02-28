import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesDiscoverComponent } from './candidates-discover.component';

describe('CandidatesDiscoverComponent', () => {
  let component: CandidatesDiscoverComponent;
  let fixture: ComponentFixture<CandidatesDiscoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesDiscoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
