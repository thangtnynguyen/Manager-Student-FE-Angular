import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class ExamService {
  constructor(private http: HttpTeacherLoadingService) { }

  getExams(request: any = null): Observable<any> {
    return this.http.get('exam/get', request);
  }

  getExamResults(request: any = null): Observable<any> {
    return this.http.get('admin/exam/get-result', request);
  } 
  createExam(request: any): Observable<any> {
    return this.http.postFormData('exam/create', request);
  }
  getExamById(request: any = null): Observable<any> {
    return this.http.get('exam/get-by-id', request);
  }
  deleteExam(request: any): Observable<any> {
    return this.http.post('exam/delete', request);
  }

  deleteMultipleExam(request: any): Observable<any> {
    return this.http.post('exam/delete-multiple', request);
  }
}
