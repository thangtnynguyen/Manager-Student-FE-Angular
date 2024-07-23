import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/teacher/services/apis/teacher.service';
import { Router } from '@angular/router';
import questionConstant from 'src/app/teacher/constants/question.constant';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { classicEditorConfig } from 'src/app/teacher/configs/ckeditor.config';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CkeditorUploadAdapter } from 'src/app/teacher/adapters/ckeditor-upload.adapter';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionCategoryService } from 'src/app/teacher/services/apis/question-category.service';
import { AddQuestionCategoryTreeService } from 'src/app/teacher/services/components/add-question-category-tree.service';
import { TagService } from 'src/app/teacher/services/apis/tag.service';
import tagConstant from 'src/app/teacher/constants/tag.constant';
import { QuestionService } from 'src/app/teacher/services/apis/question.service';
import { SectionService } from 'src/app/teacher/services/apis/section.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({
        opacity: 0,
        height: '0',
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        height: '100%',
        display: 'flex'
      })),
      transition('hidden => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('300ms ease-in'))
    ]),
  ],
})
export class AddQuestionComponent implements OnInit {
  //Init
  constructor(
    private ngxToastr: NgxToastrService,private teacherService: TeacherService,
    private router:Router,private modalService: BsModalService, 
    private questionCategoryService: QuestionCategoryService,
    private tagService: TagService,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private questionService: QuestionService,
    private sectionService: SectionService
  ) { }

