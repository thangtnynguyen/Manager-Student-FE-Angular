import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { TeacherRoutingModule } from './teacher-routing.module';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TeacherComponent } from './teacher.component';


import { HeaderComponent } from './shared/components/header/header.component';
import { VerticalMenuComponent } from './shared/components/vertical-menu/vertical-menu.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RightSideBarComponent } from './shared/components/right-side-bar/right-side-bar.component';
import { AddQuestionCategoryTreeComponent } from './components/question/add-question-category-tree/add-question-category-tree.component';
import { QuestionCategoryComponent } from './components/question-category/question-category.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [LayoutComponent, TeacherComponent,HeaderComponent, VerticalMenuComponent, FooterComponent, RightSideBarComponent,AddQuestionCategoryTreeComponent,QuestionCategoryComponent, NotificationComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    CKEditorModule,
  ],
  exports: [
    AddQuestionCategoryTreeComponent
  ],
})
export class TeacherModule { }
