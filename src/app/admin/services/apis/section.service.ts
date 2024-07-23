import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class SectionService {
  constructor(private httpAdminLoading: HttpAdminLoadingService, private http: HttpClient) { }


  private adminApiPrefix = PrefixApi.admin;

  getSections(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/section/get`, request);
  }

  deleteSection(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/section/delete`, request);
  }

  deleteMultipleSection(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/section/delete-multiple`, request);
  }

  createSection(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/section/create`, request);
  }

  editSection(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/section/edit`, request);
  }
}
