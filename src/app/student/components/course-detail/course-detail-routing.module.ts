import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { LearningComponent } from './learning/learning.component';

const routes: Routes = [
  {
    path: 'courses/:slug',
    component: CoursesComponent,
  },
  {
    path: 'learning/:slug',
    component: LearningComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseDetailRoutingModule {}
