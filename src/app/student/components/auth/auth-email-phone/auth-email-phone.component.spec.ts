import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEmailPhoneComponent } from './auth-email-phone.component';

describe('AuthEmailPhoneComponent', () => {
  let component: AuthEmailPhoneComponent;
  let fixture: ComponentFixture<AuthEmailPhoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthEmailPhoneComponent]
    });
    fixture = TestBed.createComponent(AuthEmailPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
