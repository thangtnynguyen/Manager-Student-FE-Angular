import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageListLessonComponent } from './manage-list-lesson.component';

describe('ManageListLessonComponent', () => {
  let component: ManageListLessonComponent;
  let fixture: ComponentFixture<ManageListLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageListLessonComponent]
    });
    fixture = TestBed.createComponent(ManageListLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
