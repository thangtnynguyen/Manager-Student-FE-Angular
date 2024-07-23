import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { QuestionRoutingModule } from './question-routing.module';
import { ListQuestionComponent } from './list-question/list-question.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { DetailQuestionComponent } from './detail-question/detail-question.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionCategoryTreeComponent } from './question-category-tree/question-category-tree.component';
import { AddQuestionCategoryTreeComponent } from './add-question-category-tree/add-question-category-tree.component';
import { TeacherModule } from '../../teacher.module';


@NgModule({
  declarations: [
    ListQuestionComponent,
    AddQuestionComponent,
    EditQuestionComponent,
    DetailQuestionComponent,
    QuestionCategoryTreeComponent,
    // AddQuestionCategoryTreeComponent,
  ],
  imports: [
    CommonModule,
    QuestionRoutingModule,
    CollapseModule.forRoot(),
    FormsModule,
    CKEditorModule,
    NgSelectModule,
    TeacherModule
  ]
})
export class QuestionModule { }
