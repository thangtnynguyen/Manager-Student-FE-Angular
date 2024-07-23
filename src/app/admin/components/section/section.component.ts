
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

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  animations: animationConstant.animations
})
export class SectionComponent  {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectionService: SectionService,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
        pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
      };

      this.queryParameters = {
        ...params,
        type: params['type'] ? params['type'] : 0,
        place: params['place'] ? params['place'] : 0,
      };

      this.getsections(request);

    });
  }

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



  public getsections(request: any): any {
    this.sectionService.getSections(request).subscribe((result: any) => {
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
      title: `Bạn có chắc muốn xoá section có Id ${id}?`,
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

        this.sectionService.deleteSection(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi sectioin có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getsections(request);
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

        this.sectionService.deleteMultipleSection(request).subscribe((result: any) => {
          if(result.status){
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: result.message,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getsections(request);
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
  public section: any = {
    title: '',
    description: '',
    priority: 1,
    status: true
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
      this.section = {
        title: '',
        description: '',
        priority: 1,
        status: true
      };
    });
  }


  
  public handleOnSubmitCreateSection(): void {
    const formData = new FormData();

    formData.append('title', this.section.title);
    formData.append('description', this.section.description);
    formData.append('status', this.section.status?this.section.status:false);
    formData.append('priority', this.section.priority ? this.section.priority : 1);


    this.sectionService.createSection(formData).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message, '', {
          progressBar: true
        });
        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };

          this.queryParameters = {
            ...params,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };

          this.getsections(request);
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

  public handleOpenEditSectionModal(section :any): void {
    this.section = section;
    this.editSectionModalRef = this.modalService.show(this.editSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.editSectionModalRef.onHidden?.subscribe(() => {
      this.section = {
        title: '',
        description: '',
        priority: 1,
        status: true
      };
    });
  }

  public handleOnSubmitEditSection(): void {
    const formData = new FormData();

    formData.append('id', this.section.id);
    formData.append('title', this.section.title);
    formData.append('description', this.section.description);
    formData.append('status', this.section.status);
    formData.append('priority', this.section.priority ? this.section.priority : 1);


    this.sectionService.editSection(formData).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message, '', {
          progressBar: true
        });
        this.route.queryParams.subscribe(params => {
          const request = {
            ...params,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };

          this.queryParameters = {
            ...params,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };

          this.getsections(request);
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
    if (!this.section.expired) {
      return true;
    }

    const currentDate = new Date();
    const expiredDate = new Date(this.section.expired);

    return expiredDate > currentDate;
  }

  //Detail section
  public detailSectionModalRef?: BsModalRef;
  @ViewChild('detailSectionTemplate') detailSectionTemplate!: TemplateRef<any>;

  public handleOpenDetailsectionModal(section: any): void {
    this.section = section;

    this.detailSectionModalRef = this.modalService.show(this.detailSectionTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailSectionModalRef.onHidden?.subscribe(() => {
      this.section = {
        title: '',
        description: '',
        priority: 1,
        status: true
      };
    });
  }
}






