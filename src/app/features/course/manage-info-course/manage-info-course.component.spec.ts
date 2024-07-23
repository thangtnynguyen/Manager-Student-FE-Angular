import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInfoCourseComponent } from './manage-info-course.component';

describe('ManageInfoCourseComponent', () => {
  let component: ManageInfoCourseComponent;
  let fixture: ComponentFixture<ManageInfoCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInfoCourseComponent]
    });
    fixture = TestBed.createComponent(ManageInfoCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
