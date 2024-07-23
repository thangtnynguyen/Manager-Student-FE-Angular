import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpTeacherLoadingService) { }

  getPermissions(request: any = null): Observable<any> {
    return this.http.get('admin/permission/get', request);
  }
  getPermissionByRoleId(request: any = null): Observable<any> {
    return this.http.get('admin/permission/get-by-role', request);
  }
  


}
