import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTeacherComponent } from './detail-teacher.component';

describe('DetailTeacherComponent', () => {
  let component: DetailTeacherComponent;
  let fixture: ComponentFixture<DetailTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailTeacherComponent]
    });
    fixture = TestBed.createComponent(DetailTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
