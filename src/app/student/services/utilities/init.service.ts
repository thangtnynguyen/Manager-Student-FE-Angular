import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private isInitialized: boolean = false;

  setInitialized(value: boolean) {
    this.isInitialized = value;
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }
}
