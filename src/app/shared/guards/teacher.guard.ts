import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/student/services/api/auth.service';
import permissionConstant from '../constants/permisson.constant';


@Injectable({
  providedIn: 'root',
})
export class teacherGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.hasPermisson(this.permisson.teacher)) {
      return true;
    } else {
      this.router.navigate(['/admin/auth/login']);
      return false;
    }
  }

  private permisson = permissionConstant;
};
