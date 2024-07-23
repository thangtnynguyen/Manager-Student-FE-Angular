import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QuestionCategoryService } from 'src/app/teacher/services/apis/question-category.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import questionCategoryConstant from 'src/app/teacher/constants/question-category.constant';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { QuestionCategoryTreeService } from 'src/app/teacher/services/components/question-category-tree.service';
import { QuestionService } from 'src/app/teacher/services/apis/question.service';
import { Router, ActivatedRoute } from '@angular/router';
import sortConstant from 'src/app/teacher/constants/sortConstant';
import orderConstant from 'src/app/teacher/constants/orderConstant';
import { DEFAULT_PER_PAGE_OPTIONS, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'src/app/teacher/configs/paging.config';
import questionConstant from 'src/app/teacher/constants/question.constant';
import questionHelper from 'src/app/teacher/helpers/question.helper';
import { AddQuestionCategoryTreeService } from 'src/app/teacher/services/components/add-question-category-tree.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-category',
  templateUrl: './question-category.component.html',
  styleUrls: ['./question-category.component.css']
})
export class QuestionCategoryComponent {
  constructor(
    private ngxToastr: NgxToastrService,
    private questionCategoryService: QuestionCategoryService, 
    private modalService: BsModalService, 
    public questionCategoryTreeService: QuestionCategoryTreeService, 
    private questionService: QuestionService,private router: Router, 
    private route: ActivatedRoute,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService
    ) 
    { }

