import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { SystemConfigComponent } from './system-config/system-config.component';
import { WebConfigComponent } from './web-config/web-config.component';


@NgModule({
  declarations: [
    SystemConfigComponent,
    WebConfigComponent
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule
  ]
})
export class ConfigModule { }
