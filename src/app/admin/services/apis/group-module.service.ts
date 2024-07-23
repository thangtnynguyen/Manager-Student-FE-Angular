import { Header } from './../../../core/enums/request.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
  providedIn: `root`, 
})
export class GroupModuleService {
  private adminApiPrefix = PrefixApi.admin;
  constructor(private http: HttpClient   ,private httpss: HttpTeacherLoadingService) { }

  getGroupModules(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/group-module/get`, request);
  }

  createGroupModules(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/create`, request);
  }

  editGroupModules(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/edit`, request);
  }

  hideGroupModules(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/hide`, request);
  }
  
  deleteGroupModule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/delete`, request);
  }

  getStudentsGroupModule(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/group-module/get-students`,{params: request});
  }

  getGroupModule(request: any): Observable<any> {
    return this.httpss.get(`admin/group-module/get-by-id`, request);
  }

  exportExcelStudents(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/group-module/export-excel-students`, request);
    // return this.http.getBlob(`${this.adminApiPrefix}/group-module/export-excel-students`, request);
  }

  exportExcelScoreStudents(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/group-module/export-excel-score-students`, request);
    // return this.http.getBlob(`${this.adminApiPrefix}/group-module/export-excel-score-students`, request);
  }

  addStudentGroupModule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/add-student`, request);
  }

  generateInvitationCode(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/generate-invitation-code`, request);
  }

  importStudentsExcel(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/import-students-excel`, request);
    // return this.http.postFormData(`${this.adminApiPrefix}/group-module/import-students-excel`, request);
  }

  removeStudentGroupModule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/remove-student`, request);
  }

  removeStudentsGroupModule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/remove-students`, request);
  }

  getExamsByGroupModule(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/group-module/get-exams`, request);
  }

  getNotificationsByGroupModule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/group-module/get-notifications`, request);
  }

  submitSchedule(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/schedule/create-list-schedule`, request);
  }

  getSchedule(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/schedule/get`, {params: request});
  }
  
  getGroupModuleByUser(request: any): Observable<any> {
    return this.http.get(`/admin/group-module/get-group-module-by-user`, {params: request});
  }

  createAttendence(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/attendence/create-list-attendence`, request);
  }

  getAttendenceByScheduleId(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/attendence/get`, {params: request});
  }

  exportExcelAttendenceSheet(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/schedule/export-excel-attendence-sheet`, {params: request, responseType: 'blob'});
  }
}
