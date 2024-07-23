import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTeacherComponent } from './list-teacher/list-teacher.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { EditTeacherComponent } from './edit-teacher/edit-teacher.component';
import { DetailTeacherComponent } from './detail-teacher/detail-teacher.component';

const routes: Routes = [
  {
    path: '',
    component: ListTeacherComponent
  },
  {
    path: 'create',
    component: AddTeacherComponent
  },
  {
    path: 'edit/:id',
    component: EditTeacherComponent
  },
  {
    path: 'detail/:id',
    component: DetailTeacherComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
