

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
import { LessonService } from 'src/app/admin/services/apis/lesson.service';

@Component({
   selector: 'app-content-course',
  templateUrl: './list-lesson.component.html',
  styleUrls: ['./list-lesson.component.css'],
  animations: animationConstant.animations
})
export class ListLessonComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService:LessonService,
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

      this.getLessons(request);
      this.getLessons(request);

      
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
    // lesson: lessonConstant
  }

  //lessons
  public lessons: any = [];
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


    //Lessons
  // public lessons: any[] = [];

  // public config: { [key: string]: any, perPageOptions: any[] } = { perPageOptions: DEFAULT_PER_PAGE_OPTIONS };

  // getLessons(request: any) {
  //   this.lessonService.getLessons(request).subscribe((result: any) => {
  //     if(result.status){
  //       if(request.pageIndex !== 1 && result.data.items.length === 0){
  //         this.route.queryParams.subscribe(params => {
  //           const request = {
  //             ...params,
  //             pageIndex: 1,
  //           };
      
  //           this.router.navigate([], {
  //             relativeTo: this.route,
  //             queryParams: request,
  //             queryParamsHandling: 'merge',
  //           });
  //         });
  //       }

  //       this.lessons = result.data.items;
  //     }
  //   });
  // }
  public getLessons(request: any): any{
    this.lessonService.getLessons(request).subscribe((result: any) => {
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

        this.lessons = result.data.items;

        this.lessons = this.lessons.map((lesson: any) => ({
          ...lesson,
        }));

        if(this.lessons.length === 0){
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedlessons = [];
      }
    });
  };

  public selectAlllessons(event: any): void{
    if (event.target.checked) {
      this.selectedlessons = this.lessons.map((teacher: any) => teacher.id);
    } else {
      this.selectedlessons = [];
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
        this.selectedlessons = this.selectedlessons.filter((id: any) => id !== id);
    } else {
        this.selectedlessons.push(id);
    }
  }

  public isSelected(id: number): boolean {
    return this.selectedlessons.includes(id);
  }

  public handleSearchLessons(){
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        title: this.queryParameters.title ? this.queryParameters.title : null,
        content: this.queryParameters.content ? this.queryParameters.content : null,
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

  //Add lesson
  public lesson: any = {
    place: 0,
    type: 0,
    isBlank: true,
    isPublished: true,
    courseId: 1,
  };

  public validateLesson: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validateLesson).some(value => value === false || value === null || value === undefined);
  }

  public createLessonModalRef?: BsModalRef;
  @ViewChild('createLessonTemplate') createLessonTemplate!: TemplateRef<any>;

  public handleOpenCreateLessonModal(): void{
    this.createLessonModalRef = this.modalService.show(this.createLessonTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createLessonModalRef.onHidden?.subscribe(() => {
        this.lesson = {
          place: 0,
          type: 0,
          isBlank: true
        };
    });
  }


  public handleOnSubmitCreateLesson(): void{
    const formData = new FormData();

    formData.append('title', this.lesson.title);
    formData.append('content', this.lesson.content);
    formData.append('isPublished', this.lesson.isPublished);
    formData.append('courseId', this.lesson.courseId);
   

    this.lessonService.createLesson(formData).subscribe((result: any) => {
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
    
          this.getLessons(request);
          this.createLessonModalRef?.hide();
        });
        // this.router.navigate(['/admin/lesson']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }

  public isExpiredValid(): boolean {
    if (!this.lesson.expired) {
      return true; 
    }
  
    const currentDate = new Date();
    const expiredDate = new Date(this.lesson.expired);
  
    return expiredDate > currentDate;
  }

  //Detail lesson
  public detailLessonModalRef?: BsModalRef;
  @ViewChild('detailLessonTemplate') detailLessonTemplate!: TemplateRef<any>;

  public handleOpenDetailLessonModal(lesson: any): void{
    this.lesson = lesson;

    this.detailLessonModalRef = this.modalService.show(this.detailLessonTemplate,
    Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailLessonModalRef.onHidden?.subscribe(() => {
        this.lesson = {
          place: 0,
          type: 0,
          isBlank: true
        };
    });
  }
}





