import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningPathListComponent } from './learning-path-list/learning-path-list.component';
import { LearningPathDetailComponent } from './learning-path-detail/learning-path-detail.component';

const routes: Routes = [
  {
    path: '',
    component: LearningPathListComponent,
  },
  {
    path: ':slug',
    component: LearningPathDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningPathRoutingModule {}
