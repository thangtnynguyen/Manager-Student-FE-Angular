import { Injectable } from '@angular/core';
import loadingUiConstant from './loading-ui.constant';

@Injectable({
  providedIn: 'root'
})
export class LoadingUiService {
  public isShow: boolean = false;
  public type: string = loadingUiConstant.type.dualRing;

  constructor() {
  }

  public show(type: string){
    this.isShow = true;
    this.type = type;
  }

  public hide(){
    this.isShow = false;
    this.type = loadingUiConstant.type.dualRing;
  }
}
