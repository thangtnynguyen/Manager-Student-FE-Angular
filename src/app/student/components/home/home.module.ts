import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SlideShowComponent } from './slide-show/slide-show.component';
import { ProCourseListComponent } from './pro-course-list/pro-course-list.component';
import { FreeCourseListComponent } from './free-course-list/free-course-list.component';
import { PostListComponent } from './post-list/post-list.component';
import { VideoListComponent } from './video-list/video-list.component';
@NgModule({
  declarations: [
    HomeComponent,
    SlideShowComponent,
    ProCourseListComponent,
    FreeCourseListComponent,
    PostListComponent,
    VideoListComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, CarouselModule.forRoot()],
})
export class HomeModule {}
