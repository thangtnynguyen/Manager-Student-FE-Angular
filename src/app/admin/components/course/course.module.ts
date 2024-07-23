import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { CourseRoutingModule } from './course-routing.module';
import { InfoCourseComponent } from './info-course/info-course.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListLessonComponent } from './list-lesson/list-lesson.component';
import { ContentLessonComponent } from './content-lesson/content-lesson.component';

@NgModule({
  declarations: [
    InfoCourseComponent,
    ListLessonComponent,
    ContentLessonComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class CourseModule { }
