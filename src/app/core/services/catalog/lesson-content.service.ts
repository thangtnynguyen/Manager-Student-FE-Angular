import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrefixApi } from '../../constants/prefix-api.constant';

@Injectable({
  providedIn: 'root', 
})
export class LessonContentService {
    private adminApiPrefix = PrefixApi.admin;

    constructor(private http: HttpClient) { }

    getLessonContentByLessonId(id: any): Observable<any> {
        return this.http.get<any>(`${this.adminApiPrefix}/lessoncontent/get-lesson-content-by-lesson-id?id=${id}`);
      }  

    createLessonContent(request: FormData): Observable<any> {
        return this.http.post<any>(`${this.adminApiPrefix}/lessoncontent/create`,request);
    }

    editLessonContent(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/lessoncontent/edit`,request);
    }

    deleteLessonContent(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/lessoncontent/delete`,request);
    }
}
