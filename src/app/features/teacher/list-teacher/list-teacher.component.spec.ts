import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeacherComponent } from './list-teacher.component';

describe('ListTeacherComponent', () => {
  let component: ListTeacherComponent;
  let fixture: ComponentFixture<ListTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTeacherComponent]
    });
    fixture = TestBed.createComponent(ListTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
