import animationConstant from '../../constants/animation.constant';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';
import { Router } from '@angular/router';
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


@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
  animations: animationConstant.animations

})
export class AddExamComponent {


  constructor(
    private ngxToastr: NgxToastrService,private teacherService: TeacherService,
    private router:Router,private modalService: BsModalService, 
    private questionCategoryService: QuestionCategoryService,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private questionService: QuestionService,
    private sectionService: SectionService,
    private groupModuleService: GroupModuleService,
    private examService: ExamService,


  ) { }

  ngOnInit() {

    this.getSections({sortBy: 'asc'});
    this.getGroupModules({sortBy: 'asc'});

  }

  public groupmodules: any = [];

  public exam: any = {
    title: '',
    description:'',
    duration:0,
    groupModuleIds: [],
    sections: [],
    sectionIds: [],
    type: 1,
    isShowContent: false,
    isSeeScore: false,
    isMixQuestion: false,
    isMixQuestionAnswer: false,
    isAllowChangeTab: false,
    numberQuestionEasy:0,
    numberQuestionModerate:0,
    numberQuestionDifficult:0,
    startTime:'',
    endTime:''

  };


  public validateFormSuccess: any = {
    touchSection: false,
    touchDiff: false
  }

  public getSections(request: any): void{
    this.sectionService.getSections(request).subscribe((result: any) => {
      if(result.status){
        this.sections = result.data.items;
      }
    });
  }
  public getGroupModules(request: any): void{
    this.groupModuleService.getGroupModules(request).subscribe((result: any) => {
      if(result.status){
        this.groupmodules = result.data.items;
      }
    });
  }

  //Section
  public sections: any = []

  sectionModalRef?: BsModalRef;
  @ViewChild('sectionModalTemplate') sectionModalTemplate!: TemplateRef<any>;

  public handleOpenSectionModal(): void{
    this.sectionModalRef = this.modalService.show(this.sectionModalTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.sectionModalRef.onHidden?.subscribe(() => {
      this.sections.forEach((category: any) => {
        if (this.exam.sectionIds.includes(category.id)) {
          category.selected = true;
        }else{
          category.selected = false;
        }
      });
    });
  }

  public handleCloseSectionModal(): void{
    const selectedSections = this.sections.filter((section: any) => section.selected === true);

    this.exam.sectionIds = selectedSections.map((section: any) => section.id);

    this.sectionModalRef?.hide();
  }

  public handleChooseSection(): void{
    const selectedCategories = this.sections.filter((category: any) => category.selected === true);

    this.exam.sectionIds = selectedCategories.map((category: any) => category.id);

    this.sectionModalRef?.hide();
  }



  public handleSubmitCreateExam(){
    console.log("moi",this.exam);

    const formData = new FormData();
    
    formData.append('title', this.exam.title);
    formData.append('description', this.exam.description);
    formData.append('duration', this.exam.duration);
    formData.append('groupModuleIds', this.exam.groupModuleIds); 
    formData.append('sectionIds', this.exam.sectionIds);
    formData.append('type', this.exam.type);
    formData.append('isShowContent', this.exam.isShowContent);

    formData.append('isSeeScore', this.exam.isSeeScore);
    formData.append('isMixQuestion', this.exam.isMixQuestion);
    formData.append('isMixQuestionAnswer', this.exam.isMixQuestionAnswer); 
    formData.append('isAllowChangeTab', this.exam.isAllowChangeTab);

    formData.append('numberQuestionEasy', this.exam.numberQuestionEasy);
    formData.append('numberQuestionModerate', this.exam.numberQuestionModerate);
    formData.append('numberQuestionDifficult', this.exam.numberQuestionDifficult);

    formData.append('startTime', this.exam.startTime);
    formData.append('endTime', this.exam.endTime);

    this.examService.createExam(formData).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.router.navigate(['/exam']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });

  }
}
