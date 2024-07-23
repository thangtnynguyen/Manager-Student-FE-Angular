import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import systemConfig from 'src/app/admin/configs/system.config';
import { app } from 'src/app/core/configs/app.config';
import { Page } from 'src/app/core/enums/page.enum';
import { UserCurrent } from 'src/app/core/models/interfaces/user/user-current.interface';
import { ToastrService } from 'src/app/core/modules/toastr/toastr.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  //Core
  App = app;
  Page = Page;

  //State
  userCurrent: UserCurrent;

  //Init
  constructor(public authService: AuthService,private router: Router, private toastrService: ToastrService) {
    this.userCurrent = this.authService.getUserCurrent() as UserCurrent;
  }

  ngOnInit() {}
  
  public logout(){
    this.authService.logout().subscribe(
      (res) => {
        if(res.status){
          this.authService.setUserCurrent(null);
          this.authService.setAuthTokenLocalStorage(null);
          this.router.navigate([Page.Login]);
        }
      },
      (exception) => {
        this.toastrService.error(exception.error.Message);
      }
    );
  }
}
