import { Component,TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Breadcrumb } from 'src/app/core/components/breadcrumb/breadcrumb.interface';
import { breadcrumbs } from './manage-list-lesson.config';
import { SectionService } from 'src/app/core/services/catalog/section.service';
import { classicEditorConfig } from 'src/app/core/configs/ckeditor.config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { CkeditorUploadAdapter } from 'src/app/admin/adapters/ckeditor-upload.adapter';
import { ToastrService } from 'src/app/core/modules/toastr/toastr.service';
import { LessonService } from 'src/app/core/services/catalog/lesson.service';
import { Action } from 'src/app/core/enums/action.enum';
import Swal from 'sweetalert2';
import { TypeFile } from 'src/app/core/enums/type-file.enum';
import { DefaultValue } from 'src/app/core/constants/default-value.constant';
import { LessonContentService } from 'src/app/core/services/catalog/lesson-content.service';
import { AcceptFile } from 'src/app/core/constants/accept-file.constant';
import { ObjectService } from 'src/app/core/services/utilities/object.service';
import { app } from 'src/app/core/configs/app.config';
import { FileService } from 'src/app/core/services/utilities/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-manage-list-lesson',
  templateUrl: './manage-list-lesson.component.html',
  styleUrls: ['./manage-list-lesson.component.css']
})
export class ManageListLessonComponent {
  //Core
  Action = Action;
  TypeFile = TypeFile;
  DefaultValue = DefaultValue
  AcceptFileLessonContent = AcceptFile.LessonContent; 

  //Config
  breadcrumb: Breadcrumb[] = breadcrumbs;
  classicEditor = ClassicEditor;
  classicEditorConfig: any = classicEditorConfig;

  //State
  section: any = {
    id: 0,
    title: '',
    lessons: []
  };

  constructor(
    private route: ActivatedRoute, 
    private sectionService: SectionService,
    private lessonService: LessonService,
    private lessonContentService: LessonContentService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private objectService: ObjectService,
    private fileService: FileService,
    private sanitizer: DomSanitizer
    ) {}

  ngOnInit() {
    this.handleRouteParamsChange();
  }

