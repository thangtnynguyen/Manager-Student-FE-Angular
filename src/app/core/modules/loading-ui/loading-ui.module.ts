import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingUiComponent } from './loading-ui.component';

@NgModule({
  declarations: [
    LoadingUiComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingUiComponent
  ]
})
export class LoadingUiModule { }
