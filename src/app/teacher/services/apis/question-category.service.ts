import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class QuestionCategoryService {
  constructor(private http: HttpTeacherLoadingService) { }

  getQuestionCategoryTree(): Observable<any> {
    return this.http.get('question-category/get-tree', {});
  }

  createQuestionCategory(request: any): Observable<any> {
    return this.http.post('question-category/create', request);
  }

  editQuestionCategory(request: any): Observable<any> {
    return this.http.post('question-category/edit', request);
  }

  deleteQuestionCategory(request: any): Observable<any> {
    return this.http.post('question-category/delete', request);
  }
}
