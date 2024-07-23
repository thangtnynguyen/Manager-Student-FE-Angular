import {
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import authConstant from '../../constants/auth-constant';
import { AuthEmailPhoneComponent } from './auth-email-phone/auth-email-phone.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent {
  modalRef?: BsModalRef;
  @ViewChild('template') template!: TemplateRef<any>;
  authConstant: any = authConstant;
  titleContent: string = authConstant.titleDefault;
  authView: number = authConstant.viewDefault;
  authAction: number = authConstant.loginAction;

  constructor(private modalService: BsModalService) {}

  openModal() {
    this.titleContent = authConstant.titleDefault;
    this.authView = authConstant.viewDefault;
    this.authAction = authConstant.loginAction;
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalRef?.hide();
  }

  changeViewAuth(title: string, view: number) {
    this.titleContent = title;
    this.authView = view;
  }
}
