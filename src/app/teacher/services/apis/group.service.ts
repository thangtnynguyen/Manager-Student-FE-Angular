import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class GroupService {
  constructor(private httpAdminLoading: HttpAdminLoadingService) { }

  getGroups(request: any): Observable<any> {
    return this.httpAdminLoading.get('group/get', request);
  }
}
