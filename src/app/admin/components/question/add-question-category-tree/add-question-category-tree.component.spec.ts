import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionCategoryTreeComponent } from './add-question-category-tree.component';

describe('AddQuestionCategoryTreeComponent', () => {
  let component: AddQuestionCategoryTreeComponent;
  let fixture: ComponentFixture<AddQuestionCategoryTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddQuestionCategoryTreeComponent]
    });
    fixture = TestBed.createComponent(AddQuestionCategoryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
