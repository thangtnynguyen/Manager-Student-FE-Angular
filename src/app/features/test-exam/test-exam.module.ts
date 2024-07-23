import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';

import { TestExamRoutingModule } from './test-exam-routing.module';
import { ListTestExamComponent } from './list-test-exam/list-test-exam.component';
import { DetailTestExamComponent } from './detail-test-exam/detail-test-exam.component';


import { ToastrService ,ToastrModule} from 'ngx-toastr';
import { GroupTestExamComponent } from './group-test-exam/group-test-exam.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TestingComponent } from './testing/testing.component';


import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    ListTestExamComponent,
    DetailTestExamComponent,
    GroupTestExamComponent,
    TestingComponent
  ],
  imports: [
    ToastrModule,
    CommonModule,
    NgSelectModule,
    UiSwitchModule,
    CommonModule,
    TestExamRoutingModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    CountdownModule

  ]
  ,
  providers: [
    ToastrService // Cung cấp ToastrService
  ]

})
export class TestExamModule { }
