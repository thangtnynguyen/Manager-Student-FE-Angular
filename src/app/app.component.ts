import { Component, ViewEncapsulation } from '@angular/core';
import { AuthToken } from './core/models/interfaces/common/auth-token.interface';
import { AuthService } from './core/services/identity/auth.service';
import { HttpStatus } from './core/enums/http-status.enum';
import { defaultSpinner } from './core/configs/spinner.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  //Core
  public DefaultSpinner = defaultSpinner;
  public title = 'UTEHY Databacourse Portal';
}
