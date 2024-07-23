import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExamComponent } from './add-exam/add-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { ListExamComponent } from './list-exam/list-exam.component';
import { DetailExamComponent } from './detail-exam/detail-exam.component';
import { TranscriptStudentComponent } from './transcript-student/transcript-student.component';

const routes: Routes = [
  {
    path: '',
    component: ListExamComponent
  },
  {
    path: 'create',
    component: AddExamComponent
  },
  {
    path: 'edit/:id',
    component: EditExamComponent
  },
  {
    path: 'detail/:id',
    component: DetailExamComponent
  },
  {
    path: 'transcript/:id',
    component: TranscriptStudentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
