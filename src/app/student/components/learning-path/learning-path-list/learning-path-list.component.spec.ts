import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathListComponent } from './learning-path-list.component';

describe('LearningPathListComponent', () => {
  let component: LearningPathListComponent;
  let fixture: ComponentFixture<LearningPathListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPathListComponent]
    });
    fixture = TestBed.createComponent(LearningPathListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
