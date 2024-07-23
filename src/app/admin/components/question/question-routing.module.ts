import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListQuestionComponent } from './list-question/list-question.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { DetailQuestionComponent } from './detail-question/detail-question.component';

const routes: Routes = [
  {
    path: '',
    component: ListQuestionComponent
  },
  {
    path: 'create',
    component: AddQuestionComponent
  },
  {
    path: 'edit/:id',
    component: EditQuestionComponent
  },
  {
    path: 'detail/:id',
    component: DetailQuestionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRoutingModule { }
