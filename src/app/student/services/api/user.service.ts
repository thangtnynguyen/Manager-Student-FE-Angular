import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpGuestNotLoadingService } from 'src/app/shared/services/https/http-guest-not-loading.service';
import { HttpNotLoadingService } from 'src/app/shared/services/https/http-not-loading.service';
import { HttpStudentLoadingService } from 'src/app/shared/services/https/http-student-loading.service';



import { HttpClient } from '@angular/common/http';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { ApiResult } from 'src/app/core/models/interfaces/common/api-result.interface';


@Injectable({
  providedIn: 'root', 
})
export class UserService {


  // constructor(private http: HttpGuestNotLoadingService) { }

  private adminApiPrefix = PrefixApi.admin;

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.http.get('/user/user-info', {});
  }

  editUserInfo(request: any): Observable<any> {
    return this.http.post('/user/edit-user-info', request);
  }
}
