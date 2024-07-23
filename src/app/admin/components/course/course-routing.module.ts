import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoCourseComponent } from './info-course/info-course.component';
import { ListLessonComponent } from './list-lesson/list-lesson.component';
import { ContentLessonComponent } from './content-lesson/content-lesson.component';
import { SectionComponent } from '../section/section.component';

const routes: Routes = [
  {
    path: 'info',
    component: InfoCourseComponent
  },
  {
    path: 'lesson',
    component: ListLessonComponent
  },
  {
    path: 'lesson/content/:id',
    component: ContentLessonComponent
  },
  {
    path: 'section',
    component: SectionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
