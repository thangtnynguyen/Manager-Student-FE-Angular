

import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../../../configs/paging.config';
import orderConstant from '../../../constants/orderConstant';
import sortConstant from '../../../constants/sortConstant';
import systemConfig from '../../../configs/system.config';
import animationConstant from '../../../constants/animation.constant';
import { ContentLessonService } from 'src/app/admin/services/apis/content-lesson.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-content-lesson',
  templateUrl: './content-lesson.component.html',
  styleUrls: ['./content-lesson.component.css'],
  animations: animationConstant.animations
})
export class ContentLessonComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentlessonService: ContentLessonService,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      this.contentlesson.lessonId = id;
      this.contentlesson.type= 1;
      const request = {
        ...params,
        lessonId: id,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
        pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
      };

      this.queryParameters = {
        ...params,
        type: params['type'] ? params['type'] : 0,
        place: params['place'] ? params['place'] : 0,
      };

      this.getContentLessons(request);


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

  //content-lessons
  public contentlessons: any = [];
  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }
  public selectedlessons: any = [];

  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };

  // chọn bài học và thay đổi video
  currentVideoUrl: string = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/ohpHY8m54Hc?si=XLV6AcT7_HwGsjjE') as string;
  selectLesson( videoUrl: string): void {

    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(videoUrl)) as string;

  }
  //thay đổi video
  selectLessonContent(videoUrl: string): void {

    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl) as string;

  }
  getEmbedUrl(url: string): string {

    const videoId = this.extractVideoIdFromUrl(url);
    return `https://www.youtube.com/embed/${videoId}?si=XLV6AcT7_HwGsjjE`;

  }

  private extractVideoIdFromUrl(url: string): string {

    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || '';

  }
  getSafeUrl(url: string): SafeResourceUrl | null {
    if (url && url.trim() !== '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return null;
    }
  }
  public getContentLessons(request: any): any {
    this.contentlessonService.getContentLessons(request).subscribe((result: any) => {
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

        this.contentlessons = result.data.items;

        this.contentlessons = this.contentlessons.map((lesson: any) => ({
          ...lesson,
        }));

        if (this.contentlessons.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedlessons = [];
      }
    });
  };

  public selectAllContentLessons(event: any): void {
    if (event.target.checked) {
      this.selectedlessons = this.contentlessons.map((teacher: any) => teacher.id);
    } else {
      this.selectedlessons = [];
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
      this.selectedlessons = this.selectedlessons.filter((id: any) => id !== id);
    } else {
      this.selectedlessons.push(id);
    }
  }

  public isSelected(id: number): boolean {
    return this.selectedlessons.includes(id);
  }

  public handleSearchContentLessons() {
    this.route.queryParams.subscribe(params => {
      const id = this.route.snapshot.paramMap.get('id');
      const request = {
        ...params,
        lessonId: id,
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
      title: `Bạn có chắc muốn xoá lesson có Id ${id}?`,
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
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedlessons.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedlessons
        }


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

  //Add content lesson
  public contentlesson: any = {
    place: 0,
    type: 0,
    isBlank: true,
    isPublished: true,
    lessonId: null,
  };

  public validateLesson: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validateLesson).some(value => value === false || value === null || value === undefined);
  }

  public createContentLessonModalRef?: BsModalRef;
  @ViewChild('createContentLessonTemplate') createContentLessonTemplate!: TemplateRef<any>;

  public handleOpenCreateContentLessonModal(): void {
    this.createContentLessonModalRef = this.modalService.show(this.createContentLessonTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createContentLessonModalRef.onHidden?.subscribe(() => {
      // this.contentlesson = {
      //   place: 0,
      //   type: 0,
      //   isBlank: true
      // };
    });
  }


  public handleOnSubmitCreateContentLesson(): void {
    const formData = new FormData();

    formData.append('title', this.contentlesson.title);
    formData.append('description', this.contentlesson.description);
    formData.append('isPublished', this.contentlesson.isPublished);
    formData.append('type', this.contentlesson.type);
    formData.append('videoUrl', this.contentlesson.videoUrl);
    formData.append('lessonId', this.contentlesson.lessonId);


    this.contentlessonService.createContentLesson(formData).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success(result.message, '', {
          progressBar: true
        });
        this.route.queryParams.subscribe(params => {
          const id = this.route.snapshot.paramMap.get('id');
          this.contentlesson.lessonId = id;
          const request = {
            ...params,
            lessonId: id,
            pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
            pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
          };

          this.queryParameters = {
            ...params,
            type: params['type'] ? params['type'] : 0,
            place: params['place'] ? params['place'] : 0,
          };

          this.getContentLessons(request);
          this.createContentLessonModalRef?.hide();
        });
        // this.router.navigate(['/admin/lesson']);
      }
    }, error => {
      console.log(error);
      this.ngxToastr.error(error.error.message, '', {
        progressBar: true
      });
    });
  }

  public isExpiredValid(): boolean {
    if (!this.contentlesson.expired) {
      return true;
    }

    const currentDate = new Date();
    const expiredDate = new Date(this.contentlesson.expired);

    return expiredDate > currentDate;
  }

  //Detail lesson
  public detailContentLessonModalRef?: BsModalRef;
  @ViewChild('detailContentLessonTemplate') detailContentLessonTemplate!: TemplateRef<any>;

  public handleOpenDetailContentLessonModal(contentlesson: any): void {
    this.contentlesson = contentlesson;
    this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(contentlesson.videoUrl)) as string;
    this.detailContentLessonModalRef = this.modalService.show(this.detailContentLessonTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailContentLessonModalRef.onHidden?.subscribe(() => {
      this.contentlesson = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
  }
}





