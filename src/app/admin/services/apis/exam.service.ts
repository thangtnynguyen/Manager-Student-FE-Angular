import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', 
})
export class ExamService {
  constructor(private http: HttpClient,private httpss: HttpTeacherLoadingService) { }


  private adminApiPrefix = PrefixApi.admin;

  getExams(request: any = null): Observable<any> {
    return this.httpss.get(`admin/exam/get`, request);
  }
  createExam(request: any): Observable<any> {
    return this.httpss.postFormData(`admin/exam/create`, request);
  }
  getExamById(request: any = null): Observable<any> {
    return this.httpss.get(`admin/exam/get-by-id`, request);
  }
  deleteExam(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/exam/delete`, request);
  }

  deleteMultipleExam(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/exam/delete-multiple`, request);
  }

  checkAnswer(request: any): Observable<any> {
    return this.httpss.post(`admin/exam/check-answers`, request);
  }

  addExamResult(request: any): Observable<any> {
    return this.httpss.postFormData(`admin/exam/add-exam-result`, request);
  }

  GetExamResultByStudentOne(request: any ): Observable<any> {
    return this.httpss.get(`admin/exam/get-exam-result-by-student-exam-id`, request);
  }
}
