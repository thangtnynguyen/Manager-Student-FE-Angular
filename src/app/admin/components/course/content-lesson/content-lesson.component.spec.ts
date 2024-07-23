import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLessonComponent } from './content-lesson.component';

describe('ContentLessonComponent', () => {
  let component: ContentLessonComponent;
  let fixture: ComponentFixture<ContentLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentLessonComponent]
    });
    fixture = TestBed.createComponent(ContentLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
