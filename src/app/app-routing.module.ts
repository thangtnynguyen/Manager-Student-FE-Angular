import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeacherComponent } from './teacher/teacher.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { teacherGuard } from './shared/guards/teacher.guard';

import { Role } from './core/enums/role.enum';
import { Title } from './core/enums/title.enum';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './features/error/components/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { UnAuthGuard } from './core/guards/un-auth.guard';
import { DashboardComponent } from './teacher/components/dashboard/dashboard.component';
import { RoleComponent } from './features/role/role.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [UnAuthGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'course',
        loadChildren: () => import('./features/course/course.module').then((m) => m.CourseModule),
      },
      {
        path: 'group-module',
        loadChildren: () => import('./features/group-module/group-module.module').then((m) => m.GroupModuleModule),
      },
      {
        path: 'test',
        component: TeacherComponent
      },
      {
        path: 'exam',
        loadChildren: () => import('./features/exam/exam.module').then((m) => m.ExamModule),
      },
      {
        path: 'question',
        loadChildren: () => import('./features/question/question.module').then((m) => m.QuestionModule),
      },
      {
        path: 'teacher',
        loadChildren: () => import('./features/teacher/teacher.module').then((m) => m.TeacherModule),
      },
      {
        path: 'student',
        loadChildren: () => import('./features/student/student.module').then((m) => m.StudentModule),
      },
      {
        path: 'post',
        loadChildren: () => import('./features/post/post.module').then((m) => m.PostModule),
      },
      {
        path: 'role',
        component: RoleComponent
      }
      ,
      {
        path: 'account',
        loadChildren: () => import('./features/account/account.module').then((m) => m.AccountModule),
      }
      , 
      {
        path: 'test-exam',
        loadChildren: () => import('./features/test-exam/test-exam.module').then((m) => m.TestExamModule),
      },
    ]
  },
  // {
  //   path: 'dashboard',
  //   component: LayoutComponent,
  //   loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  // },
  {
    path: 'teacher',
    component: TeacherComponent,
    loadChildren: () =>
      import('./teacher/teacher.module').then((m) => m.TeacherModule),
    canActivate: [teacherGuard],

  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/auth',
    component: AdminComponent,
    loadChildren: () =>
      import('./admin/components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
