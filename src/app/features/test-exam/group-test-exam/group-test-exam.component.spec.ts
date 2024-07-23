import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTestExamComponent } from './group-test-exam.component';

describe('GroupTestExamComponent', () => {
  let component: GroupTestExamComponent;
  let fixture: ComponentFixture<GroupTestExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTestExamComponent]
    });
    fixture = TestBed.createComponent(GroupTestExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
