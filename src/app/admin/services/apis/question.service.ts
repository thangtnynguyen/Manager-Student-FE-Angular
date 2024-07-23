import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';

@Injectable({
  providedIn: 'root', 
})
export class QuestionService {
  constructor(private http: HttpTeacherLoadingService, private https: HttpClient) { }
  // constructor(private http: HttpClient) { }


  private adminApiPrefix = PrefixApi.admin;

  getQuestions(request: any = null): Observable<any> {
    return this.http.get(`admin/question/get`, request);
  }

  createQuestion(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/question/create`, request);
  }
  getQuestionById(request: any): Observable<any> {
    return this.http.get(`question/get-by-id?id=${request.id}`,{});
  }

  editQuestion(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/question/edit`, request);
  }

  deleteQuestion(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/question/delete`, request);
  }
  deleteMultipleQuestion(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/question/delete-multiple`, request);
  }
  checkAnswer(request: any): Observable<any> {
    return this.http.post(`admin/question/check-answers`, request);
  }

  import(request: any): Observable<any> {
    return this.http.post('post/import-posts', request);
  }

  importPosts(file: File) {
    const formData: FormData = new FormData();
    formData.append('formFile', file, file.name);

    return this.http.post(`https://localhost:7038/api/admin/post/import-posts`, formData);
  }


  importQuestionsExcel(request: any): Observable<any> {
    return this.http.postFormData(`admin/question/import-questions-excel`, request);
    // return this.http.postFormData(`${this.adminApiPrefix}/group-module/import-students-excel`, request);
  }


}
