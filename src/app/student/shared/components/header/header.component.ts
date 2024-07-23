import { Component, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { AuthComponent } from 'src/app/student/components/auth/auth.component';
import { AuthService } from 'src/app/student/services/api/auth.service';
import { SharedComponentService } from 'src/app/student/services/components/shared-component.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild(AuthComponent) authComponent!: AuthComponent;

  constructor(public authService: AuthService, public sharedComponetService: SharedComponentService) {
  }
}
