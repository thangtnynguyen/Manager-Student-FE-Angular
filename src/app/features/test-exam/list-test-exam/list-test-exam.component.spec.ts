import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTestExamComponent } from './list-test-exam.component';

describe('ListTestExamComponent', () => {
  let component: ListTestExamComponent;
  let fixture: ComponentFixture<ListTestExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTestExamComponent]
    });
    fixture = TestBed.createComponent(ListTestExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
