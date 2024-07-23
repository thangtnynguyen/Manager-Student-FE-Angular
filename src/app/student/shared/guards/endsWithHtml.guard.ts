import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class EndsWithHtmlGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const url = state.url;
    if (url.endsWith('.html')) {
      return true;
    } else {
        this.router.navigate(['/error/error-400'], { skipLocationChange: true });
        return true;
    }
  }
}
