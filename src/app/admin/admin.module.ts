import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { VerticalMenuComponent } from './shared/components/vertical-menu/vertical-menu.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RightSideBarComponent } from './shared/components/right-side-bar/right-side-bar.component';
import { BannerComponent } from './components/banner/banner.component';
import { GroupComponent } from './components/group/group.component';
import { QuestionCategoryComponent } from './components/question-category/question-category.component';
import { AddQuestionCategoryTreeComponent } from './components/question/add-question-category-tree/add-question-category-tree.component';
// import { ListExamComponent } from './components/exam/list-exam/list-exam.component';
import { SectionComponent } from './components/section/section.component';
import { RoleComponent } from './components/role/role.component';

@NgModule({
  declarations: [LayoutComponent, AdminComponent, HeaderComponent, VerticalMenuComponent, FooterComponent, RightSideBarComponent, BannerComponent, GroupComponent, QuestionCategoryComponent, 
    AddQuestionCategoryTreeComponent, SectionComponent, RoleComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    CKEditorModule,
  ],
  exports: [
    AddQuestionCategoryTreeComponent
  ],
})
export class AdminModule { }
