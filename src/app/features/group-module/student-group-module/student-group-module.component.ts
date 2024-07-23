import { Component, ViewChild, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../config/group-module.config';
import animationConstant from '../constants/animation.constant';
import orderConstant from 'src/app/admin/constants/orderConstant';
import { GroupModuleService } from 'src/app/admin/services/apis/group-module.service';
import systemConfig from 'src/app/admin/configs/system.config';
import sortConstant from 'src/app/admin/constants/sortConstant';
import fileConstant from 'src/app/admin/constants/file.constant';
import groupModuleConstant from 'src/app/admin/constants/group-module.constant';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';

interface ClassPeriodOption {
  period: number;
  selected: boolean;
}

interface ClassPeriodGroup {
  shift: string;
  periods: ClassPeriodOption[];
}


@Component({
  selector: 'app-student-group-module',
  templateUrl: './student-group-module.component.html',
  styleUrls: ['./student-group-module.component.css'],
  animations: animationConstant.animations,
  providers: [ConfirmationService]
})
export class StudentGroupModuleComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupModuleService: GroupModuleService,
    private modalService: BsModalService,
    private ngxToastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    let request = {};

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
    this.generateCalendar();

    this.getScheduleByGroupModuleId();
  }

  public config: any = {
    paging: pagingConfig.default,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
    baseUrl: systemConfig.baseFileSystemUrl,
  }

  //Students
  public groupModule: any = {};

  public students: any = [];

  public selectedBanners: any = [];

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

  public constant: any = {
    order: orderConstant,
    sort: sortConstant,
    file: fileConstant,
    groupModule: groupModuleConstant
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
        console.log('groupModule: ', this.groupModule)
      }
    });
  }

  public selectAllStudents(event: any): void{
    if (event.target.checked) {
      this.selectedBanners = this.students.map((teacher: any) => teacher.id);
    } else {
      this.selectedBanners = [];
    }
  }

  public handleSearchStudents(): void{
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        nameOrEmail: this.queryParameters.nameOrEmail ? this.queryParameters.nameOrEmail : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  public handleOnSortAndOrderChange(orderBy: any): void{
    if(this.paging.orderBy === orderBy){
      this.paging.sortBy = this.paging.sortBy === this.constant.sort.asc ? this.constant.sort.desc: this.constant.sort.asc;
    }else{
      this.paging.sortBy = this.constant.sort.desc;
    }

    this.paging = {
      orderBy: orderBy,
      sortBy: this.paging.sortBy
    };

    this.route.queryParams.subscribe(params => {
      console.log('pr',params)

      const request = {
        ...params,
        orderBy: this.paging.orderBy,
        sortBy: this.paging.sortBy,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  public handleSelectItem(id: any): void{
    if (this.isSelected(id)) {
      this.selectedBanners = this.selectedBanners.filter((id: any) => id !== id);
    } else {
      this.selectedBanners.push(id);
    }
  }

  public handleOnChangePage(page: any): void{
    if (page >= 1 && page <= this.paging.totalPages) {
      this.paging.pageIndex = page;
      
      this.route.queryParams.subscribe(params => {
        const request = {
          ...params,
          pageIndex: this.paging.pageIndex,
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: request,
          queryParamsHandling: 'merge',
        });
      });
    }
  }

  public handleOnPerPageChange(event: any): void{
    this.paging.pageSize = +event.target.value;

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageSize: this.paging.pageSize,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  public isSelected(id: number): boolean {
    return this.selectedBanners.includes(id);
  }

  public formatPhoneNumber(phoneNumber: any): string|null {
    if (!phoneNumber || phoneNumber.trim() === "") {
        return null;
    }

    if (phoneNumber.startsWith("+84")) {
        phoneNumber = "0" + phoneNumber.substring(3);
    }

    if (phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.substring(1);
    }

    return phoneNumber;
  }

  //Export

  public exportStudents(): void{
    this.route.params.subscribe(params => {
      const id = params['id'];
      
      this.groupModuleService.exportExcelStudents({id: id}).subscribe((result: Blob) => {
        console.log(result)
        const blob = new Blob([result], { type: this.constant.file.mimes.spreadsheetml });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.constant.groupModule.file.studentsExport;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }

  public exportScoreStudents(): void{
    this.route.params.subscribe(params => {
      const id = params['id'];
      
      this.groupModuleService.exportExcelScoreStudents({id: id}).subscribe((result: Blob) => {
        console.log(result)
        const blob = new Blob([result], { type: this.constant.file.mimes.spreadsheetml });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.constant.groupModule.file.scoreStudentsExport;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }

  //Add student
  public addStudentModalRef?: BsModalRef;
  public countdownConfig: any = {
    leftTime: 0,
    format: 'mm:ss'
  };
  @ViewChild('addStudentModalTemplate') addStudentModalTemplate!: TemplateRef<any>;

  public handleOpenAddStudentModal(): void{
    this.addStudentModalRef = this.modalService.show(this.addStudentModalTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg' }));

    this.addStudentModalRef.onHidden?.subscribe(() => {
    });
  }

  public idStudent: any = '';

  public statusAddStudent: any = 1;

  public handleValidateForm(): boolean{
    if(this.statusAddStudent === 1 && !this.idStudent){
      return true;
    }

    return false;
  }

  public handleSubmitAddStudentForm(): void{
    if(this.handleValidateForm()){
      return;
    }

    if(this.statusAddStudent === 1){
      this.route.params.subscribe(params => {
        const id = params['id'];
        const request = {
          studentId: this.idStudent,
          groupModuleId: id
        };
        
        this.groupModuleService.addStudentGroupModule(request).subscribe((result: any) => {
          if(result.status){
            this.ngxToastr.success(result.message,'',{
              progressBar: true
            });
            this.addStudentModalRef?.hide();

            this.route.queryParams.subscribe(params => {
              let request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : 1
              };

              this.route.params.subscribe(params => {
                const id = params['id'];
                request = Object.assign({}, request, { groupModuleId: id });
          
                this.getStudentGroupModule({id: id});

                this.getStudentsGroupModule(request);
              });
            });
          }
        },error => {
          console.log(error);
          this.ngxToastr.error(error.error.message,'',{
            progressBar: true
          });
        });
      });
    }
  }

  public handleGenerateInvitationCode(type: any): void{
    //Reset 
    this.importExcelForm = {
      file: null,
      passwordStudent: ''
    }
    this.idStudent = '';
    //Reset

    this.statusAddStudent = 2;

    if(type === 1){
      const now = new Date();
    if (!this.groupModule.invitationCode || new Date(this.groupModule.expiryTimeInvitation) <= now) {
      this.route.params.subscribe(params => {
      const id = params['id'];
      
      this.groupModuleService.generateInvitationCode({id:id,type: type}).subscribe((result: any) => {
        if (result.status) {
          this.groupModule.invitationCode = result.data.invitationCode;
          this.groupModule.expiryTimeInvitation = result.data.expiryTimeInvitation;

          const expiryTime = new Date(this.groupModule.expiryTimeInvitation);
          const leftTime = Math.round((expiryTime.getTime() - now.getTime()) / 1000);
          this.countdownConfig = {
            leftTime: leftTime,
            format: 'mm:ss'
          };
        } else {
          console.log("Lỗi khi tạo mã mời mới.")
          this.ngxToastr.error("Lỗi khi tạo mã mời mới.");
        }
      },error => {
        console.log(error);
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });
    });
    }else{
      const expiryTime = new Date(this.groupModule.expiryTimeInvitation);
      const leftTime = Math.round((expiryTime.getTime() - now.getTime()) / 1000);
      this.countdownConfig = {
        leftTime: leftTime,
        format: 'mm:ss'
      };
    }
    }else{
      const now = new Date();
      this.route.params.subscribe(params => {
        const id = params['id'];
        
        this.groupModuleService.generateInvitationCode({id:id,type: type}).subscribe((result: any) => {
          if (result.status) {
            this.groupModule.invitationCode = result.data.invitationCode;
            this.groupModule.expiryTimeInvitation = result.data.expiryTimeInvitation;
  
            const expiryTime = new Date(this.groupModule.expiryTimeInvitation);
            const leftTime = Math.round((expiryTime.getTime() - now.getTime()) / 1000);
            this.countdownConfig = {
              leftTime: leftTime,
              format: 'mm:ss'
            };
          } else {
            this.ngxToastr.error("Lỗi khi tạo mã mời mới.");
          }
        },error => {
          console.log(error);
          this.ngxToastr.error(error.error.message,'',{
            progressBar: true
          });
        });
      });
    }
  }

  public handleCountdownEvent(event: any) {
    const now = new Date();
    const type = 1;

    if (event.action === 'done') {
      this.route.params.subscribe(params => {
        const id = params['id'];
        
        this.groupModuleService.generateInvitationCode({id:id,type: type}).subscribe((result: any) => {
          if (result.status) {
            this.groupModule.invitationCode = result.data.invitationCode;
            this.groupModule.expiryTimeInvitation = result.data.expiryTimeInvitation;
  
            const expiryTime = new Date(this.groupModule.expiryTimeInvitation);
            const leftTime = Math.round((expiryTime.getTime() - now.getTime()) / 1000);
            this.countdownConfig = {
              leftTime: leftTime,
              format: 'mm:ss'
            };
          } else {
            this.ngxToastr.error("Lỗi khi tạo mã mời mới.");
          }
        },error => {
          console.log(error);
          this.ngxToastr.error(error.error.message,'',{
            progressBar: true
          });
        });
      });
    }
  }

  public copyInvitationCode(): void {
    const contentToCopy = this.groupModule.invitationCode;
    navigator.clipboard.writeText(contentToCopy).then(() => {
    }).catch(err => {
      console.error('Lỗi khi sao chép: ', err);
    });
  }
  
  //Import excel
  public importExcelForm: any = {
    file: null,
    passwordStudent: ''
  }
  
  public onFileSelected(event: any):void{
    this.importExcelForm.file = event.target.files[0];
  }

  public handleImportStudentGroupModule(): void{
    this.route.params.subscribe(params => {
      const id = params['id'];

      const formData = new FormData();

      formData.append('file', this.importExcelForm.file);
      formData.append('groupModuleId', id);
      formData.append('passwordStudent', this.importExcelForm.passwordStudent);

    this.groupModuleService.importStudentsExcel(formData).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });

        this.addStudentModalRef?.hide();

        this.route.queryParams.subscribe(params => {
          let request = {
            ...params,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : 1
          };

          this.route.params.subscribe(params => {
            const id = params['id'];
            request = Object.assign({}, request, { groupModuleId: id });
      
            this.getStudentGroupModule({id: id});

            this.getStudentsGroupModule(request);
          });
        });
      } 
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
    });
  }

  public handleChangeTabAddStudent(type: any){
    if(type === 1){
      this.importExcelForm = {
        file: null,
        passwordStudent: ''
      }

      this.statusAddStudent = 1;
    }

    if(type === 3){
      this.idStudent = '';

      this.statusAddStudent = 3;
    }
  }
  
  //Delete student
  public handleRemoveStudentGroupModule(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá sinh viên có mã sinh viên ${id} khỏi nhóm?`,
      text: "Sinh viên sẽ bị xoá thông tin khỏi nhóm!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          groupModuleId: this.groupModule.id,
          studentId: id
        }

        this.groupModuleService.removeStudentGroupModule(request).subscribe((result: any) => {
          if(result.status){
            this.ngxToastr.success(result.message,'',{
              progressBar: true
            });
           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Sinh viên có mã sinh viên ${id} đã bị xoá khỏi nhóm!`,
              icon: "success"
            });
    
            this.route.queryParams.subscribe(params => {
              let request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : 1
              };
    
              this.route.params.subscribe(params => {
                const id = params['id'];
                request = Object.assign({}, request, { groupModuleId: id });
          
                this.getStudentGroupModule({id: id});
    
                this.getStudentsGroupModule(request);
              });
            });
          }
        },error => {
          console.log(error);
          this.ngxToastr.error(error.error.message,'',{
            progressBar: true
          });
        });
      }
    });
  }

  public handleRemoveStudentsGroupModule(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá sinh viên có mã sinh viên khỏi nhóm?`,
      text: "Sinh viên sẽ bị xoá thông tin khỏi nhóm!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          groupModuleId: this.groupModule.id,
          studentIds: this.selectedBanners
        }

        this.groupModuleService.removeStudentsGroupModule(request).subscribe((result: any) => {
          if(result.status){
            this.ngxToastr.success(result.message,'',{
              progressBar: true
            });
           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Sinh viên có mã sinh viên đã bị xoá khỏi nhóm!`,
              icon: "success"
            });
    
            this.route.queryParams.subscribe(params => {
              let request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : 1
              };
    
              this.route.params.subscribe(params => {
                const id = params['id'];
                request = Object.assign({}, request, { groupModuleId: id });
          
                this.getStudentGroupModule({id: id});
    
                this.getStudentsGroupModule(request);
              });
            });
          }
        },error => {
          console.log(error);
          this.ngxToastr.error(error.error.message,'',{
            progressBar: true
          });
        });
      }
    });
  }

  //Offcanva
  public exams: any = [];
  public notifications: any = [];
  public offcanvasVisible = false;

  public toggleOffcanvas(): void {
    this.offcanvasVisible = !this.offcanvasVisible;

    if(this.offcanvasVisible){
      this.groupModuleService.getExamsByGroupModule({id: this.groupModule.id}).subscribe((result: any) => {
        if (result.status) {
          this.exams = result.data;  
        } 
      },error => {
        console.log(error);
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });

      this.groupModuleService.getNotificationsByGroupModule({id: this.groupModule.id}).subscribe((result: any) => {
        if (result.status) {
          this.notifications = result.data;  
        } 
      },error => {
        console.log(error);
        this.ngxToastr.error(error.error.message,'',{
          progressBar: true
        });
      });
    }
  }

  public closeOffcanvas(): void {
    this.offcanvasVisible = false;
  }

  public statusPageOption = 1;

  public formatAMPM(date: any) {
    date = new Date(date);

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  public formatDate(date: any) {
    date = new Date(date);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    return day + '/' + month + '/' + year;
  }

  public handleChangePageOption(type: any): void{
    this.statusPageOption = type;
  }

  public classPeriods: ClassPeriodGroup[] = [
    {
      shift: 'Ca sáng',
      periods: [
        {
          period: 1,
          selected: false
        },
        {
          period: 2,
          selected: false
        },
        {
          period: 3,
          selected: false
        }
        ,{
          period: 4,
          selected: false
        }
        ,{
          period: 5,
          selected: false
        }
      ]
    },
    {
      shift: 'Ca chiều',
      periods: [
        {
          period: 7,
          selected: false
        },
        {
          period: 8,
          selected: false
        },
        {
          period: 9,
          selected: false
        }
        ,{
          period: 10,
          selected: false
        }
        ,{
          period: 11,
          selected: false
        }
      ]
    }
  ]

  public schedules: {
    groupModuleId: number,
    dateSchool: Date,
    classPeriods: string,
    classRoom: string,
  }[] = [];
  
  public scrollAddClassSchedule(){
    const classScheduleElement = document.getElementById("class-schedule");
    if(classScheduleElement != null){
      classScheduleElement.style.right = "200%";
    }
    const addClassScheduleElement = document.getElementById("add-class-schedule");
    if(addClassScheduleElement != null){
      addClassScheduleElement.style.left = "0";

    }
  }

  public scrollClassSchedule(){
    const classScheduleElement = document.getElementById("class-schedule");
    if(classScheduleElement != null){
      classScheduleElement.style.right = "0%";
    }
    const addClassScheduleElement = document.getElementById("add-class-schedule");
    if(addClassScheduleElement != null){
      addClassScheduleElement.style.left = "200%";
    }
  }

  monthNames: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  currentDate: Date = new Date();
  currentDay: number = 1;
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  calendar: number[][] = [];
  classRoom: string = "";
  generateCalendar(): void {
    const weeksInMonth = 6;
    for (let i = 0; i < weeksInMonth; i++) {
      this.calendar[i] = [];
    }

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const lastDateOfMonth = lastDayOfMonth.getDate();

    let dayCounter = 1;
    for (let i = 0; i < weeksInMonth; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          this.calendar[i][j] = -1;
        } else if (dayCounter > lastDateOfMonth) {
          this.calendar[i][j] = -1;
        } else {
          this.calendar[i][j] = dayCounter++;
        }
      }
    }
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  submitScheduleOnDate(){
    let periodsSelected = "";
    for(let i = 0; i < this.classPeriods.length; i++){
      for(let j = 0; j < this.classPeriods[i].periods.length; j++){
        const period = this.classPeriods[i].periods;
        if(period[j].selected){
          periodsSelected += period[j].period + ",";
        }
      }
    }
    const dateSchool = `${this.currentYear}-${this.monthNames[this.currentMonth]}-${this.currentDay}`
    const dateSchoolParse = new Date(dateSchool);
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.schedules.push({
        groupModuleId: id,
        dateSchool: dateSchoolParse,
        classPeriods: periodsSelected.slice(0, -1),
        classRoom: this.classRoom
      })
    });
    this.visible = false;
  }

  removeScheduleItem(index: number){
    this.schedules.splice(index, 1);
  }

  submitSchedule(){
    // sắp xếp lịch học giảm dần theo ngày
    this.schedules.sort(function(a,b) {
      return -(a.dateSchool.getTime() - b.dateSchool.getTime());
    })
    this.groupModuleService.submitSchedule(this.schedules).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success("Bạn đã đăng ký lịch học thành công!", "", {
          progressBar: true
        });
        const classScheduleElement = document.getElementById("class-schedule");
        if(classScheduleElement != null){
          classScheduleElement.style.right = "0%";
        }
        const addClassScheduleElement = document.getElementById("add-class-schedule");
        if(addClassScheduleElement != null){
          addClassScheduleElement.style.left = "200%";
        }
      }
    })
  }

  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  accept() {
      this.confirmPopup.accept();
  }

  reject() {
      this.confirmPopup.reject();
  }

  confirm(event: Event) {
    if(this.schedules == null || this.schedules.length == 0) {
      this.ngxToastr.error("Bạn chưa đăng ký lịch học nào!", '',{
        progressBar: true
      });
      return;
    }

    else{
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Lịch học sẽ được lưu vào hệ thống!',
          accept: () => {
              this.submitSchedule();
          }
      });
    }
  }
  
  visible: boolean = false;
  dialogHeader: string = `Đăng ký lịch dạy ngày ${this.currentDay} - ${this.currentMonth} - ${this.currentYear}` ;

  showDialog(day: number) {
    this.visible = true;
    this.currentDay = day;
  }

  schedulesList: any = [];

  getScheduleByGroupModuleId(){
    let request = {};
    this.route.params.subscribe(params => {
      const id = params['id'];
      request = Object.assign({}, request, { groupModuleId: id });

      this.groupModuleService.getSchedule(request).subscribe((result: any) => {
        if(result.status){
          const scheduleClass = result.data.items;

          for(let i = 0; i < scheduleClass.length; i++){
            var dateSchool = new Date(scheduleClass[i].dateSchool);
            var today = new Date();
            if(dateSchool.getMonth() >= today.getMonth()){
              if(dateSchool.getDate() >= today.getDate()){
                const classPeriods = scheduleClass[i].classPeriods.split(',');
                scheduleClass[i].classPeriods = `${classPeriods[0]} ~ ${classPeriods[classPeriods.length - 1]}`;
                this.schedulesList.push(scheduleClass[i]);
              }
            }
          }
        }
      })
    });

  }
}
