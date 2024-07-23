import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningPathRoutingModule } from './learing-path-routing.module';
import { LearningPathListComponent } from './learning-path-list/learning-path-list.component';
import { LearningPathDetailComponent } from './learning-path-detail/learning-path-detail.component';

@NgModule({
  declarations: [LearningPathListComponent, LearningPathDetailComponent],
  imports: [CommonModule, LearningPathRoutingModule],
})
export class LearningPathModule {}
