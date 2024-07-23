import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { ListTeacherComponent } from './list-teacher/list-teacher.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { EditTeacherComponent } from './edit-teacher/edit-teacher.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DetailTeacherComponent } from './detail-teacher/detail-teacher.component';

@NgModule({
  declarations: [
    ListTeacherComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    DetailTeacherComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    NgSelectModule,
    UiSwitchModule
  ]
})
export class TeacherModule { }
