import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrefixApi } from '../../constants/prefix-api.constant';

@Injectable({
  providedIn: 'root', 
})
export class LessonService {
    private adminApiPrefix = PrefixApi.admin;

    constructor(private http: HttpClient) { }

    getLessonBySectionId(id: any): Observable<any> {
      return this.http.get<any>(`${this.adminApiPrefix}/lesson/get-lesson-by-section-id?id=${id}`);
    }

    createLesson(request: any): Observable<any> {
        return this.http.post<any>(`${this.adminApiPrefix}/lesson/create`,request);
    }

    editLesson(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/lesson/edit`,request);
    }

    deleteLesson(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/lesson/delete`,request);
    }
}
