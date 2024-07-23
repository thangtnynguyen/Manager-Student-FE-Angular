import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExamComponent } from './list-exam.component';

describe('ExamComponent', () => {
  let component: ListExamComponent;
  let fixture: ComponentFixture<ListExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListExamComponent]
    });
    fixture = TestBed.createComponent(ListExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
