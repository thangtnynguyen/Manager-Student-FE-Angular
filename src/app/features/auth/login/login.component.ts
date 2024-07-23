import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Page } from 'src/app/core/enums/page.enum';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { RoleType } from 'src/app/core/constants/role-type.constant';
import { LoginRequest } from 'src/app/core/models/interfaces/auth/login-request.interface';
import { ToastrService } from 'src/app/core/modules/toastr/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //Core
  Page = Page;
  RoleType = RoleType;

  //State
  loginForm: FormGroup;
  validationMessages = {
    username: [
      { type: 'required', message: 'Tên người dùng không được để trống' },
    ],
    password: [
      { type: 'required', message: 'Mật khẩu không được để trống' },
    ],
  };

  //Init
  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router,private toastrService: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.email]],
      rememberMe: [true, Validators.required],
      type: [1, [Validators.required, Validators.min(1), Validators.max(3)]]
    });
  }

  ngOnInit() {}

  public handleOnSubmitLogin(){
    const request: LoginRequest = this.loginForm.value;
    this.authService.loginByUsername(request).subscribe(
      (res) => {
        if(res.status){
          this.authService.setAuthTokenLocalStorage(res.data);
          this.router.navigate([Page.Dashboard]);
        }
      },
      (exception) => {
        this.toastrService.success(exception.error.Message);
        console.log(exception?.error.Message);
      }
    );
  }
}
