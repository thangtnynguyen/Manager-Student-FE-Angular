import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { QuestionTagRoutingModule } from './question-tag-routing.module';
import { QuestionTagComponent } from './question-tag.component';



import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [
    QuestionTagComponent
  ],
  imports: [
    CommonModule,
    QuestionTagRoutingModule,
    CollapseModule.forRoot(),
    FormsModule,
    CKEditorModule,
    NgSelectModule,
    UiSwitchModule
  ]
})
export class QuestionTagModule { }
