import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelComponent } from './import-excel.component';

describe('ImportExcelComponent', () => {
  let component: ImportExcelComponent;
  let fixture: ComponentFixture<ImportExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportExcelComponent]
    });
    fixture = TestBed.createComponent(ImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
