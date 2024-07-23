import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroupModuleComponent } from './student-group-module.component';

describe('StudentGroupModuleComponent', () => {
  let component: StudentGroupModuleComponent;
  let fixture: ComponentFixture<StudentGroupModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentGroupModuleComponent]
    });
    fixture = TestBed.createComponent(StudentGroupModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
