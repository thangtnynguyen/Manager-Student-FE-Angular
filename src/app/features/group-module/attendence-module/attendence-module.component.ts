import { map } from 'rxjs/operators';
import { HttpStatus } from './../../../core/enums/http-status.enum';
import { student } from './../../../core/models/student/student.model';
import { Component, OnInit } from '@angular/core';
import { GroupModuleService } from 'src/app/admin/services/apis/group-module.service';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../config/group-module.config';
import systemConfig from 'src/app/admin/configs/system.config';
import sortConstant from 'src/app/admin/constants/sortConstant';
import fileConstant from 'src/app/admin/constants/file.constant';
import groupModuleConstant from 'src/app/admin/constants/group-module.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import orderConstant from 'src/app/admin/constants/orderConstant';

@Component({
  selector: 'app-attendence-module',
  templateUrl: './attendence-module.component.html',
  styleUrls: ['./attendence-module.component.css'],
})
export class AttendenceModuleComponent implements OnInit {

  //Students
  public groupModule: any = {};
  
  public students: any = [];

  public schedules: any = [];

  public attendences: any = [];

  public attendencesByMonth: any = [];

  public scheduleSelected: any = null;

  public daySelected: any = null;

  public checkDateSelected: boolean = true;

  public hasAttendanted: boolean = false;

  public disableEdit: boolean = true;

  public config: any = {
    paging: pagingConfig.default,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
    baseUrl: systemConfig.baseFileSystemUrl,
  }

