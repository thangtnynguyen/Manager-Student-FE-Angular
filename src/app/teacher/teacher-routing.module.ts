import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionCategoryComponent } from './components/question-category/question-category.component';
import { NotificationComponent } from './components/notification/notification.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'group-module',
    loadChildren: () => import('./components/group-module/group-module.module').then((m) => m.GroupModuleModule),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'exam',
    loadChildren: () => import('./components/exam/exam.module').then((m) => m.ExamModule),

  },  {
    path: 'question',
    loadChildren: () => import('./components/question/question.module').then((m) => m.QuestionModule),
  },
  {
    path: 'question-category',
    component: QuestionCategoryComponent
  },
  {
    path: 'question-tag',
    loadChildren: () => import('./components/question-tag/question-tag.module').then((m) => m.QuestionTagModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./components/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'notification',
    component: NotificationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
