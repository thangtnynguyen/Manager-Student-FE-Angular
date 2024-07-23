import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';

import { StudentRoutingModule } from './student-routing.module';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { StudentComponent } from './student.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthEmailPhoneComponent } from './components/auth/auth-email-phone/auth-email-phone.component';
import { AuthGoogleComponent } from './components/auth/auth-google/auth-google.component';
import { AuthFacebookComponent } from './components/auth/auth-facebook/auth-facebook.component';
import { AuthGithubComponent } from './components/auth/auth-github/auth-github.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NewsFeedComponent } from './shared/components/news-feed/news-feed.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseComponent } from './components/course/course.component';
import { LearningComponent } from './components/learning/learning.component';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TimeSpanPipe } from './pipes/time-span.pipe';
import { CoursesQuestionComponent } from './components/courses-question/courses-question.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    StudentComponent,
    AuthComponent,
    AuthEmailPhoneComponent,
    AuthGoogleComponent,
    AuthGithubComponent,
    SidebarComponent,
    NewsFeedComponent,
    CourseComponent,
    LearningComponent,
    SafeHtmlPipe,
    TimeSpanPipe,
    CoursesQuestionComponent
  ],
  imports: [CommonModule, StudentRoutingModule, FormsModule, CountdownModule],
})
export class StudentModule {}