  public constant: any = {
    order: orderConstant,
    sort: sortConstant,
    file: fileConstant,
    groupModule: groupModuleConstant
  }


  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };

  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }

  public selectedBanners: any = [];
  
  constructor(
    private groupModuleService: GroupModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxToastr: ToastrService,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let request = {};

    this.daySelected = new Date();
    this.route.params.subscribe(params => {
      const id = params['id'];
      request = Object.assign({}, request, { groupModuleId: id });
      this.getStudentGroupModule({id: id});

    });

    this.route.queryParams.subscribe(params => {
      request = Object.assign({}, params, request, {
        pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
        pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
        sortBy: params['sortBy'] ? params['sortBy'] : '',
        orderBy: params['orderBy'] ? params['orderBy'] : '',
        nameOrEmail: params['nameOrEmail'] ? params['nameOrEmail'] : ''
      });

      this.queryParameters = { ...params };
      delete this.queryParameters.groupModuleId;

      this.getStudentsGroupModule(request);      
    });
  }
  
  public getStudentsGroupModule(request: any): void{
    this.groupModuleService.getStudentsGroupModule(request).subscribe((result: any) => {
      if(result.status){
        if(request.pageIndex !== 1 && result.data.items.length === 0){
          this.route.queryParams.subscribe(params => {
            const request = {
              ...params,
              pageIndex: 1,
              pageSize:10
            };
      
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: request,
              queryParamsHandling: 'merge',
            });
          });
        }

        this.students = result.data.items;
    
        let requestGetSchedule = {};

        this.route.params.subscribe(params => {
          const id = params['id'];
          requestGetSchedule = Object.assign({}, requestGetSchedule, { groupModuleId: id });
          this.getSchedules(requestGetSchedule)
    
        });

        if(this.students.length === 0){
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedBanners = [];
      }
    });
  }
  
  public getStudentGroupModule(request: any): void{
    this.groupModuleService.getGroupModule(request).subscribe((result: any) => {
      if(result.status){
        this.groupModule = result.data;
      }
    });
  }

  public getSchedules(request: any): void {
    this.groupModuleService.getSchedule(request).subscribe((result: any) => {
      if(result.status){
        this.schedules = result.data.items;

        console.log('schedules: ', this.schedules);
        console.log('student: ', this.students);
        for(let i = 0; i < this.schedules.length; i++) {
          var dateSchoolSchedule = new Date(this.schedules[i].dateSchool);
          var today = new Date();

          if(dateSchoolSchedule.getMonth() == today.getMonth()){
            if(dateSchoolSchedule.getDate() == today.getDate())
              this.scheduleSelected = this.schedules[i];
          }
        }

        var listAttendenceByStudentId = []
        for(let i = 0; i < this.students.length; i++){
          for(let j = 0; j < this.schedules.length; j++){
            for(let k = 0; k < this.schedules[j].attendances.length; k++){
              const attendance = this.schedules[j].attendances[k];
              if(this.students[i].studentId == attendance.studentId){
                var attendantValue = "";
                if(attendance.attendant == true){
                  attendantValue = "C";
                }
                else if(attendance.permittedLeave == true){
                  attendantValue = "P";
                }
                else if(attendance.unpermittedLeave == true){
                  attendantValue = "K";
                }

                // lưu từng bản ghi điểm danh của tất cả sinh viên thành mảng 1 chiều;
                listAttendenceByStudentId.push({
                  studentId: attendance.studentId,
                  name: this.students[i].user.name,
                  attendence: attendantValue
                })
              }
            }
          }
        }

        // gom nhóm listAttendenceByStudentId theo studentId
        var getListAttendencesByStudentId: any = []; // [key: value] <=> [studentId: attendence]
        listAttendenceByStudentId.forEach((attenByStudentId) =>{
          if(!getListAttendencesByStudentId[attenByStudentId.studentId]){
            getListAttendencesByStudentId[attenByStudentId.studentId] = [];
          }

          getListAttendencesByStudentId[attenByStudentId.studentId].push(attenByStudentId.attendence);
        });

        for(let i = 0; i < this.students.length; i++){
          let numberLessonPresent = 0;
          let numberLessonAbsented = 0;
          if(getListAttendencesByStudentId[this.students[i].studentId] != null){
            for(let j = 0; j < getListAttendencesByStudentId[this.students[i].studentId].length; j++){
              if(getListAttendencesByStudentId[this.students[i].studentId][j] == "C"){
                numberLessonPresent++;
              }
              if(getListAttendencesByStudentId[this.students[i].studentId][j] == "P" || 
              getListAttendencesByStudentId[this.students[i].studentId][j] == "K"){
                numberLessonAbsented++;
              }
            }
            this.attendencesByMonth.push({
              index: i + 1,
              studentId: this.students[i].studentId,
              name: this.students[i].user.name,
              attendence: getListAttendencesByStudentId[this.students[i].studentId],
              numberLessonPresent: numberLessonPresent,
              numberLessonAbsented: numberLessonAbsented,
              schoolAttendanceRate: ((numberLessonPresent / getListAttendencesByStudentId[this.students[i].studentId].length) * 100).toFixed(2) + "%"
            });
          }
        }

        console.log('attendencesByMonth: ', this.attendencesByMonth);

        if(this.scheduleSelected){
          this.getAttendenceByScheduleId(this.scheduleSelected);
        }
        else{
          this.hasAttendanted = false;
        }
      }
    });
  }

  public submitAttendence(){
    
      var request = this.attendences.map((attendence: any) =>{
        return {
          studentId: attendence.studentId,
          scheduleId: this.scheduleSelected.id,
          attendant: attendence.attendance == "attendant",
          permittedLeave: attendence.attendance == "permittedLeave",
          unpermittedLeave: attendence.attendance == "unpermittedLeave",
          note: attendence.note
        }
      })

      this.groupModuleService.createAttendence(request).subscribe((result: any) => {
        if(result.status){
          this.ngxToastr.success('Điểm danh thành công!');
        }
      })
  }

  getAttendenceByScheduleId(schedule: any) {
    this.disableEdit = true;
    this.scheduleSelected = schedule;
    this.daySelected = schedule.dateSchool;
    
    var dateSchoolSchedule = new Date(new Date(this.daySelected));
    var today = new Date();

    if(dateSchoolSchedule.getMonth() <= today.getMonth()){
      if(dateSchoolSchedule.getDate() <= today.getDate())
      {
        var request = {
          scheduleId: schedule.id
        }
        this.groupModuleService.getAttendenceByScheduleId({scheduleId: schedule.id}).subscribe((result) => {
          if(result.status){
            this.attendences = [];

            var attendenceResponse = result.data.items;

            if(attendenceResponse != null && attendenceResponse.length != 0){
              this.hasAttendanted = true;
              var index = 0;
              for(let i = 0; i < this.students.length; i++){
                for(let j = 0; j < attendenceResponse.length; j++){
                  if(this.students[i].studentId == attendenceResponse[j].studentId){
                    index++;
                    var attendantValue = "";
                    if(attendenceResponse[j].attendant == true){
                      attendantValue = "attendant"
                    }
                    else if(attendenceResponse[j].permittedLeave == true){
                      attendantValue = "permittedLeave"
                    }
                    else if (attendenceResponse[j].unpermittedLeave == true){
                      attendantValue = "unpermittedLeave"
                    }
                    this.attendences.push({
                      index: index,
                      studentId: this.students[i].studentId,
                      attendance: attendantValue,
                      user: this.students[i].user,
                      note: attendenceResponse[j].note
                    })
                  }
                }
              }
            }
            else{
              this.hasAttendanted = false;
              this.attendences = this.students.map((student: any, index: number) => {
                var attendence = Object.assign({}, student);
                attendence["index"] = index + 1;
                attendence["attendance"] = false;
                return attendence;
              })
            }
          }
        })
      }
    }
    else{
      this.checkDateSelected = false;
    }
  }

  exportExcelAttendenceSheet(){

    var request = {};
    this.route.params.subscribe(params => {
      const id = params['id'];
      request = Object.assign({}, request, { groupModuleId: id });
      this.groupModuleService.exportExcelAttendenceSheet({groupModuleId: id}).subscribe((data: Blob) => {
        console.log("ok")
        console.log(data);
        const excelFile = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(excelFile);
        downloadLink.download = "BangDiemDanhLop" + this.groupModule.name + ".xlsx";
        downloadLink.click();
      });
    });
  }
}
