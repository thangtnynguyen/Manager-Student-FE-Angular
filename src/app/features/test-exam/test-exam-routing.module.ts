import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTestExamComponent } from './list-test-exam/list-test-exam.component';
import { DetailTestExamComponent } from './detail-test-exam/detail-test-exam.component';
import { GroupTestExamComponent } from './group-test-exam/group-test-exam.component';
import { TestingComponent } from './testing/testing.component';

const routes: Routes = [


  {
    path: '',
    component: GroupTestExamComponent
  }
  ,
  {
    path: 'list-test-exam/:id',
    component: ListTestExamComponent
  }
  ,
  {
    path: 'start-test/:id',
    component: DetailTestExamComponent
  }
  ,
  {
    path: 'testing/:id',
    component: TestingComponent
  }
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestExamRoutingModule { }
