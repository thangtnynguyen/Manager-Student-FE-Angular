// import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { trigger, state, style, animate, transition } from '@angular/animations';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { CkeditorUploadAdapter } from 'src/app/admin/adapters/ckeditor-upload.adapter';
import { classicEditorConfig } from 'src/app/admin/configs/ckeditor.config';
import questionConstant from 'src/app/admin/constants/question.constant';
import { QuestionService } from 'src/app/admin/services/apis/question.service';
import { QuestionCategoryService } from 'src/app/admin/services/apis/question-category.service';
import { AddQuestionCategoryTreeService } from 'src/app/admin/services/components/add-question-category-tree.service';
import { SectionService } from 'src/app/admin/services/apis/section.service';
import tagConstant from 'src/app/admin/constants/tag.constant';
import { TagService } from 'src/app/admin/services/apis/tag.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css'],
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
export class EditQuestionComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private questionCategoryService: QuestionCategoryService,
    private addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private router: Router,
    private sectionService: SectionService,
    private tagService: TagService,

  ) { }

  ngOnInit() {
    this.addQuestionCategoryTreeService.resetState();

    this.getSections({ sortBy: 'asc' });

    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }

      this.questionService.getQuestionById(request).subscribe((result: any) => {
        this.question = result.data;
        this.checkTypeScore();
        this.questionTagCurrentsCommons = result.data.questionTags;
        // this.checkTagCurrent();

        if (this.question.questionAnswers && this.question.questionAnswers.length > 0) {
          this.question.questionAnswers.forEach((answer: any, index: any) => {
            answer.charIndex = String.fromCharCode(65 + index);

            this.dataCkeditorTemporary.questionAnswers[index] = result.data.questionAnswers[index].content;
          });
        }

        this.dataCkeditorTemporary.title = result.data.title;
        this.dataCkeditorTemporary.feedback = result.data.feedback;

        this.addQuestionCategoryTreeService.resetState();

        this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
          if (result.status) {
            this.questionCategoryTree = result.data;

            const defaultCategory = result.data.find((category: any) => category.isDefault === true);

            this.questionCategory = defaultCategory;

            this.addQuestionCategoryTreeService.questionCategories = result.data;

            this.addQuestionCategoryTreeService.id = defaultCategory.id;
          }
        });
      });

    });
    const getTagsRequest = {
      type: tagConstant.type.question
    };

    this.tagService.getTags(getTagsRequest).subscribe((result: any) => {
      if (result.status) {
        this.questionTags = result.data;
        // console.log(this.questionTagCurrentsCommons)
        this.updateTagSelection();

      }
    });



  }

  public constant: any = {
    questionContant: questionConstant
  }

  public validateFormSuccess: any = {
    touchSection: false,
    touchDiff: false
  }

  public config: any = {
    classicEditorConfig: classicEditorConfig
  }

  public sections: any = [];

  public getSections(request: any): void {
    this.sectionService.getSections(request).subscribe((result: any) => {
      if (result.status) {
        this.sections = result.data.items;
      }
    });
  }

  //Question
  // public question: any = {
  //   type: 1,
  //   questionAnswers: [],
  //   questionTags: [],

  // }
  public question: any = {
    type: 1,
    title: '',
    questionAnswers: [],
    questionCategoryId: 1,
    questionTags: [],
    sectionId: 0,
    difficulty: 0
  };
  public validateForm: any = {
    title: true,
    questionAnswers: []
  }

  public dataCkeditorTemporary: any = {
    title: '',
    questionAnswers: []
  }

  public typeScoreAnswer: number = 2;

  public checkTypeScore(): void {
    if (this.question.questionAnswers.every((answer: any) => answer.score === 1)) {
      this.typeScoreAnswer = 1;
    } else {
      this.typeScoreAnswer = 2;
    }
    // console.log(this.question)
  };
 

  public updateTagSelection(): void {
    this.questionTagCurrents = this.questionTagCurrentsCommons.map(item => item.tag);
    const currentTagIds = new Set(this.questionTagCurrents.map(tagCurrent => tagCurrent.id));
    this.questionTags.forEach(tag => {
      tag.selected = currentTagIds.has(tag.id);
    });
    // console.log(this.questionTags);
    // console.log(this.questionTagCurrents);
    // console.log(this.questionTagCurrentsCommons);


  }


  public classicEditor = ClassicEditor;

  public handleOnSubmitForm(): void {
    const isArrayOfNumbers = this.question.questionTags.every((item: any) => typeof item === 'number');
    if(isArrayOfNumbers){
      this.question.tagIds = this.question.questionTags;
    }else{
      this.question.tagIds = this.question.questionTags.map((item: any) => item.tagId);
    }
    this.questionService.editQuestion(this.question).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success('Cập nhật câu hỏi thành công!', '', {
          progressBar: true
        });

        this.router.navigate(['/admin/question']);
      }
    },
      (error) => {
        this.ngxToastr.error(error.error.message, '', {
          progressBar: true
        });
      });
  }

  public onReadyCkeditor(editor: ClassicEditor): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CkeditorUploadAdapter(loader);
    };
  }

  public handleChangeDataCkeditor(event: any, model: any, type: any, index: any = null): void {
    const data = event.editor.getData();

    if (type === this.constant.questionContant.typeCkeditor.questionTitle) {
      model.title = data;

      if (!this.question.title) {
        this.validateForm.title = false;
      } else {
        this.validateForm.title = true;
      }
    } else if (type === this.constant.questionContant.typeCkeditor.questionAnswerContent) {
      model.content = data;

      if (!model.content) {
        this.validateForm.questionAnswers[index] = true;
      } else {
        this.validateForm.questionAnswers[index] = false;
      }
    } else {
      model.feedback = data;
    }
  }

  public validateCkeditorField(type: any, value: any = null, index: any = null) {
    if (type === this.constant.questionContant.typeCkeditor.questionTitle) {
      if (!this.question.title) {
        this.validateForm.title = false;
      } else {
        this.validateForm.title = true;
      }
    } else if (type === this.constant.questionContant.typeCkeditor.questionAnswerContent) {
      if (!value.content) {
        this.validateForm.questionAnswers[index] = true;
      } else {
        this.validateForm.questionAnswers[index] = false;
      }
    }
  }

  public handleOnDeleteAnswerQuesion(index: number) {
    this.question.questionAnswers.splice(index, 1);

    const isCorrectAnswerExists = this.question.questionAnswers.some((answer: any) => answer.isCorrect === true);

    if (!isCorrectAnswerExists && this.question.questionAnswers.length > 0) {
      this.question.questionAnswers[0].isCorrect = true;
    }

    for (let i = index; i < this.question.questionAnswers.length; i++) {
      this.question.questionAnswers[i].charIndex = String.fromCharCode(65 + i);
      this.question.questionAnswers[i].title = "";
    }
  }

  public handleMoveQuestion(index: number, direction: 'up' | 'down'): void {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < this.question.questionAnswers.length) {
      [this.question.questionAnswers[index], this.question.questionAnswers[newIndex]] = [this.question.questionAnswers[newIndex], this.question.questionAnswers[index]];
      this.dataCkeditorTemporary.questionAnswers[index] = this.question.questionAnswers[index].content;
      this.dataCkeditorTemporary.questionAnswers[newIndex] = this.question.questionAnswers[newIndex].content;

      this.question.questionAnswers[index].charIndex = String.fromCharCode(65 + index);
      this.question.questionAnswers[newIndex].charIndex = String.fromCharCode(65 + newIndex);
    }
  }

  public handleAddQuestionAnswer() {
    const newAnswer = {
      charIndex: String.fromCharCode(65 + this.question.questionAnswers.length),
      title: '',
      order: this.question.questionAnswers.length + 1,
      isCorrect: this.question.questionAnswers.length > 0 ? false : true,
      score: 1
    };

    this.question.questionAnswers.push(newAnswer);
  }

  public handleOnChangeCorrectAnswerQuestion(selectedAnswer: any) {
    selectedAnswer.isCorrect = true;

    this.question.questionAnswers.forEach((answer: any) => {
      if (answer !== selectedAnswer) {
        answer.isCorrect = false;
      }
    });
  }

  //Category
  @ViewChild('questionCategoryTreeTemplate') questionCategoryTreeTemplate!: TemplateRef<any>;
  public questionCategoryTree: any[] = [];
  public createQuestionCategoryModalRef?: BsModalRef;
  public questionCategorySearch: string = '';
  public questionCategory: any = {
    id: "",
    name: ""
  };

  public handleOpenQuestionCategoryTreeModal() {
    this.questionCategoryService.getQuestionCategoryTree().subscribe((result: any) => {
      if (result.status) {
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

  public handleCloseQuestionCategoryTreeModal() {
    const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);

    this.addQuestionCategoryTreeService.id = defaultCategory.id;

    this.questionCategorySearch = '';

    this.createQuestionCategoryModalRef?.hide();
  }

  public handleChangeSearchCategory() {
    const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);
    this.addQuestionCategoryTreeService.id = defaultCategory.id;
  }

  public handleChooseQuestionCategoryId() {
    this.question.questionCategoryId = this.addQuestionCategoryTreeService.id;

    const category = this.findCategoryById(this.addQuestionCategoryTreeService.questionCategories, this.addQuestionCategoryTreeService.id);

    this.questionCategory = category;

    this.createQuestionCategoryModalRef?.hide();
  }

  public findCategoryById(categories: any[], targetId: number): any | null {
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

  public getMaxScoreQuestionAnswers() {
    return Math.max(...this.question.questionAnswers.map((item: any) => item.score));
  }




  //Queston tag
  tagConstant: any = tagConstant;

  questionCategoryTagRef?: BsModalRef;
  @ViewChild('questionCategoryTagTemplate') questionCategoryTagTemplate!: TemplateRef<any>;

  questionTags: any[] = [];
  questionTagCurrents: any[] = [];
  questionTagCurrentsCommons: any[] = [];
  questionTagsSearch: string = '';
  isAddQuestionTag: boolean = false;
  questionTagName: string = '';

  getquestionTagsSelect() {
    return this.questionTags.filter(category => category.selected === true);
  }
  handleOpenQuestionTagModal() {
    this.questionCategoryTagRef = this.modalService.show(this.questionCategoryTagTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.questionCategoryTagRef.onHidden?.subscribe(() => {
      this.questionTags.forEach(category => {
        if (this.question.questionTags.includes(category.id)) {
          category.selected = true;
        }
      });
      // this.checkTagCurrent();

      this.questionTagsSearch = '';
    });
  }

  handleCloseQuestionTagModal() {
    this.questionTagsSearch = '';

    this.questionCategoryTagRef?.hide();
  }

  handleChooseQuestionTags() {
    this.questionTagsSearch = '';

    const selectedCategories = this.questionTags.filter(category => category.selected === true);
    // console.log(selectedCategories)

    this.question.questionTags = selectedCategories.map(category => category.id);

    this.questionCategoryTagRef?.hide();
  }


  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: any): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement.classList.contains('submit-add-tag-question')) {
      return;
    } else if (targetElement.classList.contains('add-tag-btn') || targetElement.classList.contains('add-tag-input')) {
      this.isAddQuestionTag = true;
    } else {
      this.isAddQuestionTag = false;
      this.questionTagName = '';
    }
  }

  handleSubmitCreateQuestionTag() {
    if (this.questionTagName.trim() === '') {
      this.ngxToastr.error('Tên thẻ tag không được để trống!', '', {
        progressBar: true
      });
    } else {
      const request = {
        name: this.questionTagName,
        type: tagConstant.type.question
      }

      this.tagService.createTag(request).subscribe((result: any) => {
        if (result.status) {
          this.questionTagName = '';
          this.questionTags = [...this.questionTags, request];
          this.isAddQuestionTag = false;
        }
      },
        (error) => {
          this.ngxToastr.error(error.error.message, '', {
            progressBar: true
          });
        });
    }
  }
}
