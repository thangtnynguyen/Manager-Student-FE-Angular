import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCategoryTreeComponent } from './question-category-tree.component';

describe('QuestionCategoryTreeComponent', () => {
  let component: QuestionCategoryTreeComponent;
  let fixture: ComponentFixture<QuestionCategoryTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionCategoryTreeComponent]
    });
    fixture = TestBed.createComponent(QuestionCategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
