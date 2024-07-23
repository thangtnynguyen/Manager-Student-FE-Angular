
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../../configs/paging.config';
import orderConstant from '../../constants/orderConstant';
import sortConstant from '../../constants/sortConstant';
import systemConfig from '../../configs/system.config';
import animationConstant from '../../constants/animation.constant';
import { SectionService } from '../../services/apis/section.service';
import { NotificationService } from '../../services/apis/notification.service';
import { GroupModuleService } from '../../services/apis/group-module.service';
import { UserService } from 'src/app/student/services/api/user.service';
import { TeacherService } from 'src/app/teacher/services/apis/teacher.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: animationConstant.animations
})
export class NotificationComponent  {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectionService: SectionService,
    private notificationService:NotificationService,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private groupModuleService: GroupModuleService,
    private userService:UserService,
    private teacherService: TeacherService,

  ) { }

  ngOnInit() {
    
    this.userService.getUserInfo().subscribe((result: any) => {
      if(result.status){
        this.account = result.data;

        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            id:this.account.id
          };
          this.getTeacher(request);
        });



        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            createBy:this.account.id,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };
    
          this.queryParameters = {
            ...params,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };
    
          this.getNotifications(request);
    
        });


      }
    });

  }
  account:any;
  public config: any = {
    paging: pagingConfig.default,
    baseUrl: systemConfig.baseFileSystemUrl,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS
  }

  public constant: any = {
    order: orderConstant,
    sort: sortConstant,
  }

  //sections
  public sections: any = [];
  public groupModules: any = [];

  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }
  public selectedsections: any = [];

  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };



  public getNotifications(request: any): any {
    this.notificationService.getNotifications(request).subscribe((result: any) => {
      if (result.status) {
        if (request.pageIndex !== 1 && result.data.items.length === 0) {
          this.route.queryParams.subscribe(params => {
            const request = {
              ...params,
              pageIndex: 1,
            };

            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: request,
              queryParamsHandling: 'merge',
            });
          });
        }

        this.sections = result.data.items;

        this.sections = this.sections.map((section: any) => ({
          ...section,
        }));

        if (this.sections.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedsections = [];
      }
    });
  };

  public teacher: any = [];

  public  getTeacher(request: any): void{
    this.teacherService.getTeacherByUserId(request).subscribe((result: any) => {
      if(result.status){
        this.teacher = result.data;

        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            teacherId:  this.teacher.id,
            sortBy: 'asc',
            
          };

          this.queryParameters = {
            ...params,
            teacherId:  this.teacher.id,
            semester: params['semester'] ? params['semester'] :  0,
            status: params['status'] ? params['status'] : 0,
            year: params['year'] ? params['year'] : null,
          };
          this.getGroupModules(request);
        });
      }
    });
  }

  public selectAllsections(event: any): void {
    if (event.target.checked) {
      this.selectedsections = this.sections.map((teacher: any) => teacher.id);
    } else {
      this.selectedsections = [];
    }
  }


  public isSelected(id: number): boolean {
    return this.selectedsections.includes(id);
  }
  toggleSelection(id: number): void {
    if (this.isSelected(id)) {
        this.selectedsections = this.selectedsections.filter((id:number) => id !== id);
    } else {
        this.selectedsections.push(id);
    }
  }


  public handleOnSortAndOrderChange(orderBy: string): void {
    if (this.paging.orderBy === orderBy) {
      this.paging.sortBy = this.paging.sortBy === this.constant.sort.asc ? this.constant.sort.desc : this.constant.sort.asc;
    } else {
      this.paging.sortBy = sortConstant.desc;
    }

    this.paging = {
      orderBy: orderBy,
      sortBy: this.paging.sortBy
    };

    this.route.queryParams.subscribe(params => {
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

  public handleSelectItem(id: number): void {
    if (this.isSelected(id)) {
      this.selectedsections = this.selectedsections.filter((id: any) => id !== id);
    } else {
      this.selectedsections.push(id);
    }
  }



  public handleSearchSections() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        title: this.queryParameters.title ? this.queryParameters.title : null,
        description: this.queryParameters.description ? this.queryParameters.description : null,
        place: this.queryParameters.place ? this.queryParameters.place : null,
        type: this.queryParameters.type ? this.queryParameters.type : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  public handleDeleteItem(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá thông báo có Id ${id}?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          id: id
        }

        this.notificationService.deleteNotification(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi thông báo có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                createBy:this.account.id,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getNotifications(request);
            });
          }
        }, error => {
          console.log(error);
          this.ngxToastr.error(error.error.message, '', {
            progressBar: true
          });
        });
      }
    });
  }

  public handleOnDeleteMultiple() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedsections.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedsections
        }

        this.notificationService.deleteMultipleNotification(request).subscribe((result: any) => {
          if(result.status){
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: result.message,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                createBy:this.account.id,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getNotifications(request);
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

  public handleOnChangePage(page: number) {
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

  public handleOnPerPageChange(event: any): void {
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

  //Add section
  public notification: any = {
    id:'',
    title: '',
    message: '',
    groupModulesIds: [],

  };

  public validatesection: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validatesection).some(value => value === false || value === null || value === undefined);
  }

  public createSectionModalRef?: BsModalRef;
  @ViewChild('createSectionTemplate') createSectionTemplate!: TemplateRef<any>;

  public handleOpenCreateSectionModal(): void {
    this.createSectionModalRef = this.modalService.show(this.createSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createSectionModalRef.onHidden?.subscribe(() => {
      this.notification = {
        title: '',
        description: '',
        groupModulesIds: [],

      };
    });
  }


  
  public handleOnSubmitNotification(): void {
    
    const request={
      title:this.notification.title,
      message:this.notification.message,
      groupModuleIds:this.notification.groupModulesIds,
    }

    this.notificationService.createNotification(request).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message, '', {
          progressBar: true
        });
        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            createBy:this.account.id,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };

          this.queryParameters = {
            ...params,
            createBy:this.account.id,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };

          this.getNotifications(request);
          this.createSectionModalRef?.hide();
        });
        // this.router.navigate(['/admin/section']);
      }
    }, error => {
      console.log(error);
      this.ngxToastr.error(error.error.message, '', {
        progressBar: true
      });
    });
  }

  //edit
  public editSectionModalRef?: BsModalRef;
  @ViewChild('editSectionTemplate') editSectionTemplate!: TemplateRef<any>;

  public handleOpenEditSectionModal(notification :any): void {
    this.notification = notification;
    this.editSectionModalRef = this.modalService.show(this.editSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.editSectionModalRef.onHidden?.subscribe(() => {
      this.notification = {
        title: '',
        description: '',
        groupModuleIds:[]
      };
    });
  }

  public handleOnSubmitEditSection(): void {
    const request={
      id:this.notification.id,
      title:this.notification.title,
      message:this.notification.message,
      groupModuleIds:this.notification.groupModulesIds,
    }

    this.notificationService.editNotification(request).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message, '', {
          progressBar: true
        });
        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            createBy:this.account.id,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };

          this.queryParameters = {
            ...params,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };

          this.getNotifications(request);
          this.editSectionModalRef?.hide();
        });
      }
    }, error => {
      console.log(error);
      this.ngxToastr.error(error.error.message, '', {
        progressBar: true
      });
    });
  }

  

  public isExpiredValid(): boolean {
    if (!this.notification.expired) {
      return true;
    }

    const currentDate = new Date();
    const expiredDate = new Date(this.notification.expired);

    return expiredDate > currentDate;
  }

  //Detail section
  public detailSectionModalRef?: BsModalRef;
  @ViewChild('detailSectionTemplate') detailSectionTemplate!: TemplateRef<any>;

  public handleOpenDetailsectionModal(notification: any): void {
    this.notification = notification;

    this.detailSectionModalRef = this.modalService.show(this.detailSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailSectionModalRef.onHidden?.subscribe(() => {
      this.notification = {
        title: '',
        description: '',
        groupModules:[]
      };
    });
  }









  public getGroupModules(request: any): void{
    this.groupModuleService.getGroupModules(request).subscribe((result: any) => {
      if(result.status){
        this.groupModules = result.data.items;
      }
    });
  }

  sectionModalRef?: BsModalRef;
  @ViewChild('sectionModalTemplate') sectionModalTemplate!: TemplateRef<any>;

  public handleOpenSectionModal(): void{
    this.sectionModalRef = this.modalService.show(this.sectionModalTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.sectionModalRef.onHidden?.subscribe(() => {
      this.groupModules.forEach((category: any) => {
        if (this.notification.groupModulesIds.includes(category.id)) {
          category.selected = true;
        }else{
          category.selected = false;
        }
      });
    });
  }

  public  handleCloseSectionModal(): void{
    const selectedSections = this.groupModules.filter((section: any) => section.selected === true);

    this.notification.groupModuleIds = selectedSections.map((section: any) => section.id);

    this.sectionModalRef?.hide();
  }

  public handleChooseSection(): void{
    const selectedCategories = this.groupModules.filter((category: any) => category.selected === true);

    this.notification.groupModulesIds = selectedCategories.map((category: any) => category.id);

    this.sectionModalRef?.hide();
  }

  public handleSubmitCreateExam(){
    console.log("moi",this.notification);
  }
}