  ngOnInit() {
    this.addQuestionCategoryTreeService.resetState();

    this.getSections({sortBy: 'asc'});

    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if(result.status){
        this.questionCategoryTree = result.data;

        const defaultCategory = result.data.find((category: any) => category.isDefault === true);

        this.questionCategory = defaultCategory;

        this.addQuestionCategoryTreeService.questionCategories = result.data;

        this.addQuestionCategoryTreeService.id = defaultCategory.id;
      }
    });

    const getTagsRequest = {
      type: tagConstant.type.question
    };

    this.tagService.getTags(getTagsRequest).subscribe((result: any) => {
      if(result.status){
        this.questionTags = result.data;
      }
    });
  }

  //Question
  questionContant: any = questionConstant;
  classicEditor = ClassicEditor;
  editor: any = null;
  questionAnswersEditor = [];
  config: { [key: string]: any, classicEditorConfig: any } = { classicEditorConfig: classicEditorConfig };

  //Question
  question: any = {
    type: 1,
    title: '',
    questionAnswers: [...questionConstant.defaultQuestionAnswerMultipleAnswers],
    questionCategoryId: 1,
    questionTags: [],
    sectionId: 0,
    difficulty: 0
  };

  public validateFormSuccess: any = {
    touchSection: false,
    touchDiff: false
  }

  // public validateFormSuccess(): boolean{
  //   return true;
  // }

  public sections: any = [];

  public validateForm: any = {
    title: true,
    questionAnswers: []
  }

  public getSections(request: any): void{
    this.sectionService.getSections(request).subscribe((result: any) => {
      if(result.status){
        this.sections = result.data.items;
      }
    });
  }

  getMaxScoreQuestionAnswers(){
    return Math.max(...this.question.questionAnswers.map((item: any)=> item.score));
  }

  validateCkeditorField(type: string, value: any,index: any){
    if(type === 'title'){
      if(!this.question.title){
        this.validateForm.title = false;
      }else{
        this.validateForm.title = true;
      }
    }else if(type === 'questionAnswer'){
      if(!value.content){
        this.validateForm.questionAnswers[index] = true;
      }else{
        this.validateForm.questionAnswers[index] = false;
      }
    }
  }

  isInvalidForm(){
    if(!this.question.title.length){
      return true;
    }

    const hasEmptyContent = this.question.questionAnswers.some((answer: any) => (!answer.content));

    if(hasEmptyContent){
      return true;
    }

    return false;
  }

  handleChangeQuestionAnswer(event: any,question: any,type: number,index: any = null) {
    const data = event.editor.getData();

    if(type === 1){
      question.title = data;

      if(!this.question.title){
        this.validateForm.title = false;
      }else{
        this.validateForm.title = true;
      }
    }else if(type === 2){
      question.content = data;

      if(!question.content){
        this.validateForm.questionAnswers[index] = true;
      }else{
        this.validateForm.questionAnswers[index] = false;
      }
    }else{
      question.feedback = data;
    }
  }

  onSubmit(){
    console.log('nice',this.question.questionTags)

    const selectedCategoryIds = this.question.questionTags.filter((category: any) => category.selected)
    .map((selectedCategory: any) => selectedCategory.id);

    console.log('nice',selectedCategoryIds)

    const request = {...this.question, tagIds: this.question.questionTags, score: this.getMaxScoreQuestionAnswers(), difficulty: +this.question.difficulty};

    this.questionService.createQuestion(request).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success('Tạo câu hỏi thành công!','',{
          progressBar: true
        });

        this.router.navigate(['/teacher/question']);
      }
    },
    (error) => {
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }
  //Question category
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
    this.question.questionCategoryId = this.addQuestionCategoryTreeService.id;

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

  //Queston tag
  tagConstant: any = tagConstant;

  questionCategoryTagRef?: BsModalRef;
  @ViewChild('questionCategoryTagTemplate') questionCategoryTagTemplate!: TemplateRef<any>;

  questionTags: any[] = [];
  questionTagsSearch: string = '';
  isAddQuestionTag: boolean = false;
  questionTagName: string = '';

  getquestionTagsSelect(){
    return this.questionTags.filter(category => category.selected === true);
  }

  handleOpenQuestionTagModal(){
    this.questionCategoryTagRef = this.modalService.show(this.questionCategoryTagTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.questionCategoryTagRef.onHidden?.subscribe(() => {
      this.questionTags.forEach(category => {
        if (this.question.questionTags.includes(category.id)) {
          category.selected = true;
        }
      });

      this.questionTagsSearch = '';
    });
  }

  handleCloseQuestionTagModal(){
    this.questionTagsSearch = '';

    this.questionCategoryTagRef?.hide();
  }

  handleChooseQuestionTags(){
    this.questionTagsSearch = '';

    const selectedCategories = this.questionTags.filter(category => category.selected === true);

    this.question.questionTags = selectedCategories.map(category => category.id);

    this.questionCategoryTagRef?.hide();
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: any): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement.classList.contains('submit-add-tag-question')) {
      return;
    } else if(targetElement.classList.contains('add-tag-btn') || targetElement.classList.contains('add-tag-input')){
      this.isAddQuestionTag = true;
    } else {
      this.isAddQuestionTag = false;
      this.questionTagName = '';
    }
  }

  handleSubmitCreateQuestionTag(){
    if(this.questionTagName.trim() === ''){
      this.ngxToastr.error('Tên thẻ tag không được để trống!','',{
        progressBar: true
      });
    }else{
      const request = {
        name: this.questionTagName,
        type: tagConstant.type.question
      }

      this.tagService.createTag(request).subscribe((result: any) => {
        if(result.status){
          this.questionTagName = '';
          this.questionTags = [...this.questionTags, request];
          this.isAddQuestionTag = false;
        }
      },
      (error) => {
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });
    }
  }

  //Common
  selectedAnswer: string = 'ok';
  typeScoreAnswer: number = 1;

  //Data
  public teacher: any = {
    teacherId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };

  validVerificationType(): number {
    if (this.teacher.verificationType === 2) {
        if (!this.teacher.email) {
            return -1;
        } else {
            return 1;
        }
    } else {
      if (!this.teacher.phone) {
        return -2;
      } else {
        return 1;
      }
    }
  }

  handleMoveQuestion(index: number, direction: 'up' | 'down'): void {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
  
    if (newIndex >= 0 && newIndex < this.question.questionAnswers.length) {
      [this.question.questionAnswers[index], this.question.questionAnswers[newIndex]] = [this.question.questionAnswers[newIndex], this.question.questionAnswers[index]];
  
      this.question.questionAnswers[index].charIndex = String.fromCharCode(65 + index);
      this.question.questionAnswers[newIndex].charIndex = String.fromCharCode(65 + newIndex);
    }
  }

  handleAddQuestionAnswer(): void {
    const newAnswer = {
      charIndex: String.fromCharCode(65 + this.question.questionAnswers.length),
      title: '',
      order: this.question.questionAnswers.length + 1,
      isCorrect: this.question.questionAnswers.length > 0 ? false : true,
      score: 1
    };
  
    this.question.questionAnswers.push(newAnswer);
  }

  handleOnDeleteAnswerQuesion(index: number){
    this.question.questionAnswers.splice(index, 1);

    const isCorrectAnswerExists = this.question.questionAnswers.some((answer: any) => answer.isCorrect === true);

    if(!isCorrectAnswerExists && this.question.questionAnswers.length > 0){
      this.question.questionAnswers[0].isCorrect = true;
    }

    for (let i = index; i < this.question.questionAnswers.length; i++) {
      this.question.questionAnswers[i].charIndex = String.fromCharCode(65 + i);
      this.question.questionAnswers[i].title = "";
    }
  }

  handleOnChangeCorrectAnswerQuestion(selectedAnswer: any) {
    selectedAnswer.isCorrect = true;
  
    this.question.questionAnswers.forEach((answer: any) => {
      if (answer !== selectedAnswer) {
        answer.isCorrect = false;
      }
    });
  }

  onReady(editor: ClassicEditor): void {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new CkeditorUploadAdapter( loader );
    };
  }
}
