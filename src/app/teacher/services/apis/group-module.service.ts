import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class GroupModuleService {
  constructor(private httpAdminLoading: HttpAdminLoadingService, private http: HttpClient,private httpTC: HttpTeacherLoadingService) { }

  getGroupModules(request: any): Observable<any> {
    return this.httpAdminLoading.get('group-module/get', request);
  }

  createGroupModules(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/create', request);
  }

  editGroupModules(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/edit', request);
  }

  hideGroupModules(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/hide', request);
  }
  
  deleteGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/delete', request);
  }

  getStudentsGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.get('group-module/get-students', request);
  }

  getGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.get('group-module/get-by-id', request);
  }
  
  getGroupModuleByExamId(request: any): Observable<any> {
    return this.httpTC.get('admin/group-module/get-by-exam-id', request);
  }

  exportExcelStudents(request: any): Observable<any> {
    return this.httpAdminLoading.getBlob('group-module/export-excel-students', request);
  }

  exportExcelScoreStudents(request: any): Observable<any> {
    return this.httpAdminLoading.getBlob('group-module/export-excel-score-students', request);
  }

  addStudentGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/add-student', request);
  }

  generateInvitationCode(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/generate-invitation-code', request);
  }

  importStudentsExcel(request: any): Observable<any> {
    return this.httpAdminLoading.postFormData('group-module/import-students-excel', request);
  }

  removeStudentGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/remove-student', request);
  }

  removeStudentsGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/remove-students', request);
  }

  getExamsByGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.get('group-module/get-exams', request);
  }

  getNotificationsByGroupModule(request: any): Observable<any> {
    return this.httpAdminLoading.post('group-module/get-notifications', request);
  }
}
