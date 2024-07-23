import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPostComponent } from './list-post/list-post.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ApprovePostComponent } from './approve-post/approve-post.component';
const routes: Routes = [
  {
    path: '',
    component: ListPostComponent,
    
  },
  {
    path: 'create',
    component: AddPostComponent
  },
  {
    path: 'edit/:id',
    component: EditPostComponent
  },
  {
    path: 'detail/:id',
    component: DetailPostComponent
  },
  {
    path: 'approve',
    component: ApprovePostComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
