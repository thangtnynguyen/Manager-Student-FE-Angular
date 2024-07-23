import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionTagComponent } from './question-tag.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionTagComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionTagRoutingModule { }
