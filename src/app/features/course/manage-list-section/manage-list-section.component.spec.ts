import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageListSectionComponent } from './manage-list-section.component';

describe('ManageListSectionComponent', () => {
  let component: ManageListSectionComponent;
  let fixture: ComponentFixture<ManageListSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageListSectionComponent]
    });
    fixture = TestBed.createComponent(ManageListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
