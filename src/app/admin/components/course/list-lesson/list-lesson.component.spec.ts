import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLessonComponent } from './list-lesson.component';

describe('ListLessonComponent', () => {
  let component: ListLessonComponent;
  let fixture: ComponentFixture<ListLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLessonComponent]
    });
    fixture = TestBed.createComponent(ListLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
