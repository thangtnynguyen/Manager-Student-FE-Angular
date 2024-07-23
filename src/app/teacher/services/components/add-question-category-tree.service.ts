import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddQuestionCategoryTreeService {
  constructor() { }

  questionCategories: any[] = [];
  id: number = 0;
  currentId = 0;
  search: string = '';
  type: number = -1;

  resetState(){
    this.questionCategories = [];
    this.id = 0;
    this.currentId = 0;
    this.search = '';
    this.type = -1;
  }
}
