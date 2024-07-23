import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class QuestionService {
  constructor(private http: HttpTeacherLoadingService, private https: HttpClient) { }

  getQuestions(request: any = null): Observable<any> {
    return this.http.get('question/get', request);
  }

  createQuestion(request: any): Observable<any> {
    return this.http.post('question/create', request);
  }
  getQuestionById(request: any): Observable<any> {
    return this.http.get(`question/get-by-id?id=${request.id}`,{});
  }

  editQuestion(request: any): Observable<any> {
    return this.http.post('question/edit', request);
  }

  deleteQuestion(request: any): Observable<any> {
    return this.http.post('question/delete', request);
  }
  deleteMultipleQuestion(request: any): Observable<any> {
    return this.http.post('question/delete-multiple', request);
  }
  checkAnswer(request: any): Observable<any> {
    return this.http.post('question/check-answers', request);
  }

  import(request: any): Observable<any> {
    return this.http.post('post/import-posts', request);
  }

  importPosts(file: File) {
    const formData: FormData = new FormData();
    formData.append('formFile', file, file.name);

    return this.https.post(`https://localhost:7038/api/admin/post/import-posts`, formData);
  }

}
