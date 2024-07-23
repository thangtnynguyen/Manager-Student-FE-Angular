import { Component, ViewEncapsulation } from '@angular/core';
import { LoadingUiService } from './loading-ui.service';
import loadingUiConstant from './loading-ui.constant';

@Component({
  selector: 'app-loading-ui',
  templateUrl: './loading-ui.component.html',
  styleUrls: ['./loading-ui.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingUiComponent {
  public loadingUiConstant: any = loadingUiConstant;
  
  constructor(public loadingUiService: LoadingUiService) { }
}
