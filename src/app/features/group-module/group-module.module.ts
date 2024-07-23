import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CountdownModule } from 'ngx-countdown';
import { GroupModuleRoutingModule } from './group-module-routing.module';
import { ListGroupModuleComponent } from './list-group-module/list-group-module.component';
import { StudentGroupModuleComponent } from './student-group-module/student-group-module.component';
import { SharedModule } from '../../core/modules/shared/shared.module'
import { ToastrService ,ToastrModule} from 'ngx-toastr';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { AttendenceModuleComponent } from './attendence-module/attendence-module.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    ListGroupModuleComponent,
    StudentGroupModuleComponent,
    AttendenceModuleComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    GroupModuleRoutingModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TableModule,
    DialogModule,
    TabViewModule,
    ConfirmPopupModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    DividerModule,
    CountdownModule,
    SharedModule
  ],
  providers: [
    ToastrService, // Cung cấp ToastrService
    { provide: BsDropdownConfig, useValue: { autoClose: true } }
  ],
  bootstrap: [ListGroupModuleComponent]
})
export class GroupModuleModule { }
