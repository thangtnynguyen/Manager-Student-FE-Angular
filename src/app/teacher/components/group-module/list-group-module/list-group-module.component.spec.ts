import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupModuleComponent } from './list-group-module.component';

describe('ListGroupModuleComponent', () => {
  let component: ListGroupModuleComponent;
  let fixture: ComponentFixture<ListGroupModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListGroupModuleComponent]
    });
    fixture = TestBed.createComponent(ListGroupModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
