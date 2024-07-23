import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTestExamComponent } from './detail-test-exam.component';

describe('DetailTestExamComponent', () => {
  let component: DetailTestExamComponent;
  let fixture: ComponentFixture<DetailTestExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailTestExamComponent]
    });
    fixture = TestBed.createComponent(DetailTestExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
