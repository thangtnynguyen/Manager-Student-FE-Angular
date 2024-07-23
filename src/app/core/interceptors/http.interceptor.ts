import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor as HttpSystemInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize, filter, take, retry } from 'rxjs/operators';

import { app } from '../configs/app.config';
import { LocalStorage } from '../enums/local-storage.enum';
import { AuthToken } from '../models/interfaces/common/auth-token.interface';
import { LocalStorageService } from '../services/utilities/local-storage.service';
import { LoadingUiService } from '../modules/loading-ui/loading-ui.service';
import { AuthService } from '../services/identity/auth.service';
import { Header } from '../enums/request.enum';
import { HttpStatus } from '../enums/http-status.enum';
import { RefreshTokenRequest } from '../models/interfaces/auth/refresh-token-request.interface';
import { Router } from '@angular/router';
import { Page } from '../enums/page.enum';

@Injectable()
export class HttpInterceptor implements HttpSystemInterceptor {
  private apiUrl: string = app.apiUrl;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private localStorageService: LocalStorageService, private loadingService: LoadingUiService, private authService: AuthService,private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.headers.has(Header.SkipLoading)) {
      this.loadingService.show();
    } else {
      request = request.clone({
        headers: request.headers.delete(Header.SkipLoading)
      });
    }

    const authToken = this.localStorageService.getItem(LocalStorage.AuthToken) as AuthToken;

    request = request.clone({
      url: `${this.apiUrl}${request.url}`
    });

    if (authToken?.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken.accessToken}`,
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === HttpStatus.Unauthorized) {
          return this.handleUnauthorizedError(request, next);
        }

        return throwError(error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.isRefreshing){
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const authToken: AuthToken = this.localStorageService.getItem(LocalStorage.AuthToken); 
      const refreshToken = authToken.refreshToken;
      if (!refreshToken) {
        return throwError('Không tồn tại RereshToken hợp lệ!');
      }

      const refreshTokenRequest = {
        refreshToken: refreshToken
      } as RefreshTokenRequest;

      return this.authService.refreshToken(refreshTokenRequest).pipe(
        switchMap((res: any) => {
          this.localStorageService.setItem(LocalStorage.AuthToken, res.data);

          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.data.accessToken);
          
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${res.data.accessToken}`,
            }
          });
          return next.handle(request);
        }),
        catchError((error: any) => {
          this.isRefreshing = false;
          
          this.authService.setUserCurrent(null);
          this.authService.setAuthTokenLocalStorage(null);

          this.router.navigate([Page.Login]);
          return throwError('AccessToken hoặc RefreshToken không hợp lệ!');
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          }
        });

        return next.handle(request);
      })
    );
  }
}
