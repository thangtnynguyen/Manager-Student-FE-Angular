import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { AddExamComponent } from './add-exam/add-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { DetailExamComponent } from './detail-exam/detail-exam.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { AdminModule } from '../../admin.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListExamComponent } from './list-exam/list-exam.component';
import { SharedModule } from 'src/app/core/modules/shared/shared.module';
import { ToastrService ,ToastrModule} from 'ngx-toastr';
import { TranscriptStudentComponent } from './transcript-student/transcript-student.component';

@NgModule({
  declarations: [
    ListExamComponent,
    AddExamComponent,
    EditExamComponent,
    DetailExamComponent,
    TranscriptStudentComponent
  ],
  imports: [
 
    CommonModule,
    ExamRoutingModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    CKEditorModule,
    NgSelectModule,
    SharedModule,
    ToastrModule.forRoot(),


  ],
  providers: [
    ToastrService // Cung cấp ToastrService
  ]
})
export class ExamModule { }


