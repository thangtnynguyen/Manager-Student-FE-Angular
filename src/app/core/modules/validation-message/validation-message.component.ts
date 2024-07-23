import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent {
  @Input() form?: FormGroup<any>;
  @Input() field: string = '';
  @Input() messages: any;

  ngOnInit(): void {

  }
  
}
