import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CountdownModule } from 'ngx-countdown';

import { GroupModuleRoutingModule } from './group-module-routing.module';
import { ListGroupModuleComponent } from './list-group-module/list-group-module.component';
import { StudentGroupModuleComponent } from './student-group-module/student-group-module.component';


@NgModule({
  declarations: [
    ListGroupModuleComponent,
    StudentGroupModuleComponent
  ],
  imports: [
    CommonModule,
    GroupModuleRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    CountdownModule
  ]
})
export class GroupModuleModule { }
