import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebConfigComponent } from './web-config/web-config.component';
import { SystemConfigComponent } from './system-config/system-config.component';

const routes: Routes = [
  {
    path: 'web',
    component: WebConfigComponent,
    
  },
  {
    path: 'system',
    component: SystemConfigComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