  //Action
  handleRouteParamsChange(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      this.getSectionWithLesson(id);
    });
  }

  getSectionWithLesson(id: any){
    this.sectionService.getSectionWithLesson(id).subscribe((res) => {
      this.section = res?.data;
    });
  }

  getLessonBySectionId(id: any){
    this.lessonService.getLessonBySectionId(id).subscribe((res) => {
      this.section.lessons = res?.data;
    });
  }

  getLessonContentByLessonId(id: any): any{
    let copyLesson = this.lesson;

    this.lessonContentService.getLessonContentByLessonId(id).subscribe((res: any) => {
      copyLesson.lessonContents = res?.data;
      this.lesson = copyLesson;
    });
  }

  //Create lesson
  lesson: any = {
    title: '',
    content: null,
    status: true,
    priority: 0,
    sectionId: 0
  };
  createModalRef?: BsModalRef;
  @ViewChild('createTemplate') createSectionTemplate!: TemplateRef<any>;

  setDefaultLessonValues(){
    this.lesson = {
      title: '',
      content: null,
      status: true,
      priority: 0,
      sectionId: this.section?.id,
      lessonContents: []
     }
  }
  
  validateCreateForm: any = {
     priority: {
       inValidNumber: false,
     }
  }
 
  handleOpenCreateSectionModal(){
    this.lesson.priority = this.section?.lessons?.length + 1;
    this.createModalRef = this.modalService.show(this.createSectionTemplate,
       Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
   
       this.createModalRef.onHidden?.subscribe(() => {
          this.setDefaultLessonValues();
       });
  }

  onPriorityChange(value: number,action: any) {
    if(action === Action.Add){
      if(!this.lesson.priority){
        this.validateCreateForm.priority.inValidNumber = false;
      }

      this.validateCreateForm.priority.inValidNumber = isNaN(value) || value <= 0;
    } else{
      if(!this.lesson.priority){
        this.validateCreateForm.priority.inValidNumber = false;
      }

      this.validateCreateForm.priority.inValidNumber = isNaN(value) || value <= 0;
    }
  }

  handleChangeDataCkeditor(event: any,object: any) {
    if(!event || !object){
      return;
    }

    const data = event.editor.getData();

    object.content = data;
  }

  initEditor(editor: ClassicEditor){
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      return new CkeditorUploadAdapter( loader );
    };
  }

  handleOnSubmitCreateSection(){
    this.lesson.sectionId = this.section?.id;
    this.lessonService.createLesson(this.lesson).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.createModalRef?.hide();
          this.getLessonBySectionId(this.section.id);
        }
      },
      (exception) => {
        this.toastrService.error(exception.error.Message);
        console.log(exception?.error.Message);
      }
    );
  }

  //Edit lesson
  editModalRef?: BsModalRef;
  @ViewChild('editTemplate') editSectionTemplate!: TemplateRef<any>;

  validateEditForm: any = {
    priority: {
      inValidNumber: false,
    }
  }

  handleOpenEditSectionModal(lesson: any){
    const lessonCopy = { ...lesson };

    this.lesson = lessonCopy;

    this.editModalRef = this.modalService.show(this.editSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
  
    this.editModalRef.onHidden?.subscribe(() => {
        this.setDefaultLessonValues();
    });
  }

  handleOnSubmitEditSection(){
    this.lessonService.editLesson(this.lesson).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.editModalRef?.hide();
          this.getLessonBySectionId(this.section.id);
        }
      },
      (exception) => {
        this.toastrService.error(exception.error.Message);
        console.log(exception?.error.Message);
      }
    );
  }

  //Delete section
  handleDeleteSection(id: any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá bài học có Id ${id}?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: +id
        }

        this.lessonService.deleteLesson(request).subscribe((result: any) => {
          if(result.status){           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi bài học có Id ${id} đã bị xoá!`,
              icon: "success"
            });
    
            this.getLessonBySectionId(this.section.id);
          }
        },error => {
          this.toastrService.error(error.error.Message);
          console.log(error?.error.Message);
        });
      }
    });
  }

  // Content lesson
  lessonContent: any = {
    title: '',
    fileUrl: '',
    type: TypeFile.Link,
    estimatedCompletionTime: 0,
    fileName: '',
    videoType: 1,
    isPublished: true,
    prerequisiteLessonId: 0,
    requiedTime: false
  };

  setDefaultLessonContentValues(){
    this.statusActionLessonContent = null;

    this.lessonContent = {
      title: '',
      fileUrl: '',
      type: TypeFile.Link,
      estimatedCompletionTime: 0,
      fileName: '',
      videoType: 1,
      isPublished: true,
      prerequisiteLessonId: 0,
      requiedTime: false
    };
  }

  statusActionLessonContent: any = null;

  contentModalRef?: BsModalRef;
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  videoId: string = 'zuHNAhplYpI'; 
  safeUrl: SafeResourceUrl = null!;

  handleOpenContentModal(lesson: any){
    const lessonCopy = { ...lesson };

    this.lesson = lessonCopy;

    this.contentModalRef = this.modalService.show(this.contentTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
  
    this.contentModalRef.onHidden?.subscribe(() => {
        this.setDefaultLessonValues();
        this.setDefaultLessonContentValues();
    });
  }

  getTypeFileValues(): any[] {
    return Object.values(TypeFile).filter(value => !isNaN(Number(value)));
  }

  getTypeFileDisplayName(type: number): string {
    return TypeFile[type];
  }

  handleAddLessonContent(){
    this.statusActionLessonContent = Action.Add;

    this.lessonContent.priority = this.lesson?.lessonContents?.length + 1;
  }

  onCheckboxChange(event: any){
    if (event.target.checked) {
      this.lessonContent.requiedTime = true;
      this.lessonContent.estimatedCompletionTime = DefaultValue.EstimatedStudyTime;
    } else {
      this.lessonContent.requiedTime = false;
      this.lessonContent.estimatedCompletionTime = null;
    }
  }

  submitAddLessonContent(){
    this.lessonContent.lessonId = this.lesson.id;

    const formData = this.objectService.convertToFormData(this.lessonContent);

    this.lessonContentService.createLessonContent(formData).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.getLessonContentByLessonId(this.lesson.id);
          this.setDefaultLessonContentValues();
        }
      },
      (exception) => {
        this.toastrService.error(exception?.error.Message);
        console.log(exception)
      }
    );
  }

  submitEditLessonContent(){
    this.lessonContent.lessonId = this.lesson.id;
    this.lessonContent.fileUrl = this.lessonContent.fileUrl ?? '';
    this.lessonContent.videoType = this.lessonContent.videoType ?? 1;
    this.lessonContent.isPublished = this.lessonContent.isPublished ?? true;
    this.lessonContent.prerequisiteLessonId = this.lessonContent.prerequisiteLessonId ?? 0;
    this.lessonContent.estimatedCompletionTime = this.lessonContent.estimatedCompletionTime ?? 0;

    const formData = this.objectService.convertToFormData(this.lessonContent);

    this.lessonContentService.editLessonContent(formData).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.getLessonContentByLessonId(this.lesson.id);
          this.setDefaultLessonContentValues();
        }
      },
      (exception) => {
        this.toastrService.error(exception?.error.message);
        console.log(exception)
      }
    );
  }

  handleDeleteContent(id: any){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá tài liệu có Id ${id}?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: +id
        }

        this.lessonContentService.deleteLessonContent(request).subscribe((result: any) => {
          if(result.status){           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi tài liệu có Id ${id} đã bị xoá!`,
              icon: "success"
            });
    
            this.getLessonContentByLessonId(this.lesson.id);
            this.setDefaultLessonContentValues();
            console.log(this.lesson)
          }
        },error => {
          this.toastrService.error(error.error.Message);
          console.log(error?.error.Message);
        });
      }
    });
  }

  handleOpenLinkWeb(content: any){
    window.open(content?.fileUrl, '_blank');
  }

  handleOpenLinkDownload(content: any){
    window.open(app.baseApiUrl + content?.fileUrl, '_blank');
  }

  handleOpenLinkVideo(content: any){
    const link  = `https://www.youtube.com/embed/${content?.videoUrl}`

    window.open(link, '_blank');
  }

  handleEditLessonContent(content: any){
    this.statusActionLessonContent = Action.Edit;

    this.lessonContent = JSON.parse(JSON.stringify(content));

    if(this.lessonContent.type === TypeFile.File){
      this.lessonContent.fileName = this.fileService.getFileNameFromFileUrlServer(this.lessonContent.fileUrl);
    }

    if(this.lessonContent.type === TypeFile.Video){
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.lessonContent.videoUrl}`);
    }

    if(this.lessonContent.estimatedCompletionTime){
      this.lessonContent.requiedTime = true;
    }
  }

  isDisableSubmitLessonContent(): boolean{
    if(!this.lessonContent.title){
      return false;
    }

    return true;
  }

  public handleChangeFile(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      this.lessonContent.fileName = file.name;

      const reader = new FileReader();
  
      reader.onload = (e: any) => {
      };
  
      reader.readAsDataURL(file);
  
      this.lessonContent.file = file;
    }
  }

  handleVideoUrlChange(){
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.lessonContent.videoUrl}`);
  }
}
