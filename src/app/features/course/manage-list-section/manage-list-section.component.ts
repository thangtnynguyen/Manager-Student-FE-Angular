import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'src/app/core/modules/toastr/toastr.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { CkeditorUploadAdapter } from 'src/app/admin/adapters/ckeditor-upload.adapter';
import { classicEditorConfig } from 'src/app/core/configs/ckeditor.config';
import { Breadcrumb } from 'src/app/core/components/breadcrumb/breadcrumb.interface';
import { breadcrumbs } from './manage-info-section.config';
import { SectionDto } from 'src/app/core/models/interfaces/course/section-dto.interface';
import { CommonStatus } from 'src/app/core/constants/status.constant';
import { SectionField } from './manage-list-section.enum';
import { SectionService } from 'src/app/core/services/catalog/section.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-list-section',
  templateUrl: './manage-list-section.component.html',
  styleUrls: ['./manage-list-section.component.css']
})
export class ManageListSectionComponent {
  //Core
  Status = CommonStatus;

  //Identifier
  SectionField = SectionField;

  //Config
  breadcrumb: Breadcrumb[] = breadcrumbs;
  classicEditor = ClassicEditor;
  classicEditorConfig: any = classicEditorConfig;

  //Filter
  filterTitle: string = '';
  filterStatus: string = '';

  //Course
  title: string = '';
  sectionsState: SectionDto[] = [];
  sections: any = [];

  //Section
  section: any = {
    title: '',
    description: '',
    status: true,
    priority: 0
  };

  //Constructor
  constructor(
    private toastrService: ToastrService,
    private modalService: BsModalService,
    private sectionService: SectionService
    ) {}

  ngOnInit() {
    this.getCourseWithSection();
  }
  
  //Handle
  getCourseWithSection(){
    this.sectionService.getAllSection().subscribe((res) => {
      this.sections = res?.data;
      this.sectionsState = res?.data;
    });
  };

  //Event
  handleSearchSection(){
    this.sections = this.sectionsState.filter(section => (section.title?.includes(this.filterTitle) || !this.title) && (section.status?.toString() === this.filterStatus || !this.filterStatus));
  }

  //Create section
  createModalRef?: BsModalRef;
  @ViewChild('createTemplate') createSectionTemplate!: TemplateRef<any>;
  validateCreateForm: any = {
    priority: {
      inValidNumber: false,
    }
  }

  handleOpenCreateSectionModal(){
    this.section.priority = this.sections.length + 1;
    this.createModalRef = this.modalService.show(this.createSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
  
      this.createModalRef.onHidden?.subscribe(() => {
        this.section = {
          title: '',
          description: '',
          status: true,
          priority: 0
        };
      });
  }

  handleChangeDataCkeditor(event: any,object: any,type: number) {
    if(!event || !object || !type){
      return;
    }

    const data = event.editor.getData();

    if(type === SectionField.Description){
      object.description = data;
    }
  }

  initEditor(editor: ClassicEditor){
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      return new CkeditorUploadAdapter( loader );
    };
  }

  onPriorityChange(value: number) {
    if(!this.section.priority){
      this.validateCreateForm.priority.inValidNumber = false;
    }
    this.validateCreateForm.priority.inValidNumber = isNaN(value) || value <= 0;
  }

  handleOnSubmitCreateSection(){
    this.sectionService.createSection(this.section).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.createModalRef?.hide();
          this.getCourseWithSection();
        }
      },
      (exception) => {
        this.toastrService.error(exception.error.Message);
        console.log(exception?.error.Message);
      }
    );
  }

  //Edit section
  editModalRef?: BsModalRef;
  @ViewChild('editTemplate') editSectionTemplate!: TemplateRef<any>;
  validateEditForm: any = {
    priority: {
      inValidNumber: false,
    }
  }

  handleOpenEditSectionModal(section: any){
    const sectionCopy = { ...section };

    this.section = sectionCopy;

    this.editModalRef = this.modalService.show(this.editSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
  
      this.editModalRef.onHidden?.subscribe(() => {
        this.section = {
          title: '',
          description: '',
          status: true,
          priority: 0
        };
      });
  }

  handleOnSubmitEditSection(){
    this.sectionService.editSection(this.section).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
          this.editModalRef?.hide();
          this.getCourseWithSection();
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
      title: `Bạn có chắc muốn xoá chương có Id ${id}?`,
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

        this.sectionService.deleteSection(request).subscribe((result: any) => {
          if(result.status){           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi chương có Id ${id} đã bị xoá!`,
              icon: "success"
            });
    
            this.getCourseWithSection();
          }
        },error => {
          this.toastrService.error(error.error.Message);
          console.log(error?.error.Message);
        });
      }
    });
  }
}
