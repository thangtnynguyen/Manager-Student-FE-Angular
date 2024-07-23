import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProCourseListComponent } from './pro-course-list.component';

describe('ProCourseListComponent', () => {
  let component: ProCourseListComponent;
  let fixture: ComponentFixture<ProCourseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProCourseListComponent]
    });
    fixture = TestBed.createComponent(ProCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
