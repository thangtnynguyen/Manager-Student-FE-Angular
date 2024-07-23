import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class SectionService {
  constructor(private httpAdminLoading: HttpAdminLoadingService, private http: HttpClient) { }

  getSections(request: any): Observable<any> {
    return this.httpAdminLoading.get('section/get', request);
  }

  deleteSection(request: any): Observable<any> {
    return this.httpAdminLoading.post('section/delete', request);
  }

  deleteMultipleSection(request: any): Observable<any> {
    return this.httpAdminLoading.post('section/delete-multiple', request);
  }

  createSection(request: any): Observable<any> {
    return this.httpAdminLoading.postFormData('section/create', request);
  }

  editSection(request: any): Observable<any> {
    return this.httpAdminLoading.postFormData('section/edit', request);
  }
}
