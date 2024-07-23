import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/identity/auth.service';
import { Page } from '../enums/page.enum';
import { AuthToken } from '../models/interfaces/common/auth-token.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private loadingService: NgxSpinnerService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      if(this.authService.getUserCurrent()){
        return of(true);
      } else{
        this.loadingService.show();
        const authToken: AuthToken | null = this.authService.getAuthTokenLocalStorage();
    
        if (authToken?.accessToken) {
          return this.authService.fetchUserCurrent().pipe(
            map(res => {
              if (res.status) {
                this.authService.setUserCurrent(res.data);
                this.loadingService.hide();
                return true;
              } else {
                this.authService.setUserCurrent(null);
                this.loadingService.hide();
                this.router.navigate([Page.Login]);
                return false;
              }
            }),
            catchError(() => {
              this.authService.setUserCurrent(null);
              this.loadingService.hide();
              this.router.navigate([Page.Login]);
              return of(false);
            })
          );
        } else {
          this.authService.setUserCurrent(null);
          this.loadingService.hide();
          this.router.navigate([Page.Login]);
          return of(false);
        }
      }
  }
}
