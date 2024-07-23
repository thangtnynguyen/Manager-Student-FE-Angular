import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/admin/services/apis/post.service';
import { DEFAULT_PER_PAGE_OPTIONS, DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from 'src/app/admin/configs/paging.config';
import sortConstant from 'src/app/admin/constants/sortConstant';
import orderConstant from 'src/app/admin/constants/orderConstant';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({
        opacity: 0,
        height: '0',
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        height: '100%',
        display: 'flex'
      })),
      transition('hidden => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('300ms ease-in'))
    ]),
  ],
})

export class ListPostComponent implements OnInit {
  public sortConstant: any = sortConstant;
  public orderConstant: any = orderConstant;
  //Config
  public config: { [key: string]: any, perPageOptions: any[] } = { perPageOptions: DEFAULT_PER_PAGE_OPTIONS };
  //Data
  public posts: any[] = [];
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
    title: '',
    description: '',
    status: ''
  };

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router, private ngxToastr: NgxToastrService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
        pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
      };

      this.getPosts(request);
      
    });
  }
  getPosts(request: any) {
    this.postService.getPosts(request).subscribe((result: any) => {
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

        this.posts = result.data.items;
        this.totalPages = result.data.totalPages;
        this.currentPage = result.data.pageIndex;
        this.totalRecords = result.data.totalRecords;
        this.pageSize = result.data.pageSize;
        this.selectedItems = [];
        console.log(this.posts)
        if(this.posts.length === 0){
          this.pageIndex = 1;
        }
      }
    });
  }
  selectAllPosts(event: any): void {
    if (event.target.checked) {
      this.selectedItems = this.posts.map((post: any) => post.id);
    } else {
      this.selectedItems = [];
    }
    // console.log('sddd')
  }

  isSelected(postId: number): boolean {
    return this.selectedItems.includes(postId);
  }

  toggleSelection(postId: number): void {
    if (this.isSelected(postId)) {
      this.selectedItems = this.selectedItems.filter((id) => id !== postId);
    } else {
      this.selectedItems.push(postId);
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
    if (this.selectedSortAndOrder.orderBy === orderBy) {
      this.selectedSortAndOrder.sortBy = this.selectedSortAndOrder.sortBy === sortConstant.asc ? sortConstant.desc : sortConstant.asc;
    } else {
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

  onSearchChange() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        title: this.search.title ? this.search.title : null,
        description: this.search.description ? this.search.description : null,
        status: this.search.status ? this.search.status : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }

  handleDelete(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Bạn có chắc muốn xoá bài viết có Id ${id}?`,
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

        this.postService.deletePost(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi bài viết có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : DEFAULT_PAGE_INDEX,
                pageSize: params['pageSize'] ? params['pageSize'] : DEFAULT_PAGE_SIZE,
              };

              this.getPosts(request);
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

  handleOnDeleteMultiple() {
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

        this.postService.deleteMultiplePost(request).subscribe((result: any) => {
          if (result.status) {
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

              this.getPosts(request);
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
}
