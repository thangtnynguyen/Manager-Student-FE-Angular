// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-exam',
//   templateUrl: './exam.component.html',
//   styleUrls: ['./exam.component.css']
// })
// export class ExamComponent {

// }




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
import { ExamService } from 'src/app/admin/services/apis/exam.service';
import questionConstant from 'src/app/admin/constants/question.constant';
import questionHelper from 'src/app/admin/helpers/question.helper';
@Component({
  selector: 'app-exam',
  templateUrl: './list-exam.component.html',
  styleUrls: ['./list-exam.component.css'],
  animations: animationConstant.animations
})
export class ListExamComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
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

      this.getExams(request);
      this.getExams(request);


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
    // Exam: ExamConstant
  }

  //questionHelper
  questionHelper: any = questionHelper;


  //Exams
  public exams: any = [];
  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }
  public selectedExams: any = [];

  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };



  public getExams(request: any): any {
    this.examService.getExams(request).subscribe((result: any) => {
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

        this.exams = result.data.items;

        this.exams = this.exams.map((Exam: any) => ({
          ...Exam,
        }));

        if (this.exams.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedExams = [];
      }
    });
  };

  public selectAllExams(event: any): void {
    if (event.target.checked) {
      this.selectedExams = this.exams.map((teacher: any) => teacher.id);
    } else {
      this.selectedExams = [];
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
      this.selectedExams = this.selectedExams.filter((id: any) => id !== id);
    } else {
      this.selectedExams.push(id);
    }
  }

  public isSelected(id: number): boolean {
    return this.selectedExams.includes(id);
  }

  public handleSearchExams() {
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

  public handleDeleteItem(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá đề thi có Id ${id}?`,
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

        this.examService.deleteExam(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi bài viết có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getExams(request);
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
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedExams.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedExams
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

  //Add Exam
  public exam: any = {
    place: 0,
    type: 0,
    isBlank: true,
    isPublished: true,
    courseId: 1,
  };

  public validateExam: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validateExam).some(value => value === false || value === null || value === undefined);
  }

  public createExamModalRef?: BsModalRef;
  @ViewChild('createExamTemplate') createExamTemplate!: TemplateRef<any>;

  public handleOpenCreateExamModal(): void {
    this.createExamModalRef = this.modalService.show(this.createExamTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createExamModalRef.onHidden?.subscribe(() => {
      this.exam = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
  }


  public handleOnSubmitCreateExam(): void {
    const formData = new FormData();

    formData.append('title', this.exam.title);
    formData.append('content', this.exam.content);
    formData.append('isPublished', this.exam.isPublished);
    formData.append('courseId', this.exam.courseId);


    this.examService.createExam(formData).subscribe((result: any) => {
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

          this.getExams(request);
          this.createExamModalRef?.hide();
        });
        // this.router.navigate(['/admin/Exam']);
      }
    }, error => {
      console.log(error);
      this.ngxToastr.error(error.error.message, '', {
        progressBar: true
      });
    });
  }


  //Detail Exam
  public detailExamModalRef?: BsModalRef;
  @ViewChild('detailExamTemplate') detailExamTemplate!: TemplateRef<any>;

  public handleOpenDetailExamModal(exam: any): void {
    this.exam = exam;

    this.detailExamModalRef = this.modalService.show(this.detailExamTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailExamModalRef.onHidden?.subscribe(() => {
      this.exam = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
  }

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

  //Status button
  public statusButton(exam: any): number {
    const currentTime = new Date();
    if(exam.endTime && new Date(exam.endTime) < currentTime){
      return 1;
    } else if(currentTime >= new Date(exam.startTime) && currentTime <= new Date(exam.endTime)){
      return 2;
    }else{
      return 3;
    }
  }
}






