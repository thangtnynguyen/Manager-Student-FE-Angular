import { Component, OnInit } from '@angular/core';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';
import { DEFAULT_PER_PAGE_OPTIONS, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'src/app/admin/configs/paging.config';
import sortConstant from 'src/app/admin/constants/sortConstant';
import orderConstant from 'src/app/admin/constants/orderConstant';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { trigger, state, style, animate, transition } from '@angular/animations';
import animationConstant from 'src/app/admin/constants/animation.constant';

@Component({
  selector: 'app-list-teacher',
  templateUrl: './list-teacher.component.html',
  styleUrls: ['./list-teacher.component.css'],
  animations: animationConstant.animations
})
export class ListTeacherComponent implements OnInit {
  //Constant
  public sortConstant: any = sortConstant;
  public orderConstant: any = orderConstant;
  //Config
  public config: { [key: string]: any, perPageOptions: any[]  } = { perPageOptions: DEFAULT_PER_PAGE_OPTIONS };
  //Data
  public teachers: any[] = [];
  //Selection
  public selectedItems: number[] = [];
  public selectedSortAndOrder: any = {
    orderBy: "",
    sortBy: ""
  };
  //Paging
  public currentPage: any;
  public pageSize: any = 10;
  public pageIndex: any;
  public totalPages: any;
  public totalRecords: any;
  public search: any = {
    nameOrEmail: '',
    phoneNumber: '',
    status: ''
  };

  constructor(private teacherService: TeacherService,private route: ActivatedRoute, private router: Router, private ngxToastr: NgxToastrService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
        pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
      };

      this.getTeachers(request);
    });
  }

  getTeachers(request: any) {
    this.teacherService.getTeachers(request).subscribe((result: any) => {
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

        this.teachers = result.data.items;
        this.totalPages = result.data.totalPages;
        this.currentPage = result.data.pageIndex;
        this.totalRecords = result.data.totalRecords;
        this.pageSize = result.data.pageSize;
        this.selectedItems = [];
        
        if(this.teachers.length === 0){
          this.pageIndex = 1;
        }
      }
    });
  }

  selectAllTeachers(event: any): void{
    if (event.target.checked) {
      this.selectedItems = this.teachers.map((teacher: any) => teacher.id);
    } else {
      this.selectedItems = [];
    }
  }

  isSelected(teacherId: number): boolean {
    return this.selectedItems.includes(teacherId);
  }

  toggleSelection(teacherId: number): void {
    if (this.isSelected(teacherId)) {
        this.selectedItems = this.selectedItems.filter((id) => id !== teacherId);
    } else {
        this.selectedItems.push(teacherId);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      this.route.queryParams.subscribe(params => {
        const request = {
          ...params,
          pageIndex: this.currentPage,
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: request,
          queryParamsHandling: 'merge',
        });
      });
    }
  }

  onPerPageChange(event: any) {
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

  onSortAndOrderChange(orderBy: string) {
    if(this.selectedSortAndOrder.orderBy === orderBy){
      this.selectedSortAndOrder.sortBy = this.selectedSortAndOrder.sortBy === sortConstant.asc ? sortConstant.desc: sortConstant.asc;
    }else{
      this.selectedSortAndOrder.sortBy = sortConstant.desc;
    }

    this.selectedSortAndOrder = {
      orderBy: orderBy,
      sortBy: this.selectedSortAndOrder.sortBy
    };

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        orderBy: this.selectedSortAndOrder.orderBy,
        sortBy: this.selectedSortAndOrder.sortBy,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  onSearchChange(){
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        nameOrEmail: this.search.nameOrEmail ? this.search.nameOrEmail : null,
        phoneNumber: this.search.phoneNumber ? this.search.phoneNumber : null,
        status: this.search.status ? this.search.status : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  handleDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá giáo viên có Id ${id}?`,
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

        this.teacherService.deleteTeacher(request).subscribe((result: any) => {
          if(result.status){
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi giáo viên có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
                pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
              };
        
              this.getTeachers(request);
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

  handleOnDeleteMultiple(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedItems.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedItems
        }

        this.teacherService.deleteMultipleTeacher(request).subscribe((result: any) => {
          if(result.status){
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: result.message,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
                pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
              };
        
              this.getTeachers(request);
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
