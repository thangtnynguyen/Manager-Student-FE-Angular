import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { ManageInfoCourseComponent } from './manage-info-course/manage-info-course.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from 'src/app/core/modules/shared/shared.module';
import { ManageListSectionComponent } from './manage-list-section/manage-list-section.component';
import { ManageListLessonComponent } from './manage-list-lesson/manage-list-lesson.component';


@NgModule({
  declarations: [
    ManageInfoCourseComponent,
    ManageListSectionComponent,
    ManageListLessonComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    CKEditorModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
  ]
})
export class CourseModule { }
