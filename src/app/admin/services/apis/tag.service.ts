import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class TagService {
  constructor(private http: HttpTeacherLoadingService) { }

  getTags(request: any = null): Observable<any> {
    return this.http.get('tag/get', request);
  }

  createTag(request: any): Observable<any> {
    return this.http.post('tag/create', request);
  }

  editTag(request: any): Observable<any> {
    return this.http.post('tag/edit', request);
  }

  deleteMultipleTag(request: any): Observable<any> {
    return this.http.post('tag/delete-multiple', request);
  }
  
}
