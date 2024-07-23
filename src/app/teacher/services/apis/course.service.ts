import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class CourseService {
  constructor(private http: HttpTeacherLoadingService) { }

  getCourseDatabase(): Observable<any> {
    return this.http.get('course/get-database-course', {});
  }

  editCourseDatabase(request: any): Observable<any> {
    return this.http.post('course/edit-database-course', request);
  }
}
