import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { EndsWithHtmlGuard } from 'src/app/student/shared/guards/endsWithHtml.guard';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: ':id',
    // canActivate: [EndsWithHtmlGuard],
    component: PostDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
