import {Component,Input,Output,EventEmitter,ViewChild} from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import authConstant from 'src/app/student/constants/auth-constant';
import { phoneCodeCountry } from 'src/app/shared/data/phone.data';
import { CountdownConfig } from 'ngx-countdown';
import { CountdownComponent } from 'ngx-countdown/countdown.component';
import validationHelper from 'src/app/student/helpers/validation-helpers';
import { AuthService } from 'src/app/student/services/api/auth.service';
import { ToastrService } from 'src/app/student/services/utilities/toastr.service';
import { UserService } from 'src/app/student/services/api/user.service';

@Component({
  selector: 'app-auth-email-phone',
  templateUrl: './auth-email-phone.component.html',
  styleUrls: ['./auth-email-phone.component.css'],
})
export class AuthEmailPhoneComponent {
  //Binding
  @Input() authView!: number;
  @Output() changeViewEvent = new EventEmitter<{title: string; view: number;}>();
  @Output() changeStatusModalEvent = new EventEmitter<boolean>();

  //Child component
  @ViewChild('countdown', { static: false }) countdown!: CountdownComponent;

  //Helper
  validationHelper: any = validationHelper;

  //Constant
  authConstant: any = authConstant;

  //Error
  errorMessage: any = {
    account: ''
  }

  //Common
  countryData: any = phoneCodeCountry;
  countryCurrent: any = phoneCodeCountry.find(item => item.dial_code === authConstant.defaultPhoneCodeCountry);
  openSelectPhoneCountry: boolean = false;
  numberPhoneSearch: string = '';
  statusViewPhone: number = authConstant.statusViewPhoneNotSendOtp;
  requestedSendOtp: boolean = false;

  //Form
  loginPhoneForm: any = {
    phone: '',
    otp: ''
  }
  loginEmailForm: any = {
    email: '',
    password: '',
    rememberMe: true
  }
  registerPhoneForm: any = {
    name: '',
    phone: '',
    otp: '',

    isNameFocused: false,
  };
  numberPhone: string = '';
  otp: string = '';
  email: string = '';
  password: string = '';
  registerEmailForm: any = {
    name: '',
    email: '',
    password: '',
    otp: '',

    isNameFocused: false,
  };

  constructor(private authService: AuthService, private userService: UserService, private ngxToastr: NgxToastrService, private toastr: ToastrService ) { }

  config: CountdownConfig = {
    leftTime: 60,
    formatDate: ({ date }) => `${date / 1000}`,
  };

  onSearchPhone() {
    this.countryData = this.countryData.map((country: any) => {
      if (
        country.name
          .toLowerCase()
          .includes(this.numberPhoneSearch.toLowerCase()) ||
        country.dial_code
          .toLowerCase()
          .includes(this.numberPhoneSearch.toLowerCase())
      ) {
        return { ...country, enable: true };
      } else {
        return { ...country, enable: false };
      }
    });
  }

  handleCountdownEvent(event: any) {
    if (event.status === 3) {
      this.statusViewPhone = authConstant.statusViewPhoneNotSendOtp;
    }
  }

  //Login phone
  handleRequestLoginSendOtp() {
    if (this.loginPhoneForm.phone.length >= 9 && this.statusViewPhone === authConstant.statusViewPhoneNotSendOtp) {
      this.requestedSendOtp = true;
      this.statusViewPhone = authConstant.statusViewPhoneSendOtp;
      const phone = this.countryCurrent.dial_code + this.loginPhoneForm.phone;
      this.authService.getOtpLoginPhone(phone).subscribe(response => {
        if(response.status){
         
        }else{
          this.ngxToastr.error(response.message,'',{
            progressBar: true
          });
        }
      },error => {
        console.log(error);
        this.ngxToastr.error("Xuất hiện lỗi hệ thống, vui lòng thử lại sau!",'',{
          progressBar: true
        });
      });
    }
  }

  onSubmitFormLoginPhone() {
    if (this.loginPhoneForm.phone.length >= 9 && this.loginPhoneForm.otp.length >= 6){
      const resquest = {
        ...this.loginPhoneForm,
        phone: this.countryCurrent.dial_code + this.loginPhoneForm.phone
      }
      this.authService.loginPhone(resquest).subscribe(response => {
        if(response.status){
          console.log(response);
          localStorage.setItem('user', JSON.stringify({ token: response.data }));

          this.userService.getUserInfo().subscribe(responseUser => {
            if(response.status){
              this.changeStatusModalEvent.emit(false);
              this.authService.setAuthData(responseUser.data);
            }
          })
        }
      },error => {
        if(error.error.status === 400){
          this.errorMessage.account = "Số điện thoại hoặc mã OTP không hợp lệ!";
        }
      });
    }
  }

