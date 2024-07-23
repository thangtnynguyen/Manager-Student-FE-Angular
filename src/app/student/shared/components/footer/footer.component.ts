import { Component } from '@angular/core';
import { AuthService } from 'src/app/student/services/api/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(private authService: AuthService){

  }

  handleOnLogOut(){
    this.authService.logout();

    
  }
}
