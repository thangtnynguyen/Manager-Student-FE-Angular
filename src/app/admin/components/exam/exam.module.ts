import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { AddExamComponent } from './add-exam/add-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { DetailExamComponent } from './detail-exam/detail-exam.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminModule } from '../../admin.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListExamComponent } from './list-exam/list-exam.component';

@NgModule({
  declarations: [
    ListExamComponent,
    AddExamComponent,
    EditExamComponent,
    DetailExamComponent,
  ],
  imports: [
 
    CommonModule,
    ExamRoutingModule,
    CollapseModule.forRoot(),
    FormsModule,
    CKEditorModule,
    NgSelectModule
  ]
})
export class ExamModule { }


