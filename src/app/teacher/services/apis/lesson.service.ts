import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class LessonService {
  constructor(private http: HttpTeacherLoadingService) { }

  getLessons(request: any = null): Observable<any> {
    return this.http.get('lesson/get', request);
  }
  createLesson(request: any): Observable<any> {
    return this.http.postFormData('lesson/create', request);
  }
}
