import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { UserCurrent } from '../../models/interfaces/user/user-current.interface';
import { LocalStorageService } from '../utilities/local-storage.service';
import { AuthToken } from '../../models/interfaces/common/auth-token.interface';
import { LocalStorage } from '../../enums/local-storage.enum';
import { ApiResult } from '../../models/interfaces/common/api-result.interface';
import { LoginRequest } from '../../models/interfaces/auth/login-request.interface';
import { HttpService } from '../utilities/http.service';
import { RefreshTokenRequest } from '../../models/interfaces/auth/refresh-token-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCurrent: UserCurrent | null | undefined;
  private isInitAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isInitAuth$: Observable<boolean> = this.isInitAuthSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private httpService: HttpService) {}

  //Auth token
  getAuthTokenLocalStorage(): AuthToken | null{
    const authToken: AuthToken | null = this.localStorageService.getItem(LocalStorage.AuthToken);

    return authToken;
  }

  setAuthTokenLocalStorage(authToken: AuthToken| null){
    this.localStorageService.setItem(LocalStorage.AuthToken,authToken);
  }

  //User
  setUserCurrent(userCurrent: UserCurrent | null){
    this.userCurrent = userCurrent;
  }

  getUserCurrent(): UserCurrent | null | undefined{
    return this.userCurrent;
  }

  fetchUserCurrent(): Observable<ApiResult<UserCurrent>> {
    let headers = this.httpService.addSkipLoadingHeader();

    return this.http.get<ApiResult<UserCurrent>>('/auth/user-current',{ headers });
  }

  loginByUsername(request: LoginRequest): Observable<ApiResult<AuthToken>> {
    return this.http.post<ApiResult<AuthToken>>('/auth/login', request);
  }

  refreshToken(request: RefreshTokenRequest): Observable<ApiResult<AuthToken>>{
    return this.http.post<ApiResult<AuthToken>>('/auth/refresh-token', request);
  }

  logout(): Observable<ApiResult<boolean>> {
    return this.http.post<ApiResult<boolean>>('/auth/logout',null);
  }

  // loginByUsername(request: LoginRequest): Observable<ApiResult<UserCurrent>>{

  // }

//   logout(): Observable<void> {
//     return this.http.post<void>(`${this.apiUrl}/logout`, null);
//   }

//   refreshToken(): Observable<void> {
//     return this.http.post<void>(`${this.apiUrl}/logout`, null);
//   }

// //   currentUser(): Observable<UserCurrent | null> {
// //     const user = localStorage.getItem('currentUser');
// //     if (user) {
// //       return of(JSON.parse(user) as UserCurrent);
// //     } else {
// //       return of(null);
// //     }
// //   }

//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('currentUser');
//   }
}
