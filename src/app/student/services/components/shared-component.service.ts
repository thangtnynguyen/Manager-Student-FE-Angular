import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedComponentService {
  private isShowHeader: boolean = true;

  public getIsShowHeader(): boolean {
    return this.isShowHeader;
  }

  public setIsShowHeader(value: boolean): void {
    this.isShowHeader = value;
  }  
}
