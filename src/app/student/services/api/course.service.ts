import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpGuestNotLoadingService } from 'src/app/shared/services/https/http-guest-not-loading.service';
import { HttpPublicService } from 'src/app/shared/services/https/http-public.service';
import { HttpStudentNotLoadingService } from 'src/app/shared/services/https/http-student-not-loading.service';
import { HttpStudentService } from 'src/app/shared/services/https/http-student.service';

@Injectable({
  providedIn: 'root', 
})
export class CourseService {
  constructor(private http: HttpPublicService, private httpStudentService: HttpStudentService) {
  }

  getCourseDatabase(): Observable<any> {
    return this.http.get('course/get-database-course');
  }

  getCourseLearningUser(request: any): Observable<any> {
    return this.httpStudentService.get('course/get-course-learning-user', request);
  }

  registerCourseStudent(request: any): Observable<any> {
    return this.httpStudentService.post('course/register-course-student', request);
  }
}
