import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingUiService } from './loading-ui.service';

@Component({
  selector: 'app-loading-ui',
  templateUrl: './loading-ui.component.html',
  styleUrls: ['./loading-ui.component.css']
})
export class LoadingUiComponent {
  isLoading: boolean = false;
  private loadingSubscription: Subscription;

  constructor(private loadingService: LoadingUiService) {
    this.loadingSubscription = this.loadingService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
