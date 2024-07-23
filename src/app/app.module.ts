import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './core/modules/shared/shared.module';
import { SharedPipe } from './core/constants/shared-pipe.constant';
import { SharedLayoutComponent } from './shared/constants/shared-layout-component.constant';
import { HttpInterceptor } from './core/interceptors/http.interceptor';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NgxSpinnerModule } from 'ngx-spinner';


import { RoleComponent } from './features/role/role.component';
import { ToastrModule } from 'ngx-toastr';
 

@NgModule({
  declarations: [AppComponent,RoleComponent , ...SharedLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OverlayModule,
    HttpClientModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule,
    NgxSpinnerModule,
    SharedModule,
    ToastrModule.forRoot() // ToastrModule added

  ],
  providers: [
    ...SharedPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true
    }
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {}
