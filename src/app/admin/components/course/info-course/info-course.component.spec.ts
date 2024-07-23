import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCourseComponent } from './info-course.component';

describe('InfoCourseComponent', () => {
  let component: InfoCourseComponent;
  let fixture: ComponentFixture<InfoCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoCourseComponent]
    });
    fixture = TestBed.createComponent(InfoCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
