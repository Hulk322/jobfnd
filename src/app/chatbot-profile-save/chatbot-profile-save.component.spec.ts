import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotProfileSaveComponent } from './chatbot-profile-save.component';

describe('ChatbotProfileSaveComponent', () => {
  let component: ChatbotProfileSaveComponent;
  let fixture: ComponentFixture<ChatbotProfileSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotProfileSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotProfileSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
