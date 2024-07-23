// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-testing',
//   templateUrl: './testing.component.html',
//   styleUrls: ['./testing.component.css']
// })
// export class TestingComponent {

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
import { ExamService } from 'src/app/admin/services/apis/exam.service';


import { CountdownEvent } from 'ngx-countdown';

import { UserCurrent } from 'src/app/core/models/interfaces/user/user-current.interface';
import { AuthService } from 'src/app/core/services/identity/auth.service';

import { AuthService as StudentAuthService } from 'src/app/student/services/api/auth.service';


@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {


  userCurrent: UserCurrent;

  constructor(
    private ngxToastr: NgxToastrService,
    private questionCategoryService: QuestionCategoryService,
    private modalService: BsModalService,
    public questionCategoryTreeService: QuestionCategoryTreeService,
    private questionService: QuestionService, private router: Router,
    private route: ActivatedRoute,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private el: ElementRef,
    private examService:ExamService,
    private authService:AuthService,
    private studentAuthService:StudentAuthService

  ) {

    this.userCurrent = this.authService.getUserCurrent() as UserCurrent;

   }


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

  public exam: any = {
    examid: '',
    title: '',
    questions: [],
    groupmodules: 1,
    sections: []
  };
  public student:any={};

  ngOnInit() {
    this.addQuestionCategoryTreeService.resetState();

    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if (result.status) {

        const defaultCategory = result.data.find((category: any) => category.isDefault === true);

        this.addQuestionCategoryTreeService.questionCategories = result.data;

        this.addQuestionCategoryTreeService.id = defaultCategory.id;
      }
    });

    // this.route.queryParams.subscribe(params => {
    //   const request = {
    //     ...params,
    //     pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
    //     pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
    //   };

    //   this.getQuestions(request);
    // });

    this.questionCategoryTreeService.myValueChange.subscribe((newValue) => {
      this.questionCategoryTreeService.setActiveCategoryId(0);
    });



    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }
      
      this.examService.getExamById(request).subscribe((result: any) => {
        this.exam = result.data;

        this.exam.questions = result.data.questions;
        this.exam.groupmodules = result.data.groupmodules;
        this.exam.sections = result.data.sections;
      });
    });

    
    this.route.params.subscribe(params => {

      const id = this.userCurrent.id;

      const request = {
        ...params,
        // userId:'D5E5B63A-53A1-4F88-A399-1F7C7F4B08A7',  //dữ liệu mẫu,thì mới có dữ liệu
         userId:id,
      };

      this.studentAuthService.getStudentInfo(request).subscribe((result:any)=>{

        this.student = result.data;
        console.log(result);

      });

    });



  }


  questionContant: any = questionConstant;

  // getQuestions(request: any): void {
  //   this.questionService.getQuestions(request).subscribe((result: any) => {
  //     if (result.status) {
  //       this.questions = result.data.items;
  //       this.totalPages = result.data.totalPages;

  //       console.log(this.questions);
  //     }
  //   });
  // }

  selectQuestion(index: number): void {

  }


  
  closeModal(){
    this.showResultModal = false;

  }


  guiDapAn(): void {
    const request = this.exam.questions.map((question: any, i: number) => {
      return {
        questionId: question.id,
        questionAnswerId: this.selectedAnswers[i] || 0
      };
    });
    //hiển kết quả
    this.examService.checkAnswer(request).subscribe((result: any) => {
      if (result.status) {
        this.result = result.data;

        //lưu kết quả
        this.route.paramMap.subscribe(params => {
          // const examId = params.get('id');
          const examIdStr = params.get('id');
          const examId = examIdStr ? parseInt(examIdStr, 10) : null; // Chuyển đổi sang int
          const requestResult={
            ExamId :examId,
            StudentId :this.student.id.toString(),
            Score :result.data.totalScore,
            StartTime: new Date(),
            DurationTime :'00:30:00',
            NumberCorrectAnswers :result.data.totalCountTrue,
            NumberChangeTab :0,
      
          }
          this.examService.addExamResult(requestResult).subscribe((result: any) => {
            if (result.status) {
              alert("Đã nộp bài!"); 
              this.router.navigate(['/test-exam']);

            }
          });
          
        });



      }
    });
    this.showResultModal = true;

  }
  




  handleParseTimeSpan(timeSpan: string): number {

    if(timeSpan!=null){
      const parts = timeSpan.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      return hours * 3600 + minutes * 60 + seconds;
    }
    else{
      return 0;
    }
  
  }





  a() {
    console.log('Bộ đếm ngược đã kết thúc.TEST');
  }
  
  DurationTime =1;
  onCountdownEvent(event: CountdownEvent) {
    if (event.action === 'done') {
      this.a(); 
    }
    else if (event.action === 'notify') {
      this.DurationTime = event.left;
      console.log('Thời gian còn lại:', event.left, 'giây');
    }
  }


  updateDurationTime() {
    console.log('Thời gian còn lại được cập nhật:', this.DurationTime);
  }

  
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



 






