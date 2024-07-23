import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { UpdateAccountComponent } from './update-account/update-account.component';
import { ToastrService ,ToastrModule} from 'ngx-toastr';


@NgModule({
  declarations: [
    UpdateAccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),

  ]
  ,
  providers: [
    ToastrService // Cung cấp ToastrService
  ]
})
export class AccountModule { }
