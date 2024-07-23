import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import questionCategoryConstant from 'src/app/teacher/constants/question-category.constant';
import { AddQuestionCategoryTreeService } from 'src/app/teacher/services/components/add-question-category-tree.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-question-category-tree',
  templateUrl: './add-question-category-tree.component.html',
  styleUrls: ['./add-question-category-tree.component.css']
})
export class AddQuestionCategoryTreeComponent implements OnInit {
  constructor(
    public addQuestionCategoryService: AddQuestionCategoryTreeService,
    private modalService: BsModalService, 
  ) {}

  ngOnInit() {
    
  }

  @Input() categories: any[] = [];
  @Input() activeId: number = 0;
  @Input() search: string = '';

  //Question category tree
  questionCategory: any = {
    name: '',
    description: '',
    priority: 0,
    parentQuestionCategoryId: null
  };

  type: number = 0;

  questionCategoryConstant: any = questionCategoryConstant;

  isQuestionCategoriesIncludeKey(category: any): boolean {
    if(category.isDefault === true){
      return true;
    }

    if (!category?.questionCategories) {
      return false;
    }
  
    const containsKeyword = category?.questionCategories.some((questionCategory: any) => {
      const currentCategoryMatch = questionCategory.name.trim().toLowerCase().includes(this.search.trim().toLowerCase());
      const childCategoriesMatch = this.isQuestionCategoriesIncludeKey(questionCategory);
      return currentCategoryMatch || childCategoriesMatch;
    });
  
    return containsKeyword;
  }

  isQuestionCategoriesIncludeId(category: any): boolean {
    if (category?.id === this.addQuestionCategoryService.currentId) {
      return false;
    }

    if (!category?.questionCategories) {
      return false;
    }
  
    const containsKeyword = category?.questionCategories.some((questionCategory: any) => {
      const currentCategoryMatch = questionCategory.id === this.addQuestionCategoryService.currentId;
      const childCategoriesMatch = this.isQuestionCategoriesIncludeId(questionCategory);
      return currentCategoryMatch || childCategoriesMatch;
    });
  
    return containsKeyword;
  }

  handleOnClickMenu(event: any, category: any){
    event.stopPropagation();
    category.isExpanded = !category.isExpanded;
    this.addQuestionCategoryService.id = category.id;
    this.addQuestionCategoryService.currentId = -1;
  }

  handleOnOpenActionQuestionCategoryMenu(event: any,category: any){
    const defaultCategory = this.addQuestionCategoryService.questionCategories.find((category: any) => category.isDefault === true);

    if(this.addQuestionCategoryService.id === category.id && category.id !== defaultCategory.id){
      this.addQuestionCategoryService.currentId = category.id;
    }

    event.preventDefault();    
  }

  handleOnClickMenuAction(event: any,action: number ,category: any): void {
    event.stopPropagation();

    this.addQuestionCategoryService.type = -1;

    if(action === questionCategoryConstant.addAction){
      this.questionCategory = {
        name: '',
        description: '',
        priority: 0,
        parentQuestionCategoryId: category.id
      };
  
      this.createQuestionCategoryModalRef = this.modalService.show(this.createQuestionCategoryTemplate,
      Object.assign({}, { class: 'modal-dialog modal-dialog-scrollable' }));
    }

    // if(action === questionCategoryConstant.editAction){
    //   this.questionCategory =  { ...category };
    //   this.questionCategoryTreeService.setQuestionCategoryEdit(category.id);

    //   this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
    //     if(result.status){
    //       const filteredArray = result.data.filter((item: any) => item.id !== null && item.id !== 0);
    //       this.categoriesSelect = [
    //         {
    //           id: 0,
    //           name: 'Tất cả',
    //           questionCategories: filteredArray
    //         }
    //       ]
    //     }
    //   });

    //   this.questionCategoryTreeService.setActiveCategoryIdSelect(category.parentQuestionCategoryId === null ? 0 : category.parentQuestionCategoryId);

    //   this.createQuestionCategoryModalRef = this.modalService.show(this.createQuestionCategoryTemplate,
    //     Object.assign({}, { class: 'modal-dialog modal-dialog-scrollable' }));

    //     console.log("Data",this.questionCategoryTreeService.activeCategoryIdSelect)
    // }

    // if(action === questionCategoryConstant.deleteAction){
    //   this.questionCategory =  { ...category };

    //   this.deleteQuestionCategoryModalRef = this.modalService.show(this.deleteQuestionCategoryTemplate,
    //     Object.assign({}, { class: 'modal-dialog' }));
    // }

    this.addQuestionCategoryService.currentId = -1;
  }

  //Add question category
  @ViewChild('createQuestionCategoryTemplate') createQuestionCategoryTemplate!: TemplateRef<any>;
  createQuestionCategoryModalRef?: BsModalRef;

  handleOnSubmitCreateQuestionCategoryForm(){

  }

  handleOnCloseCreateQuestionCategoryModal(){

  }
}
