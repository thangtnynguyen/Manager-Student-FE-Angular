import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionCategoryTreeService {
  public activeCategoryId: number = 0;
  public activeCategoryIdSelect: number = 0;
  public searchKey: string = '';
  public selectQuestionCategoryId: number = -1;
  public typeAction: number = -1;
  public questionCategoryEdit = 0;
  public myValueChange = new EventEmitter<number>();

  constructor() { }

  setActiveCategoryId(categoryId: number): void {
    this.activeCategoryId = categoryId;
  }

  setActiveCategoryIdSelect(categoryId: number): void {
    this.activeCategoryIdSelect = categoryId;
  }

  setSearchKey(key: string): void {
    this.searchKey = key;
  }

  setSelectQuestionCategoryId(id: number){
    this.selectQuestionCategoryId = id;
  }

  setTypeAction(id: number){
    this.typeAction = id;
  }

  setQuestionCategoryEdit(id: number){
    this.questionCategoryEdit = id;
  }

  setChangeTree(id: number){
    this.myValueChange.emit(id);
  }
}