  //Login email
  onSubmitFormLoginEmail() {
    if(validationHelper.isEmailValid(this.loginEmailForm.email) && this.loginEmailForm.password.length >= 6){
      this.authService.loginEmail(this.loginEmailForm).subscribe(response => {
        if(response.status){
          localStorage.setItem('user', JSON.stringify({ token: response.data }));

          this.userService.getUserInfo().subscribe(responseUser => {
            console.log(responseUser);
            if(response.status){
              this.changeStatusModalEvent.emit(false);
              this.authService.setAuthData(responseUser.data);
            }
          })
        }else{
          // this.toastr.handleErrorMessageWithNotification(response.message);
          this.errorMessage.account = "Tài khoản hoặc mật khẩu không chính xác";
        }
      },error => {
        this.toastr.handleErrorResponseWithNotification(error);
      });
    }
  }

  //Register phone
  handleRequestSendOtpRegister() {
    if (
      this.registerPhoneForm.name.length >= 6 &&
      this.registerPhoneForm.phone.length >= 9 &&
      this.statusViewPhone === authConstant.statusViewPhoneNotSendOtp
    ) {
      this.requestedSendOtp = true;
      this.statusViewPhone = authConstant.statusViewPhoneSendOtp;
      const resquest = {...this.registerPhoneForm,phone: this.countryCurrent.dial_code + this.registerPhoneForm.phone}
      this.authService.getOtpRegisterPhone(resquest).subscribe(response => {
        if(response.status){
         console.log(response)
        }else{
          this.ngxToastr.error(response.message,'',{
            progressBar: true
          });
        }
      },error => {
        console.log(error);
        this.ngxToastr.error("Xuất hiện lỗi hệ thống, vui lòng thử lại sau!",'',{
          progressBar: true
        });
      });
    }
  }

  onSubmitFormRegisterPhone() {
    if ( this.registerPhoneForm.name.length >= 6 && this.registerPhoneForm.phone.length >= 9 && this.registerPhoneForm.otp.length >= 6){
      const request = {
        ... this.registerPhoneForm,
        phone: this.countryCurrent.dial_code + this.registerPhoneForm.phone
      }
      this.authService.loginPhone(request).subscribe(response => {
        if(response.status){
          localStorage.setItem('user', JSON.stringify({ token: response.data }));

          this.userService.getUserInfo().subscribe(responseUser => {
            if(response.status){
              this.changeStatusModalEvent.emit(false);
              this.authService.setAuthData(responseUser.data);
            }
          })
        }
      },error => {
        if(error.error.status === 400){
          this.errorMessage.account = "Số điện thoại hoặc mã OTP không hợp lệ!";
        }
      });
    }
  }

  //Register email
  handleRequestSendOtpEmailRegister() {
    if (
      this.registerEmailForm.name.length >= 6 &&
      this.registerEmailForm.email.length >= 9 &&
      this.statusViewPhone === authConstant.statusViewPhoneNotSendOtp
    ) {
      this.requestedSendOtp = true;
      this.statusViewPhone = authConstant.statusViewPhoneSendOtp;

      this.authService.getOtpLoginEmail(this.registerEmailForm).subscribe(response => {
        if(response.status){
         console.log(response)
        }else{
          this.ngxToastr.error(response.message,'',{
            progressBar: true
          });
        }
      },error => {
        console.log(error);
        this.ngxToastr.error("Xuất hiện lỗi hệ thống, vui lòng thử lại sau!",'',{
          progressBar: true
        });
      });
    }
  }

  onSubmitFormRegisterEmail() {
    console.log(this.registerEmailForm.name.length,this.registerEmailForm.email.length,this.registerEmailForm.password.length);
    if (this.registerEmailForm.name.length >= 6 && this.registerEmailForm.email.length >= 9 && this.registerEmailForm.password.length >= 8 && this.registerEmailForm.name.length >= 6){
      this.authService.verifyOtpLoginEmail(this.registerEmailForm).subscribe(response => {
        if(response.status){
          localStorage.setItem('user', JSON.stringify({ token: response.data }));

          this.userService.getUserInfo().subscribe(responseUser => {
            if(response.status){
              this.changeStatusModalEvent.emit(false);
              this.authService.setAuthData(responseUser.data);
            }
          })
        }
      },error => {
        console.log(error);
      });
    }
  }
}
