import { Component } from '@angular/core';
import sortConstant from 'src/app/teacher/constants/sortConstant';
import orderConstant from 'src/app/teacher/constants/orderConstant';
import animationConstant from '../../constants/animation.constant';
import examResultConstant from 'src/app/teacher/constants/exam-result.constant';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupModuleService } from 'src/app/teacher/services/apis/group-module.service';
import { TeacherService } from 'src/app/teacher/services/apis/teacher.service';
import { UserService } from 'src/app/student/services/api/user.service';
import { ExamService } from 'src/app/teacher/services/apis/exam.service';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../../configs/paging.config';
import systemConfig from '../../configs/system.config';


@Component({
  selector: 'app-transcript-student',
  templateUrl: './transcript-student.component.html',
  styleUrls: ['./transcript-student.component.css'],
  animations: animationConstant.animations

})
export class TranscriptStudentComponent {

  constructor(
    private teacherService: TeacherService,
    private groupModuleService: GroupModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private userService: UserService,
    private examService: ExamService,


  ) { }



  account: any;
  ngOnInit() {


    this.route.params.subscribe(pathParams => {
      const examId = pathParams['id'];

      this.getGroupModules({id:examId});

      this.route.queryParams.subscribe(params => {
        const request = {
          ...params,
          examId: examId,
          pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
          pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
        };

        this.queryParameters = {
          ...params,
          type: params['type'] ? params['type'] : 0,
          place: params['place'] ? params['place'] : 0,
        };

        this.getExamResults(request);
      });
    });






  }


  public teacher: any = [];

  sortConstant: any = sortConstant;
  orderConstant: any = orderConstant;
  examResultConstant: any = examResultConstant;

  public queryParameters: any = {
    type: 0,
    groupModuleId: 0,
    studentName: ''


  }



  search: any = {
    orderBy: '',
    sortBy: '',
    groupModuleId: 0,
    type: 1,
    studentName: '',
  };

  public groupModules: any = [];




  public examResults: any = [];

  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }

  public config: any = {
    paging: pagingConfig.default,
    baseUrl: systemConfig.baseFileSystemUrl,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS
  }

  pageSize: any = 10;
  pageIndex: any = 1;
  totalPages: any;


  public constant: any = {
    order: orderConstant,
    sort: sortConstant,
  }


 

  public getGroupModules(request: any): void {
    this.groupModuleService.getGroupModuleByExamId(request).subscribe((result: any) => {
      if (result.status) {
        this.groupModules = result.data;
      }
    });
  }


  public getExamResults(request: any): any {
    this.examService.getExamResults(request).subscribe((result: any) => {
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

        this.examResults = result.data.items;

        this.examResults = this.examResults.map((Exam: any) => ({
          ...Exam,
        }));

        if (this.examResults.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

      }
    });
  };


  handleSubmitSearch() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        studentName: this.search.studentName ? this.search.studentName : null,
        groupModuleId: this.search.groupModuleId ? this.search.groupModuleId : null,
        type: this.search.type ? this.search.type : null,

      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }



  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;

      this.route.queryParams.subscribe(params => {
        const request = {
          ...params,
          pageIndex: this.pageIndex,
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: request,
          queryParamsHandling: 'merge',
        });
      });
    }
  }

  onPerPageChange(event: any): void {
    this.pageSize = +event.target.value;

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageSize: this.pageSize,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
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
}
