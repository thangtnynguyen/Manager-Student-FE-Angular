import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DefaultTitle, Type } from './toastr.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(private messageService: MessageService) {}

  success(message: string | undefined,title: string | undefined = DefaultTitle.Success){
    this.messageService.add({
      severity: Type.Success,
      summary: title,
      detail: message,
    });
  }

  error(message: string | undefined,title: string | undefined = DefaultTitle.Error){
    this.messageService.add({
      severity: Type.Error,
      summary: title,
      detail: message,
    });
  }
}
