import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class NotificationService {
  constructor(private httpAdminLoading: HttpAdminLoadingService, private http: HttpClient) { }

  getNotifications(request: any): Observable<any> {
    return this.httpAdminLoading.get('notification/get', request);
  }

  deleteNotification(request: any): Observable<any> {
    return this.httpAdminLoading.post('notification/delete', request);
  }

  deleteMultipleNotification(request: any): Observable<any> {
    return this.httpAdminLoading.post('notification/delete-multiple', request);
  }

  createNotification(request: any): Observable<any> {
    return this.httpAdminLoading.post('notification/create', request);
  }

  editNotification(request: any): Observable<any> {
    return this.httpAdminLoading.post('notification/edit', request);
  }
}
