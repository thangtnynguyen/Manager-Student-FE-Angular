import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class ContentLessonService {
  constructor(private http: HttpTeacherLoadingService) { }

  getContentLessons(request: any = null): Observable<any> {
    return this.http.get('lessoncontent/get', request);
  }
  createContentLesson(request: any): Observable<any> {
    return this.http.postFormData('lessoncontent/create', request);
  }
}
