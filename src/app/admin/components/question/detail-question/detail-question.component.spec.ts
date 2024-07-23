import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailQuestionComponent } from './detail-question.component';

describe('DetailQuestionComponent', () => {
  let component: DetailQuestionComponent;
  let fixture: ComponentFixture<DetailQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailQuestionComponent]
    });
    fixture = TestBed.createComponent(DetailQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
