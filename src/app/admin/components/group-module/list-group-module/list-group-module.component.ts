import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import groupModuleConstant from 'src/app/admin/constants/group-module.constant';
import { GroupModuleService } from 'src/app/admin/services/apis/group-module.service';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';

@Component({
  selector: 'app-list-group-module',
  templateUrl: './list-group-module.component.html',
  styleUrls: ['./list-group-module.component.css']
})
export class ListGroupModuleComponent {
  constructor(
    private teacherService: TeacherService,
    private groupModuleService: GroupModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService
  ) { }

  ngOnInit(){
    this.getTeachers({});

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
      };

      this.queryParameters = {
        ...params,
        teacherId: params['teacherId'] ? params['teacherId'] : 0,
        semester: params['semester'] ? params['semester'] :  0,
        status: params['status'] ? params['status'] : 0,
        year: params['year'] ? params['year'] : null,
      };

      this.getGroupModules(request);
    });
  }

  public constant: any = {
    groupModule: groupModuleConstant
  }

  //Prepare
  public teachers: any = [];

  public getTeachers(request: any): void{
    this.teacherService.getTeachers(request).subscribe((result: any) => {
      if(result.status){
        this.teachers = result.data.items;
      }
    });
  }

  public getGroupModules(request: any): void{
    this.groupModuleService.getGroupModules(request).subscribe((result: any) => {
      if(result.status){
        this.groupModules = result.data.items;
      }
    });
  }

  public getCurrentYear(): number {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
  
    var currentYear = currentMonth < 6 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  
    return currentYear;
  }

  public getCurrentSemester() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; 

    var currentSemester = currentMonth < 6 ? 2 : 1;
  
    return currentSemester;
  }

  //Group modules
  public groupModules: any = [];

  public queryParameters: any = {
    status: 0,
    semester: 0,
    teacherId: 0,
    name: '',
    year: ''
  }

  public handleSearchGroupModule(): void{
    this.route.queryParams.subscribe(params => {

      const request = {
        ...params,
        semester: this.queryParameters.semester ? this.queryParameters.semester : null,
        status: this.queryParameters.status ? (this.queryParameters.status === 0 ? null : this.queryParameters.status  ) : null,
        year: this.queryParameters.year ? this.queryParameters.year : null,
        teacherId: this.queryParameters.teacherId ? this.queryParameters.teacherId : null,
        name: this.queryParameters.name ? this.queryParameters.name : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  //Add group module
  public groupModule: any = {
    semester: 0,
    teacherId: 0,
    status: true
  };

  public validateGroupModule: any = {
    touchSemester: false,
  }

  public createGroupModuleModalRef?: BsModalRef;
  @ViewChild('createGroupModuleTemplate') createGroupModuleTemplate!: TemplateRef<any>;

  public handleOpenCreateGroupModuleModal(): void{
    this.createGroupModuleModalRef = this.modalService.show(this.createGroupModuleTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createGroupModuleModalRef.onHidden?.subscribe(() => {
        this.groupModule = {
          semester: 0,
          teacherId: 0,
          status: true
        };
    });
  }

  public validateForm(): boolean {
    return Object.values(this.validateGroupModule).some(value => value === false || value === null || value === undefined);
  }

  public handleOnSubmitCreateGroupModule(): void{
    const request = {
      ...this.groupModule,
      semester: +this.groupModule.semester,
      teacherId: +this.groupModule.teacherId,
      year: +this.groupModule.year
    }

    this.groupModuleService.createGroupModules(request).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.createGroupModuleModalRef?.hide();

        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
          };
    
          this.queryParameters = {
            ...params,
            teacherId: params['teacherId'] ? params['teacherId'] : 0,
            semester: params['semester'] ? params['semester'] :  0,
            status: params['status'] ? params['status'] : 0,
            year: params['year'] ? params['year'] : null,
          };
    
          this.getGroupModules(request);
        });
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  //Edit group module
  public editGroupModuleModalRef?: BsModalRef;
  @ViewChild('editGroupModuleTemplate') editGroupModuleTemplate!: TemplateRef<any>;

  public validateFormEdit(): boolean{
    if(!this.groupModule.semester){
      return false;
    }

    if(!this.groupModule.year){
      return false;
    }

    if(!this.groupModule.name){
      return false;
    }

    return true;
  }

  public handleOpenEditGroupModuleModal(groupModule: any): void{
    this.groupModule = groupModule;

    this.editGroupModuleModalRef = this.modalService.show(this.editGroupModuleTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));
  
      this.editGroupModuleModalRef.onHidden?.subscribe(() => {
          this.groupModule = {
            semester: 0,
            teacherId: 0,
            status: true
          };
      });
  }

  public handleOnSubmitEditGroupModule(): void{
    const request = {
      ...this.groupModule,
      semester: +this.groupModule.semester,
      teacherId: +this.groupModule.teacherId,
      year: +this.groupModule.year
    }

    this.groupModuleService.editGroupModules(request).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.editGroupModuleModalRef?.hide();

        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
          };
    
          this.queryParameters = {
            ...params,
            teacherId: params['teacherId'] ? params['teacherId'] : 0,
            semester: params['semester'] ? params['semester'] :  0,
            status: params['status'] ? params['status'] : 0,
            year: params['year'] ? params['year'] : null,
          };
    
          this.getGroupModules(request);
        });
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  //Hide group module
  public handleHideGroupModule(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn ẩn nhóm có Id ${id}?`,
      text: "Bản ghi sẽ được chuyển sang trạng thái ngừng hoạt động!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: +id
        }

        this.groupModuleService.hideGroupModules(request).subscribe((result: any) => {
          if(result.status){
            this.ngxToastr.success(result.message,'',{
              progressBar: true
            });
           
            swalWithBootstrapButtons.fire({
              title: "Ẩn thành công!",
              text: `Bản ghi nhóm học phần có Id ${id} đã bị ẩn!`,
              icon: "success"
            });
    
            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
              };
        
              this.queryParameters = {
                ...params,
                teacherId: params['teacherId'] ? params['teacherId'] : 0,
                semester: params['semester'] ? params['semester'] :  0,
                status: params['status'] ? params['status'] : 0,
                year: params['year'] ? params['year'] : null,
              };
        
              this.getGroupModules(request);
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

  //Delete group module
  public handleDeleteGroupModule(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá nhóm có Id ${id}?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: +id
        }

        this.groupModuleService.deleteGroupModule(request).subscribe((result: any) => {
          if(result.status){
            this.ngxToastr.success(result.message,'',{
              progressBar: true
            });
           
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi nhóm học phần có Id ${id} đã bị xoá!`,
              icon: "success"
            });
    
            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
              };
        
              this.queryParameters = {
                ...params,
                teacherId: params['teacherId'] ? params['teacherId'] : 0,
                semester: params['semester'] ? params['semester'] :  0,
                status: params['status'] ? params['status'] : 0,
                year: params['year'] ? params['year'] : null,
              };
        
              this.getGroupModules(request);
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
}
