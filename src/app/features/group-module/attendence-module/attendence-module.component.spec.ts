import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceModuleComponent } from './attendence-module.component';

describe('AttendenceModuleComponent', () => {
  let component: AttendenceModuleComponent;
  let fixture: ComponentFixture<AttendenceModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendenceModuleComponent]
    });
    fixture = TestBed.createComponent(AttendenceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
