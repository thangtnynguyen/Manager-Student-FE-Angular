import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BannerService } from '../../services/apis/banner.service';
import { GroupService } from '../../services/apis/group.service';
import pagingConfig, { DEFAULT_PER_PAGE_OPTIONS } from '../../configs/paging.config';
import orderConstant from '../../constants/orderConstant';
import sortConstant from '../../constants/sortConstant';
import systemConfig from '../../configs/system.config';
import bannerConstant from '../../constants/banner.constant';
import animationConstant from '../../constants/animation.constant';
import groupConstant from '../../constants/group.constant';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  animations: animationConstant.animations
})
export class GroupComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private groupService: GroupService
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
      };

      this.getGroups(request);
    });
  }

  public config: any = {
    paging: pagingConfig.default,
    perPageOptions: DEFAULT_PER_PAGE_OPTIONS
  }

  public constant: any = {
    order: orderConstant,
    sort: sortConstant,
    group: groupConstant
  }

  //Banners
  public groups: any = [];
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

  public getGroups(request: any): any{
    this.groupService.getGroups(request).subscribe((result: any) => {
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

        this.groups = result.data.items;

        this.groups = this.groups.map((banner: any) => ({
          ...banner,
          typeName: this.constant.group.types.find((type: any) => type.key === banner.type)?.value ?? '',
        }));

        if(this.groups.length === 0){
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
      this.selectedBanners = this.groups.map((teacher: any) => teacher.id);
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
        name: this.queryParameters.name ? this.queryParameters.name : null,
        type: this.queryParameters.type ? this.queryParameters.type : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
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
}
