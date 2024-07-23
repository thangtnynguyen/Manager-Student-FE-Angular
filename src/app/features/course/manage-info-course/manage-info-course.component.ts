import { Component } from '@angular/core';
import { CourseService } from 'src/app/core/services/catalog/course.service';
import { ToastrService } from 'src/app/core/modules/toastr/toastr.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import systemConfig from 'src/app/admin/configs/system.config';
import { CkeditorUploadAdapter } from 'src/app/admin/adapters/ckeditor-upload.adapter';
import { Breadcrumb } from 'src/app/core/components/breadcrumb/breadcrumb.interface';
import { breadcrumbs } from './manage-info-course.config';
import { Course } from 'src/app/core/models/course/course.model';
import { classicEditorConfig } from 'src/app/core/configs/ckeditor.config';
import { CourseField } from './manage-info-course.enum';
import { TextService } from 'src/app/core/services/utilities/text.service';

@Component({
  selector: 'app-manage-info-course',
  templateUrl: './manage-info-course.component.html',
  styleUrls: ['./manage-info-course.component.css']
})
export class ManageInfoCourseComponent {
  //Identifier
  CourseField = CourseField;

  //Config
  breadcrumb: Breadcrumb[] = breadcrumbs;
  classicEditor = ClassicEditor;
  classicEditorConfig: any = classicEditorConfig;

  //Course
  course: Course = new Course();

  //Constructor
  constructor(private courseService: CourseService, private toastrService: ToastrService,private textService:TextService) {}

  ngOnInit() {
    this.getInfoCourse();
  }

  getInfoCourse(){
    this.courseService.getCourse().subscribe((result) => {
      this.course = result.data as Course;
    });
  };

  //Ckeditor
  initEditor(editor: ClassicEditor){
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      return new CkeditorUploadAdapter( loader );
    };
  }

  //Avatar
  handleChangeImage(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.course.base64Image = e.target.result;
        this.course.imageUrl = '';
      };
  
      reader.readAsDataURL(file);
  
      this.course.imageFile = file;
    }
  }

  //Ckeditor
  config: any = {
    classicEditorConfig: classicEditorConfig,
    system: systemConfig
  };

  handleChangeDataCkeditor(event: any,object: any,type: number) {
    if(!event || !object || !type){
      return;
    }

    const data = event.editor.getData();

    if(type === CourseField.Description){
      object.description = data;
    } else if(type === CourseField.Content){
      object.content = data;
    }
  }

  handleSubmitForm(){
    this.courseService.editCourse(this.course).subscribe(
      (res) => {
        if(res.status){
          this.toastrService.success(res.message);
        }
      },
      (exception) => {
        this.toastrService.error(exception.error.Message);
        console.log(exception?.error.Message);
      }
    );
  }

  handleGetSlugFromTitle(event: any){
    this.course.slug = this.textService.convertToSlug(event);
  }
}
