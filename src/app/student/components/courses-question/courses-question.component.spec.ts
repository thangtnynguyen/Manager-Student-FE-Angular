import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesQuestionComponent } from './courses-question.component';

describe('CoursesQuestionComponent', () => {
  let component: CoursesQuestionComponent;
  let fixture: ComponentFixture<CoursesQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesQuestionComponent]
    });
    fixture = TestBed.createComponent(CoursesQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
