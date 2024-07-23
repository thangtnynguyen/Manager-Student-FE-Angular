import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import systemConfig from 'src/app/admin/configs/system.config';
import { AuthService } from 'src/app/student/services/api/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  //Init
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public config: any = {
    baseUrl: systemConfig.baseUrl
  }

  //User
  public isShowDropdownUser: boolean = false;

  @HostListener('document:click', ['$event'])
  public toggleDropdownUser(event: any): void{
    const targetElement = event.target as HTMLElement;

    if (targetElement.classList.contains('logout-button')) {
      this.handleOnLogout();
      return;
    }

    if (targetElement.classList.contains('user-dropdown-item')) {
      this.isShowDropdownUser = true;
    } else {
      this.isShowDropdownUser = false;
    }
  }
  
  public handleOnLogout(){
    this.authService.logout();

    this.router.navigate(['/admin/auth/login']);
  }
}
