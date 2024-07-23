// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-detail-test-exam',
//   templateUrl: './detail-test-exam.component.html',
//   styleUrls: ['./detail-test-exam.component.css']
// })
// export class DetailTestExamComponent {

// }



import animationConstant from '../../constants/animation.constant';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import questionConstant from 'src/app/admin/constants/question.constant';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { classicEditorConfig } from 'src/app/admin/configs/ckeditor.config';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionCategoryService } from 'src/app/admin/services/apis/question-category.service';
import { AddQuestionCategoryTreeService } from 'src/app/admin/services/components/add-question-category-tree.service';
import { TagService } from 'src/app/admin/services/apis/tag.service';
import { QuestionService } from 'src/app/admin/services/apis/question.service';
import { SectionService } from 'src/app/admin/services/apis/section.service';
import { GroupModuleService } from 'src/app/admin/services/apis/group-module.service';
import { ExamService } from 'src/app/admin/services/apis/exam.service';
import { AuthService as StudentAuthService } from 'src/app/student/services/api/auth.service';
import { UserCurrent } from 'src/app/core/models/interfaces/user/user-current.interface';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-detail-test-exam',
  templateUrl: './detail-test-exam.component.html',
  styleUrls: ['./detail-test-exam.component.css'],
  animations: animationConstant.animations

})
export class DetailTestExamComponent {

  userCurrent: UserCurrent;

  constructor(
    private ngxToastr: NgxToastrService, private teacherService: TeacherService,
    private router: Router, private modalService: BsModalService,
    private questionCategoryService: QuestionCategoryService,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private questionService: QuestionService,
    private sectionService: SectionService,
    private groupModuleService: GroupModuleService,
    private route: ActivatedRoute,
    private examService: ExamService,
    private studentAuthService: StudentAuthService,
    private authService: AuthService,

    private location: Location

  ) {
    this.userCurrent = this.authService.getUserCurrent() as UserCurrent;

  }

  public student: any = {};
  public examresult: any = {};



  public exam: any = {
    examid: '',
    title: '',
    questions: [],
    groupmodules: 1,
    sections: []
  };

  public validateFormSuccess: any = {
    touchSection: false,
    touchDiff: false
  }
  ngOnInit() {
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


    //add
    this.route.params.subscribe(params => {

      const id = this.userCurrent.id;

      const request = {
        ...params,
        userId: id,
      };

      this.studentAuthService.getStudentInfo(request).subscribe((result: any) => {

        this.student = result.data;
        console.log(result.data);

        this.route.paramMap.subscribe(params => {
          const studentId = this.userCurrent.id;
          const examId = params.get('id');

          const request = {
            studentId: this.student.id,
            examId: examId
          };
          this.examService.GetExamResultByStudentOne(request).subscribe((result1: any) => {
            console.log(result1.data);
            this.examresult=result1.data;

          });
        });


      });

    });

  }


  GetExamResultByStudentOne() {

  }

  handleConvert(index: any) {
    return String.fromCharCode(65 + index);
  }

  getMaxScoreQuestionAnswers() {
    return Math.max(...this.exam.question.questionAnswers.map((item: any) => item.score));
  }

  //Status button
  public statusButton(exam: any): number {
    const currentTime = new Date();
    if (exam.endTime && new Date(exam.endTime) < currentTime) {
      return 1;
    } else if (currentTime >= new Date(exam.startTime) && currentTime <= new Date(exam.endTime)) {
      return 2;
    } else {
      return 3;
    }
  }
  goBack(): void {
    this.location.back(); // Hàm back() của Location sẽ quay lại trang trước đó trong lịch sử duyệt
  }

}

