import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import systemConfig from 'src/app/teacher/configs/system.config';
import { UserService } from 'src/app/student/services/api/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((result: any) => {
      if(result.status){
        this.account = result.data;
      }
    });
  };

  public config: any = {
    baseUrl: systemConfig.baseUrl
  }

  //Account
  //Update
  public account: any = {
    name: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
    role:'Giáo viên'
  };

  public handleOnSubmitUpdateAccount(): void{
    this.userService.editUserInfo(this.account).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  public handleChangeImage(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.account.base64Image = e.target.result;
      };
  
      reader.readAsDataURL(file);
  
      this.account.imageFile = file;
    }
  }
}
