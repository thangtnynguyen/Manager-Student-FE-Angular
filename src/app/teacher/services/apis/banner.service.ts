import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class BannerService {
  constructor(private httpAdminLoading: HttpAdminLoadingService) { }

  getBanners(request: any): Observable<any> {
    return this.httpAdminLoading.get('banner/get', request);
  }

  createBanner(request: any): Observable<any> {
    return this.httpAdminLoading.postFormData('banner/create', request);
  }
}