    ngOnInit() {
      this.addQuestionCategoryTreeService.resetState();
  
      this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
        if(result.status){
          this.questionCategoryTree = result.data;
  
          const defaultCategory = result.data.find((category: any) => category.isDefault === true);
  
          this.questionCategory = defaultCategory;
  
          this.addQuestionCategoryTreeService.questionCategories = result.data;
  
          this.addQuestionCategoryTreeService.id = defaultCategory.id;

          this.route.queryParams.subscribe(params => {
            const request = {
              ...params,
              pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
              pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
            };
    
            this.search = {
              ...params,
              type: params['type'] ? params['type'] : 0,
            }

            if(this.search.questionCategoryId){
              const defaultCategory = result.data.find((category: any) => category.id === +this.search.questionCategoryId);

              this.questionCategory = defaultCategory;
  
              this.addQuestionCategoryTreeService.questionCategories = result.data;
  
              this.addQuestionCategoryTreeService.id = defaultCategory.id;

              this.addQuestionCategoryTreeService.currentId = defaultCategory.id;
            }
      
            this.getQuestions(request);
          });
        }
      });
  
      this.questionCategoryTreeService.myValueChange.subscribe((newValue) => {
        this.getQuestionCategoryTree(); 
        this.questionCategoryTreeService.setActiveCategoryId(0);
      });
    }

  //Constant
  sortConstant: any = sortConstant;
  orderConstant: any = orderConstant;
   //Config
   public config: { [key: string]: any, perPageOptions: any[]  } = { perPageOptions: DEFAULT_PER_PAGE_OPTIONS };

  //Collapse
  questionCategoryConstant: any = questionCategoryConstant;
  collapseFilter: any = {
    questionCategory: false,
    typeQuestion: false,
  };
  
  questionCategories: any = [];
  questionCategoriesSelect: any = [];
  activeCategoryIdSelect: number = 0;
  test: any = null;

  onTestChange(event: any) {
    this.test = event.target.files[0];
  }

  onTest(){
    const formData = new FormData();

    formData.append('FormFile', this.test);

    this.questionService.importPosts(this.test).subscribe((result: any) => {
      this.ngxToastr.success('Import thành công','',{
        progressBar: true
      });
      // if(result.status){
      //   this.ngxToastr.success('Import thành công','',{
      //     progressBar: true
      //   });
      //   // this.router.navigate(['/teacher/post']);
      // }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });

  }

  //Question
  questions: any = [];
  search: any = {
    orderBy: '',
    sortBy: '',
    questionCategoryId: 0,
    type: 0,
    title: ''
  };
  selectedItems: number[] = [];
  pageSize: any = 10;
  pageIndex: any = 1;
  totalPages: any;

  questionHelper: any = questionHelper;

  //Question category search
  questionCategoryTree: any[] = [];
  questionCategory: any = {
    id: "",
    name: ""
  };
  questionCategorySearch: string = '';

  createQuestionCategoryModalRef?: BsModalRef;
  @ViewChild('questionCategoryTreeTemplate') questionCategoryTreeTemplate!: TemplateRef<any>;
  
  handleOpenQuestionCategoryTreeModal(){
    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if(result.status){
        this.questionCategoryTree = result.data;

        const defaultCategory = result.data.find((category: any) => category.isDefault === true);

        this.addQuestionCategoryTreeService.questionCategories = result.data;

        this.addQuestionCategoryTreeService.id = defaultCategory.id;
      }
    });
    this.createQuestionCategoryModalRef = this.modalService.show(this.questionCategoryTreeTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createQuestionCategoryModalRef.onHidden?.subscribe(() => {
      const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);

      this.addQuestionCategoryTreeService.id = defaultCategory.id;   
      
      this.questionCategorySearch = '';
    });
  }

  handleCloseQuestionCategoryTreeModal(){
    const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);

    this.addQuestionCategoryTreeService.id = defaultCategory.id;   
    
    this.questionCategorySearch = '';

    this.createQuestionCategoryModalRef?.hide();
  }

  handleChooseQuestionCategoryId(){
    this.search.questionCategoryId = this.addQuestionCategoryTreeService.id;

    this.addQuestionCategoryTreeService.currentId = this.addQuestionCategoryTreeService.id;

    const category = this.findCategoryById(this.addQuestionCategoryTreeService.questionCategories,this.addQuestionCategoryTreeService.id);

    this.questionCategory = category;

    this.createQuestionCategoryModalRef?.hide();
  }

  handleChangeSearchCategory(){
    const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);
    this.addQuestionCategoryTreeService.id = defaultCategory.id;
  }

  findCategoryById(categories: any[], targetId: number): any | null {
    for (const category of categories) {
        if (category.id === targetId) {
            return category; 
        }

        if (category.questionCategories) {
            const foundInChildren = this.findCategoryById(category.questionCategories, targetId);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }

    return null;
  }

  //Question category
  getQuestionCategoryTree(){
    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if(result.status){
        this.questionCategories = result.data;
      }
    });
  }

  handleOnClickCreateQuestionCategoryButton(){
    this.questionCategory = {
      name: '',
      description: '',
      priority: 0,
      parentQuestionCategoryId: null
    };
    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if(result.status){
        const filteredArray = result.data.filter((item: any) => item.id !== null && item.id !== 0);
        this.questionCategoriesSelect = [
          {
            id: 0,
            name: 'Tất cả',
            questionCategories: filteredArray
          }
        ]
      }
    });

    this.questionCategoryTreeService.setActiveCategoryIdSelect(0);
    this.questionCategoryTreeService.setTypeAction(1);

    this.createQuestionCategoryModalRef = this.modalService.show(this.questionCategoryTreeTemplate,
    Object.assign({}, { class: 'modal-dialog modal-dialog-scrollable' }));
  }

  handleOnCloseCreateQuestionCategoryModal() {
    this.createQuestionCategoryModalRef?.hide();
  }

  handleOnSubmitCreateQuestionCategoryForm(){
    const request = { ...this.questionCategory, parentQuestionCategoryId: this.questionCategoryTreeService.activeCategoryIdSelect === 0 ? null : this.questionCategoryTreeService.activeCategoryIdSelect }; 

    this.questionCategoryService.createQuestionCategory(request).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.getQuestionCategoryTree();
        this.createQuestionCategoryModalRef?.hide();
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  //Question
  questionContant: any = questionConstant;

  getQuestions(request: any): void{
    this.questionService.getQuestions(request).subscribe((result: any) => {
      if(result.status){
        this.questions = result.data.items;
        this.totalPages = result.data.totalPages;
      }
    });
  }

  selectAllQuestions(event: any): void{
    if (event.target.checked) {
      this.selectedItems = this.questions.map((teacher: any) => teacher.id);
    } else {
      this.selectedItems = [];
    }
  }

  //Here
  handleSubmitSearch(){
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        title: this.search.title ? this.search.title : null,
        questionCategoryId: this.search.questionCategoryId ? this.search.questionCategoryId : null,
        type: this.search.type ? this.search.type : null
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  onPerPageChange(event: any): void {
    this.pageSize = +event.target.value;

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageSize: this.pageSize,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  onSortAndOrderChange(orderBy: string) {
    if(this.search.orderBy === orderBy){
      this.search.sortBy = this.search.sortBy === sortConstant.asc ? sortConstant.desc: sortConstant.asc;
    }else{
      this.search.sortBy = sortConstant.desc;
    }

    this.search = {
      orderBy: orderBy,
      sortBy: this.search.sortBy
    };

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        orderBy: this.search.orderBy,
        sortBy: this.search.sortBy,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  isSelected(teacherId: number): boolean {
    return this.selectedItems.includes(teacherId);
  }

  toggleSelection(questionId: number): void {
    if (this.isSelected(questionId)) {
        this.selectedItems = this.selectedItems.filter((id) => id !== questionId);
    } else {
        this.selectedItems.push(questionId);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      
      this.route.queryParams.subscribe(params => {
        const request = {
          ...params,
          pageIndex: this.pageIndex,
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: request,
          queryParamsHandling: 'merge',
        });
      });
    }
  }

  handleDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá câu hỏi có Id ${id}?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: id
        }

        this.questionService.deleteQuestion(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi câu hỏi có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
                pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
              };

              this.getQuestions(request);
            });
          }
        }, error => {
          console.log(error);
          this.ngxToastr.error(error.error.message, '', {
            progressBar: true
          });
        });
      }
    });
  }
}
