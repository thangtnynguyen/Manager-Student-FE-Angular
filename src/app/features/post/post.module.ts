import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { ListPostComponent } from './list-post/list-post.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { ApprovePostComponent } from './approve-post/approve-post.component';
import { ToastrService ,ToastrModule} from 'ngx-toastr';

@NgModule({
  declarations: [
    ListPostComponent,
    DetailPostComponent,
    EditPostComponent,
    AddPostComponent,
    ApprovePostComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    NgSelectModule,
    UiSwitchModule,
    ToastrModule.forRoot(),

  ]
  ,
  providers: [
    ToastrService // Cung cấp ToastrService
  ]
})
export class PostModule { }
