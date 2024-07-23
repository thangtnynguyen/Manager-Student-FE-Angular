import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BannerService } from '../../services/apis/banner.service';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../../configs/paging.config';
import orderConstant from '../../constants/orderConstant';
import sortConstant from '../../constants/sortConstant';
import systemConfig from '../../configs/system.config';
import bannerConstant from '../../constants/banner.constant';
import animationConstant from '../../constants/animation.constant';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: animationConstant.animations
})
export class BannerComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
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

      this.getBanners(request);
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
    banner: bannerConstant
  }

  //Banners
  public banners: any = [];
  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }
  public selectedBanners: any = [];

  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };

  public getBanners(request: any): any{
    this.bannerService.getBanners(request).subscribe((result: any) => {
      if(result.status){
        if(request.pageIndex !== 1 && result.data.items.length === 0){
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

        this.banners = result.data.items;

        this.banners = this.banners.map((banner: any) => ({
          ...banner,
          placeName: this.constant.banner.places.find((place: any) => place.key === banner.place)?.value ?? '',
          typeName: this.constant.banner.types.find((type: any) => type.key === banner.type)?.value ?? '',
          status: new Date(banner.expired) < new Date() ? false : true
        }));

        if(this.banners.length === 0){
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedBanners = [];
      }
    });
  };

  public selectAllBanners(event: any): void{
    if (event.target.checked) {
      this.selectedBanners = this.banners.map((teacher: any) => teacher.id);
    } else {
      this.selectedBanners = [];
    }
  }

  public handleOnSortAndOrderChange(orderBy: string): void{
    if(this.paging.orderBy === orderBy){
      this.paging.sortBy = this.paging.sortBy === this.constant.sort.asc ? this.constant.sort.desc: this.constant.sort.asc;
    }else{
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
        this.selectedBanners = this.selectedBanners.filter((id: any) => id !== id);
    } else {
        this.selectedBanners.push(id);
    }
  }

  public isSelected(id: number): boolean {
    return this.selectedBanners.includes(id);
  }

  public handleSearchBanners(){
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        title: this.queryParameters.title ? this.queryParameters.title : null,
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

  public handleDeleteItem(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá banner có Id ${id}?`,
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

        // this.questionService.deleteQuestion(request).subscribe((result: any) => {
        //   if (result.status) {
        //     swalWithBootstrapButtons.fire({
        //       title: "Xoá thành công!",
        //       text: `Bản ghi câu hỏi có Id ${id} đã bị xoá!`,
        //       icon: "success"
        //     });

        //     this.route.queryParams.subscribe(params => {
        //       const request = {
        //         ...params,
        //         pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
        //         pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
        //       };

        //       this.getQuestions(request);
        //     });
        //   }
        // }, error => {
        //   console.log(error);
        //   this.ngxToastr.error(error.error.message, '', {
        //     progressBar: true
        //   });
        // });
      }
    });
  }

  public handleOnDeleteMultiple(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedBanners.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedBanners
        }

        // this.teacherService.deleteMultipleTeacher(request).subscribe((result: any) => {
        //   if(result.status){
        //     swalWithBootstrapButtons.fire({
        //       title: "Xoá thành công!",
        //       text: result.message,
        //       icon: "success"
        //     });

        //     this.route.queryParams.subscribe(params => {
        //       const request = {
        //         ...params,
        //         pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
        //         pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
        //       };
        
        //       this.getTeachers(request);
        //     });
        //   }
        // },error => {
        //   console.log(error);
        //   this.ngxToastr.error(error.error.message,'',{
        //     progressBar: true
        //   });
        // });
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

  //Add banner
  public banner: any = {
    place: 0,
    type: 0,
    isBlank: true
  };

  public validateBanner: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validateBanner).some(value => value === false || value === null || value === undefined);
  }

  public createBannerModalRef?: BsModalRef;
  @ViewChild('createBannerTemplate') createBannerTemplate!: TemplateRef<any>;

  public handleOpenCreateBannerModal(): void{
    this.createBannerModalRef = this.modalService.show(this.createBannerTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createBannerModalRef.onHidden?.subscribe(() => {
        this.banner = {
          place: 0,
          type: 0,
          isBlank: true
        };
    });
  }

  public handleChangeImage(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.banner.base64Image = e.target.result;
      };
  
      reader.readAsDataURL(file);
  
      this.banner.imageFile = file;
    }
  }

  public handleOnSubmitCreateBanner(): void{
    const formData = new FormData();

    formData.append('place', this.banner.place);
    formData.append('type', this.banner.type);
    formData.append('imageFile', this.banner.imageFile);
    formData.append('title', this.banner.title);
    formData.append('description', this.banner.description);
    formData.append('alt', this.banner.alt);
    formData.append('ctaTitle', this.banner.ctaTitle);
    formData.append('linkTo', this.banner.linkTo);
    formData.append('properties', this.banner.properties);
    formData.append('isBlank', this.banner.isBlank);
    formData.append('expired', this.banner.expired);
    formData.append('priority', this.banner.priority);

    this.bannerService.createBanner(formData).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
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
    
          this.getBanners(request);
          this.createBannerModalRef?.hide();
        });
        // this.router.navigate(['/admin/banner']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  public isExpiredValid(): boolean {
    if (!this.banner.expired) {
      return true; 
    }
  
    const currentDate = new Date();
    const expiredDate = new Date(this.banner.expired);
  
    return expiredDate > currentDate;
  }

  //Detail banner
  public detailBannerModalRef?: BsModalRef;
  @ViewChild('detailBannerTemplate') detailBannerTemplate!: TemplateRef<any>;

  public handleOpenDetailBannerModal(banner: any): void{
    this.banner = banner;

    this.detailBannerModalRef = this.modalService.show(this.detailBannerTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailBannerModalRef.onHidden?.subscribe(() => {
        this.banner = {
          place: 0,
          type: 0,
          isBlank: true
        };
    });
  }
}
