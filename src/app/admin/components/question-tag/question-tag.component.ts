// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-question-tag',
//   templateUrl: './question-tag.component.html',
//   styleUrls: ['./question-tag.component.css']
// })
// export class QuestionTagComponent {

// }




import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddQuestionCategoryTreeService } from 'src/app/admin/services/components/add-question-category-tree.service';
import { TagService } from 'src/app/admin/services/apis/tag.service';
import tagConstant from 'src/app/admin/constants/tag.constant';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-question-tag',
  templateUrl: './question-tag.component.html',
  styleUrls: ['./question-tag.component.css'],
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
export class QuestionTagComponent implements OnInit {
  //Init
  constructor(
    private ngxToastr: NgxToastrService, private teacherService: TeacherService,
    private tagService: TagService,
    public addQuestionCategoryTreeService: AddQuestionCategoryTreeService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    const getTagsRequest = {

    };

    this.getTags(getTagsRequest);
    // this.tagService.getTags(getTagsRequest).subscribe((result: any) => {
    //   if (result.status) {
    //     this.questionTags = result.data;
    //   }
    // });
  }


  getTags(request: any) {
    this.tagService.getTags(request).subscribe((result: any) => {
      if (result.status) {

        this.questionTags = result.data;

      }
    });
  }







  handleChangeSearchCategory() {
    const defaultCategory = this.addQuestionCategoryTreeService.questionCategories.find((category: any) => category.isDefault === true);
    this.addQuestionCategoryTreeService.id = defaultCategory.id;
  }



  //Queston tag
  tagConstant: any = tagConstant;

  questionCategoryTagRef?: BsModalRef;

  questionTags: any[] = [];
  questionTagsSearch: string = '';
  isAddQuestionTag: boolean = false;
  questionTagName: string = '';
  questionTagType: any = 1;

  selectedCategoriesTag: any = [];
  selectedCategoriesTagId: any = [];
  // selectedCategoriesTagIdEdit: any=0;
  // selectedCategoriesTagNameEdit:string='';
  selectedCategoriesTagEdit:any={};
  getquestionTagsSelect() {
    return this.questionTags.filter(category => category.selected === true);
  }
  getquestionTagIDSelect(tag:any) {
    return  this.selectedCategoriesTagEdit=tag;
  }
  test() {
    console.log(this.selectedCategoriesTagEdit);
  }



  // handleChooseQuestionTags(){
  //   this.questionTagsSearch = '';

  //   const selectedCategories = this.questionTags.filter(category => category.selected === true);

  //   this.questionCategoryTagRef?.hide();
  // }

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
    this.selectedCategoriesTag = this.questionTags.filter(category => category.selected === true);

    this.selectedCategoriesTagId = this.selectedCategoriesTag.map((category: { id: number }) => category.id);


  }

  handleSubmitCreateQuestionTag() {
    if (this.questionTagName.trim() === '') {
      this.ngxToastr.error('Tên thẻ tag không được để trống!', '', {
        progressBar: true
      });
    } else {
      const request = {
        name: this.questionTagName,
        type: this.questionTagType
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
  handleSubmitEditQuestionTag(){
    var editRequest={
      id:this.selectedCategoriesTagEdit.id,
      name:this.selectedCategoriesTagEdit.name,
      type:this.selectedCategoriesTagEdit.type
    }
    this.tagService.editTag(editRequest).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.router.navigate(['/admin/question-tag']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
    this.handleCloseQuestionTagModal();
  }


  handleOnDeleteMultiple() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedCategoriesTagId.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedCategoriesTagId
          
        }

        this.tagService.deleteMultipleTag(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: result.message,
              icon: "success"
            });

            const getTagsRequest = {

            };
            this.getTags(getTagsRequest);
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


  handleCloseQuestionTagModal(){
    this.questionTagsSearch = '';

    this.questionCategoryTagRef?.hide();
  }
  @ViewChild('questionCategoryTagTemplate') questionCategoryTagTemplate!: TemplateRef<any>;

  handleOpenQuestionTagModal(){
    this.questionCategoryTagRef = this.modalService.show(this.questionCategoryTagTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.questionCategoryTagRef.onHidden?.subscribe(() => {
     
      this.questionTagsSearch = '';
    });
  }



  //Data
  // public teacher: any = {
  //   teacherId: '',
  //   name: '',
  //   email: '',
  //   phone: '',
  //   verificationType: 2,
  //   status: true,
  // };

  // validVerificationType(): number {
  //   if (this.teacher.verificationType === 2) {
  //       if (!this.teacher.email) {
  //           return -1;
  //       } else {
  //           return 1;
  //       }
  //   } else {
  //     if (!this.teacher.phone) {
  //       return -2;
  //     } else {
  //       return 1;
  //     }
  //   }
  // }



}