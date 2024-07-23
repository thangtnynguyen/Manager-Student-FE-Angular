import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathDetailComponent } from './learning-path-detail.component';

describe('LearningPathDetailComponent', () => {
  let component: LearningPathDetailComponent;
  let fixture: ComponentFixture<LearningPathDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningPathDetailComponent]
    });
    fixture = TestBed.createComponent(LearningPathDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
