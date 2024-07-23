import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthGithubComponent } from './auth-github.component';

describe('AuthGithubComponent', () => {
  let component: AuthGithubComponent;
  let fixture: ComponentFixture<AuthGithubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthGithubComponent]
    });
    fixture = TestBed.createComponent(AuthGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
