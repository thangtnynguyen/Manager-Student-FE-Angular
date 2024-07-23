import { Component, Input, Output, EventEmitter, OnChanges, TemplateRef, ViewChild, HostListener  } from '@angular/core';
import { QuestionCategoryTreeService } from 'src/app/teacher/services/components/question-category-tree.service';
import questionCategoryConstant from 'src/app/teacher/constants/question-category.constant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { QuestionCategoryService } from 'src/app/teacher/services/apis/question-category.service';

@Component({
  selector: 'app-question-category-tree',
  templateUrl: './question-category-tree.component.html',
  styleUrls: ['./question-category-tree.component.css']
})
export class QuestionCategoryTreeComponent implements OnChanges {
  createQuestionCategoryModalRef?: BsModalRef;
  deleteQuestionCategoryModalRef?: BsModalRef;
  @ViewChild('createQuestionCategoryTemplate') createQuestionCategoryTemplate!: TemplateRef<any>;
  @ViewChild('deleteQuestionCategoryTemplate') deleteQuestionCategoryTemplate!: TemplateRef<any>;

  @Input() categories: any[] = [];
  @Input() categoriesSelect: any[] = [];
  @Input() activeCategoryId: number = 0;
  @Input() activeCategoryIdSelect: number = 0;
  @Input() type: number = 0;
  @Input() search: string = '';

  @Output() changeTreeEvent = new EventEmitter();

  questionCategory: any = {
    name: '',
    description: '',
    priority: 0,
    parentQuestionCategoryId: null
  };

  typeAction: number = 0;

  questionCategoryConstant: any = questionCategoryConstant;

  selectQuestionCategoryId: number = -1;

  constructor(public questionCategoryTreeService: QuestionCategoryTreeService, private modalService: BsModalService, private ngxToastr: NgxToastrService, private questionCategoryService: QuestionCategoryService) {}

  handleOnClickMenu(event: any, category: any){
    event.stopPropagation();
    category.isExpanded = !category.isExpanded;
    this.questionCategoryTreeService.setActiveCategoryId(category.id);
    this.questionCategoryTreeService.setSelectQuestionCategoryId(-1);
  }

  handleOnClickMenuSelect(event: any, category: any){
    event.stopPropagation();
    category.isExpanded = !category.isExpanded;
    this.questionCategoryTreeService.setActiveCategoryIdSelect(category.id);
    this.questionCategoryTreeService.setSelectQuestionCategoryId(-1);
  }

  isQuestionCategoriesIncludeKey(category: any): boolean {
    if (!category?.questionCategories) {
      return false;
    }
  
    const containsKeyword = category?.questionCategories.some((questionCategory: any) => {
      const currentCategoryMatch = questionCategory.name.trim().toLowerCase().includes(this.questionCategoryTreeService.searchKey.trim().toLowerCase());
      const childCategoriesMatch = this.isQuestionCategoriesIncludeKey(questionCategory);
      return currentCategoryMatch || childCategoriesMatch;
    });
  
    return containsKeyword;
  }

  isQuestionCategoriesIncludeId(category: any): boolean {
    if (category?.id === this.questionCategoryTreeService.activeCategoryIdSelect) {
      return false;
    }

    if (!category?.questionCategories) {
      return false;
    }
  
    const containsKeyword = category?.questionCategories.some((questionCategory: any) => {
      const currentCategoryMatch = questionCategory.id === this.questionCategoryTreeService.activeCategoryIdSelect;
      const childCategoriesMatch = this.isQuestionCategoriesIncludeId(questionCategory);
      return currentCategoryMatch || childCategoriesMatch;
    });
  
    return containsKeyword;
  }

  ngOnChanges(changes: any) {
    if (changes.search) {
      this.questionCategoryTreeService.setSearchKey(changes.search.currentValue)
      this.activeCategoryId = 0;
      this.questionCategoryTreeService.setActiveCategoryId(0);
    }
  }

  handleOnOpenActionQuestionCategoryMenu(event: any,category: any){
    if(this.questionCategoryTreeService.activeCategoryId === category.id && category.id !== 0){
      this.questionCategoryTreeService.setSelectQuestionCategoryId(category.id);
    }
    event.preventDefault();    
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    this.questionCategoryTreeService.setSelectQuestionCategoryId(-1);
  }

  handleOnClickMenuAction(action: number ,category: any): void {
    this.questionCategoryTreeService.setTypeAction(action);

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

    if(action === questionCategoryConstant.editAction){
      this.questionCategory =  { ...category };
      this.questionCategoryTreeService.setQuestionCategoryEdit(category.id);

      this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
        if(result.status){
          const filteredArray = result.data.filter((item: any) => item.id !== null && item.id !== 0);
          this.categoriesSelect = [
            {
              id: 0,
              name: 'Tất cả',
              questionCategories: filteredArray
            }
          ]
        }
      });

      this.questionCategoryTreeService.setActiveCategoryIdSelect(category.parentQuestionCategoryId === null ? 0 : category.parentQuestionCategoryId);

      this.createQuestionCategoryModalRef = this.modalService.show(this.createQuestionCategoryTemplate,
        Object.assign({}, { class: 'modal-dialog modal-dialog-scrollable' }));

        console.log("Data",this.questionCategoryTreeService.activeCategoryIdSelect)
    }

    if(action === questionCategoryConstant.deleteAction){
      this.questionCategory =  { ...category };

      this.deleteQuestionCategoryModalRef = this.modalService.show(this.deleteQuestionCategoryTemplate,
        Object.assign({}, { class: 'modal-dialog' }));
    }

    this.questionCategoryTreeService.setSelectQuestionCategoryId(-1);
  }

  handleOnCloseCreateQuestionCategoryModal() {
    this.createQuestionCategoryModalRef?.hide();
  }

  handleOnSubmitCreateQuestionCategoryForm(){
    if(this.questionCategoryTreeService.typeAction === questionCategoryConstant.addAction){
      const request = { ...this.questionCategory }; 

      this.questionCategoryService.createQuestionCategory(request).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.questionCategoryTreeService.setChangeTree(0);
        
        this.createQuestionCategoryModalRef?.hide();
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
      });
    }else if (this.questionCategoryTreeService.typeAction === questionCategoryConstant.editAction) {
      const request = { ...this.questionCategory, parentQuestionCategoryId: this.questionCategoryTreeService.activeCategoryIdSelect === 0 ? null : this.questionCategoryTreeService.activeCategoryIdSelect };
      
      this.questionCategoryService.editQuestionCategory(request).subscribe((result: any) => {
        if(result.status){
          this.ngxToastr.success(result.message,'',{
            progressBar: true
          });
          this.questionCategoryTreeService.setChangeTree(request.id);
          this.createQuestionCategoryModalRef?.hide();
        }
      },error => {
        console.log(error);
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });
    } else if(this.questionCategoryTreeService.typeAction === questionCategoryConstant.deleteAction){
      const request = { id: this.questionCategory.id };

      this.questionCategoryService.deleteQuestionCategory(request).subscribe((result: any) => {
        if(result.status){
          this.ngxToastr.success(result.message,'',{
            progressBar: true
          });
          this.questionCategoryTreeService.setChangeTree(request.id);
          this.deleteQuestionCategoryModalRef?.hide();
        }
      },error => {
        console.log(error);
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });
    }
  }

  getQuestionCategoryTree(){
    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if(result.status){
        this.categories = result.data;
      }
    });
  } 
}
