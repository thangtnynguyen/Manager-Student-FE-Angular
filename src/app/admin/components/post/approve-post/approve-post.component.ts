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
  selector: 'app-approve-post',
  templateUrl: './approve-post.component.html',
  styleUrls: ['./approve-post.component.css'],
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
export class ApprovePostComponent implements OnInit {


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
    this.postService.getPostsApprove(request).subscribe((result: any) => {
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

        this.posts = result.data.items;
        this.totalPages = result.data.totalPages;
        this.currentPage = result.data.pageIndex;
        this.totalRecords = result.data.totalRecords;
        this.pageSize = result.data.pageSize;
        this.selectedItems = [];

        if (this.posts.length === 0) {
          this.pageIndex = 1;
        }
      }
    });
  }



  handleApprove(id: number, isApproved: boolean) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: `Bạn có chắc muốn ${
          isApproved ? "phê duyệt" : "từ chối"
        } bài viết có Id ${id}?`,
        text: `Bài viết sẽ được đánh dấu là ${
          isApproved ? "đã phê duyệt" : "từ chối"
        }!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Bỏ qua",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const request = {
            id: id,
            isApproved: isApproved,
          };
  
          this.postService.approvePost(request).subscribe(
            (result: any) => {
              if (result.status) {
                swalWithBootstrapButtons.fire({
                  title: `${
                    isApproved ? "Phê duyệt" : "Từ chối"
                  } thành công!`,
                  text: `Bản ghi bài viết có Id ${id} đã được ${
                    isApproved ? "phê duyệt" : "từ chối"
                  }!`,
                  icon: "success",
                });
  
                this.route.queryParams.subscribe((params) => {
                  const request = {
                    ...params,
                    pageIndex: params["pageIndex"]
                      ? params["pageIndex"]
                      : DEFAULT_PAGE_INDEX,
                    pageSize: params["pageSize"]
                      ? params["pageSize"]
                      : DEFAULT_PAGE_SIZE,
                  };
  
                  this.getPosts(request);
                });
              }
            },
            (error) => {
              console.log(error);
              this.ngxToastr.error(error.error.message, "", {
                progressBar: true,
              });
            }
          );
        }
      });
  }
  

  // handleApproveMultiple(isApproved: boolean) {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       cancelButton: "btn btn-danger ml-2",
  //       confirmButton: "btn btn-success",
  //     },
  //     buttonsStyling: false,
  //   });
  
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: `Bạn có chắc muốn ${
  //         isApproved ? "phê duyệt" : "từ chối"
  //       } tất cả các bài viết không?`,
  //       text: `Các bài viết sẽ được đánh dấu là ${
  //         isApproved ? "đã phê duyệt" : "từ chối"
  //       }!`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Xác nhận",
  //       cancelButtonText: "Bỏ qua",
  //       reverseButtons: false,
  //     })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         const request = {
  //           ids: this.selectedItems, // Lấy các ID được chọn
  //           isApproved: isApproved,
  //           // Thêm các trường khác nếu cần thiết
  //         };
  
  //         this.postService.approveMultiplePost(request).subscribe(
  //           (result: any) => {
  //             if (result.status) {
  //               swalWithBootstrapButtons.fire({
  //                 title: `${
  //                   isApproved ? "Phê duyệt" : "Từ chối"
  //                 } thành công!`,
  //                 text: `Các bản ghi bài viết đã được ${
  //                   isApproved ? "phê duyệt" : "từ chối"
  //                 }!`,
  //                 icon: "success",
  //               });
  
  //               this.route.queryParams.subscribe((params) => {
  //                 const request = {
  //                   ...params,
  //                   pageIndex: params["pageIndex"]
  //                     ? params["pageIndex"]
  //                     : DEFAULT_PAGE_INDEX,
  //                   pageSize: params["pageSize"]
  //                     ? params["pageSize"]
  //                     : DEFAULT_PAGE_SIZE,
  //                 };
  
  //                 this.getPosts(request);
  //               });
  //             }
  //           },
  //           (error) => {
  //             console.log(error);
  //             this.ngxToastr.error(error.error.message, "", {
  //               progressBar: true,
  //             });
  //           }
  //         );
  //       }
  //     });
  // }
  


  handleApproveMultiple(isApproved: boolean) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-danger ml-2",
        confirmButton: "btn btn-success",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: `Bạn có chắc muốn ${isApproved ? "phê duyệt" : "từ chối"} các bài viết đã chọn không?`,
        text: `Các bài viết sẽ được đánh dấu là ${isApproved ? "đã phê duyệt" : "từ chối"}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Bỏ qua",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Lấy danh sách id các bài viết đã chọn
          const selectedIds = this.selectedItems.map(item => item);
  
          // Gửi request đến server
          const request = selectedIds.map(id => ({ id, isApproved }));
  
          this.postService.approveMultiplePost(request).subscribe(
            (result: any) => {
              if (result.status) {
                swalWithBootstrapButtons.fire({
                  title: `${isApproved ? "Phê duyệt" : "Từ chối"} thành công!`,
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
            },
            (error) => {
              console.log(error);
              this.ngxToastr.error(error.error.message, "", {
                progressBar: true,
              });
            }
          );
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

}
