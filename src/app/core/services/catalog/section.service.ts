import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrefixApi } from '../../constants/prefix-api.constant';

@Injectable({
  providedIn: 'root', 
})
export class SectionService {
    private adminApiPrefix = PrefixApi.admin;

    constructor(private http: HttpClient) { }

    getAllSection(): Observable<any> {
      return this.http.get<any>(`${this.adminApiPrefix}/section/get-all`);
    }

    getSectionWithLesson(id: any): Observable<any> {
      return this.http.get<any>(`${this.adminApiPrefix}/section/get-section-with-lesson?id=${id}`);
    }

    createSection(request: any): Observable<any> {
        return this.http.post<any>(`${this.adminApiPrefix}/section/create`,request);
    }

    editSection(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/section/edit`,request);
    }

    deleteSection(request: any): Observable<any> {
      return this.http.post<any>(`${this.adminApiPrefix}/section/delete`,request);
    }
}
