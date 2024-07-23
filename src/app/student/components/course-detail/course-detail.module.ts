import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDetailRoutingModule } from './course-detail-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { LearningComponent } from './learning/learning.component';

@NgModule({
  declarations: [
    CoursesComponent,
    LearningComponent
  ],
  imports: [CommonModule, CourseDetailRoutingModule],
})
export class CourseDetailModule {}
