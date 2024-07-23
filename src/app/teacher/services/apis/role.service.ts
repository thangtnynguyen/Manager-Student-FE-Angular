import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {


  constructor(private http: HttpTeacherLoadingService) { }

  getRoles(request: any = null): Observable<any> {
    return this.http.get('role/get', request);
  }
  createRole(request: any): Observable<any> {
    return this.http.postFormData('role/create', request);
  }
  editRole(request: any): Observable<any> {
    return this.http.postFormData('role/edit', request);
  }
  deleteRole(request: any): Observable<any> {
    return this.http.post('role/delete', request);
  }

  deleteMultipleRole(request: any): Observable<any> {
    return this.http.post('role/delete-multiple', request);
  }
}
