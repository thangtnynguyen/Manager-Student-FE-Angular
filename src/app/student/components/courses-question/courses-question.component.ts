// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-courses-question',
//   templateUrl: './courses-question.component.html',
//   styleUrls: ['./courses-question.component.css']
// })
// export class CoursesQuestionComponent {

// }



import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QuestionCategoryService } from 'src/app/admin/services/apis/question-category.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import questionCategoryConstant from 'src/app/admin/constants/question-category.constant';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { QuestionCategoryTreeService } from 'src/app/admin/services/components/question-category-tree.service';
import { QuestionService } from 'src/app/admin/services/apis/question.service';
import { Router, ActivatedRoute } from '@angular/router';
import sortConstant from 'src/app/admin/constants/sortConstant';
import orderConstant from 'src/app/admin/constants/orderConstant';
import { DEFAULT_PER_PAGE_OPTIONS, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'src/app/admin/configs/paging.config';
import questionConstant from 'src/app/admin/constants/question.constant';
import questionHelper from 'src/app/admin/helpers/question.helper';
import { AddQuestionCategoryTreeService } from 'src/app/admin/services/components/add-question-category-tree.service';
import Swal from 'sweetalert2';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-courses-question',
  templateUrl: './courses-question.component.html',
  styleUrls: ['./courses-question.component.css']
})
export class CoursesQuestionComponent implements OnInit {
  // Constructor
  constructor(
    private ngxToastr: NgxToastrService,
    private questionCategoryService: QuestionCategoryService,
    private modalService: BsModalService,
    public questionCategoryTreeService: QuestionCategoryTreeService,
    private questionService: QuestionService, private router: Router,
    private route: ActivatedRoute,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private el: ElementRef,
  ) { }


  //Config
  public config: { [key: string]: any, perPageOptions: any[] } = { perPageOptions: DEFAULT_PER_PAGE_OPTIONS };



  //Question
  questions: any = [];
  //result check answer
  result: any = [];
  selectedAnswers: number[] = [];
  showResultModal: boolean = false;

  selectedItems: number[] = [];
  pageSize: any = 10;
  pageIndex: any = 1;
  totalPages: any;

  questionHelper: any = questionHelper;


  // Event
  ngOnInit() {
    this.addQuestionCategoryTreeService.resetState();

    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if (result.status) {

        const defaultCategory = result.data.find((category: any) => category.isDefault === true);

        this.addQuestionCategoryTreeService.questionCategories = result.data;

        this.addQuestionCategoryTreeService.id = defaultCategory.id;
      }
    });

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
        pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
      };

      this.getQuestions(request);
    });

    this.questionCategoryTreeService.myValueChange.subscribe((newValue) => {
      this.questionCategoryTreeService.setActiveCategoryId(0);
    });
  }


  questionContant: any = questionConstant;

  getQuestions(request: any): void {
    this.questionService.getQuestions(request).subscribe((result: any) => {
      if (result.status) {
        this.questions = result.data.items;
        this.totalPages = result.data.totalPages;

        console.log(this.questions);
      }
    });
  }

  selectQuestion(index: number): void {

  }


  /* js */
  // guiDapAn(): void {
  //   const request = this.questions.map((question: any, i: number) => {
  //     const radioButtons = this.el.nativeElement.querySelectorAll(`[name='answer${i}']`);
  //     const selectedRadioButton: HTMLInputElement | null = Array.from(radioButtons).find((radio: any) => radio.checked) as HTMLInputElement | null;
  
  //     return {
  //       questionId: question.id,
  //       questionAnswerId: selectedRadioButton ? +selectedRadioButton.value : 0 
  //     };
  //   });
  
  //   // api
  //   this.questionService.checkAnswer(request).subscribe((result: any) => {
  //     if (result.status) {
  //       this.result = result.data;
  //       console.log(this.result);
  //     }
  //   });
  // }
  
  closeModal(){
    this.showResultModal = false;

  }
  guiDapAn(): void {
    const request = this.questions.map((question: any, i: number) => {
      return {
        questionId: question.id,
        questionAnswerId: this.selectedAnswers[i] || 0
      };
    });

    //   api
    this.questionService.checkAnswer(request).subscribe((result: any) => {
      if (result.status) {
        this.result = result.data;
        console.log(this.result);
      }
    });

    this.showResultModal = true;

  }
  


  


}



 





