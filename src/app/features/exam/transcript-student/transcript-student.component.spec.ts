import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptStudentComponent } from './transcript-student.component';

describe('TranscriptStudentComponent', () => {
  let component: TranscriptStudentComponent;
  let fixture: ComponentFixture<TranscriptStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranscriptStudentComponent]
    });
    fixture = TestBed.createComponent(TranscriptStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
