
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
import { RoleService } from 'src/app/admin/services/apis/role.service';
import { PermissionService } from 'src/app/admin/services/apis/permission.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  animations: animationConstant.animations
})
export class RoleComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private modalService: BsModalService,
    private ngxToastr: NgxToastrService,
    private permissionService: PermissionService,

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

      this.getRoles(request);

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

  //roles
  public roles: any = [];
  public permissions: any = [];
  public paging: any = {
    pageIndex: 0,
    pageSize: 0,
    sortBy: '',
    orderBy: '',
    totalPages: 0,
    totalRecords: 0
  }
  public selectedroles: any = [];

  public selectedpermissions: any = [];

  public queryParameters: any = {
    ...this.config.paging,
    place: 0,
    type: 0
  };



  public getRoles(request: any): any {
    this.roleService.getRoles(request).subscribe((result: any) => {
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

        this.roles = result.data.items;

        this.roles = this.roles.map((role: any) => ({
          ...role,
        }));

        if (this.roles.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedroles = [];
      }
    });
  };

  public selectAllroles(event: any): void {
    if (event.target.checked) {
      this.selectedroles = this.roles.map((teacher: any) => teacher.id);
    } else {
      this.selectedroles = [];
    }
  }


  public isSelected(id: number): boolean {
    return this.selectedroles.includes(id);
  }
  toggleSelection(id: number): void {
    if (this.isSelected(id)) {
      this.selectedroles = this.selectedroles.filter((id: number) => id !== id);
    } else {
      this.selectedroles.push(id);
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
      this.selectedroles = this.selectedroles.filter((id: any) => id !== id);
    } else {
      this.selectedroles.push(id);
    }
  }



  public handleSearchRoles() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        name: this.queryParameters.name ? this.queryParameters.name : null,
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
      title: `Bạn có chắc muốn xoá role có Id ${id}?`,
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

        this.roleService.deleteRole(request).subscribe((result: any) => {
          if (result.status) {
            swalWithBootstrapButtons.fire({
              title: "Xoá thành công!",
              text: `Bản ghi role có Id ${id} đã bị xoá!`,
              icon: "success"
            });

            this.route.queryParams.subscribe(params => {
              const request = {
                ...params,
                pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
                pageSize: params['pageSize'] ? params['pageSize'] : this.config.paging.pageSize,
              };

              this.getRoles(request);
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
      title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedroles.join(', ')} không?`,
      text: "Sau khi xoá bản sẽ không thể khôi phục dữ liệu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Bỏ qua",
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          ids: this.selectedroles
        }

        this.roleService.deleteMultipleRole(request).subscribe((result: any) => {
          if (result.status) {
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

              this.getRoles(request);
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

  //Add role
  public role: any = {
    title: '',
    description: '',
    permissions:[],
  };

  public validaterole: any = {
    touchPlace: false,
    touchType: false,
    touchPriority: false
  }

  public validateForm(): boolean {
    return Object.values(this.validaterole).some(value => value === false || value === null || value === undefined);
  }

  public createRoleModalRef?: BsModalRef;
  @ViewChild('createRoleTemplate') createRoleTemplate!: TemplateRef<any>;

  public handleOpenCreateroleModal(): void {
    this.createRoleModalRef = this.modalService.show(this.createRoleTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.createRoleModalRef.onHidden?.subscribe(() => {
      this.role = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: params['pageIndex'] ? params['pageIndex'] : this.config.paging.pageIndex,
        pageSize: params['pageSize'] ? params['pageSize'] : 1000,
      };

      this.queryParameters = {
        ...params,
        type: params['type'] ? params['type'] : 0,
        place: params['place'] ? params['place'] : 0,
      };

      this.getPermissions(request);
    });

  }



  public handleOnSubmitCreateRole(): void {
    const formData = {
      name: this.role.name,
      description: this.role.description,
      permissionIds: this.selectedpermissions || [] 
    };

    this.roleService.createRole(formData).subscribe((result: any) => {
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

          this.getRoles(request);
          this.createRoleModalRef?.hide();
        });
        // this.router.navigate(['/admin/role']);
      }
    }, error => {
      console.log(error);
      this.ngxToastr.error(error.error.message, '', {
        progressBar: true
      });
    });
  }

  //edit
  public editRoleModalRef?: BsModalRef;
  @ViewChild('editRoleTemplate') editRoleTemplate!: TemplateRef<any>;

  public handleOpenEditroleModal(role: any): void {
    this.role = role;
    this.editRoleModalRef = this.modalService.show(this.editRoleTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.editRoleModalRef.onHidden?.subscribe(() => {
      this.role = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
  }

  public handleOnSubmitEditRole(): void {
    const formData = {
      name: this.role.name,
      description: this.role.description,
      permissionIds: this.selectedpermissions || [] 
    };

    this.roleService.editRole(formData).subscribe((result: any) => {
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

          this.getRoles(request);
          this.editRoleModalRef?.hide();
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
    if (!this.role.expired) {
      return true;
    }

    const currentDate = new Date();
    const expiredDate = new Date(this.role.expired);

    return expiredDate > currentDate;
  }

  //Detail role
  public detailRoleModalRef?: BsModalRef;
  @ViewChild('detailRoleTemplate') detailRoleTemplate!: TemplateRef<any>;

  public handleOpenDetailRoleModal(role: any): void {
    this.role = role;

    this.detailRoleModalRef = this.modalService.show(this.detailRoleTemplate,
      Object.assign({}, { class: 'modal-dialog modal-lg modal-dialog-scrollable' }));

    this.detailRoleModalRef.onHidden?.subscribe(() => {
      this.role = {
        place: 0,
        type: 0,
        isBlank: true
      };
    });
  }



  // lấy quyền
  public getPermissions(request: any): any {
    this.permissionService.getPermissions(request).subscribe((result: any) => {
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

        this.permissions = result.data.items;
        this.buildParentMap(this.permissions);

        console.log(result.data.items)
        // console.log(this.findAncestorsById(9))

        this.permissions = this.permissions.map((permission: any) => ({
          ...permission,
        }));

        if (this.permissions.length === 0) {
          this.paging.pageIndex = 1;
        }

        const { items, ...paging } = result.data;
        this.paging = paging;

        this.selectedpermissions = [];
      }
    });
  };


  //lấy id của per cha từ id per con
  private parentMap = new Map<number, number>(); 

  //  map
  private buildParentMap(permissions: any[]) {
    const addPermissionToMap = (permission: any) => {
      if (permission.parentPermissionId !== null) {
        this.parentMap.set(permission.id, permission.parentPermissionId);
      }
      permission.children.forEach((child: any) => addPermissionToMap(child));
    };

    permissions.forEach(permission => addPermissionToMap(permission));
  }


  //   tìm parentPermissionId bằng id
  public findAncestorsById(id: number): number[] {
    const ancestors: number[] = [];
    let currentId = id;

    while (this.parentMap.has(currentId)) {
      const parentId = this.parentMap.get(currentId);
      if (parentId !== undefined) {
        ancestors.push(parentId);
        currentId = parentId;
      } else {
        break;
      }
    }

    return ancestors;
  }





  //chọn quyền
  public isSelectedPer(id: number): boolean {
    return this.selectedpermissions.includes(id);
  }







  public onCheckboxChange(item: any, isChecked: boolean): void {
    if (isChecked) {

      this.addPermissionAndAncestors(item.id);
      console.log(this.selectedpermissions)

    } else {

      this.removePermissionAndReevaluateAncestors(item.id);
      console.log(this.selectedpermissions)

    }
    this.updatePermissionSelectedState();

  }

  private addPermissionAndAncestors(permissionId: number): void {
    if (!this.selectedpermissions.includes(permissionId)) {
      this.selectedpermissions.push(permissionId);
    }

    const ancestors = this.findAncestorsById(permissionId);
    ancestors.forEach(ancestorId => {
      if (!this.selectedpermissions.includes(ancestorId)) {
        this.selectedpermissions.push(ancestorId);
      }
    });
  }

  private removePermissionAndReevaluateAncestors(permissionId: number): void {
    const index = this.selectedpermissions.indexOf(permissionId);
    if (index > -1) {
      this.selectedpermissions.splice(index, 1);
    }
  
    const ancestors = this.findAncestorsById(permissionId);
    ancestors.forEach(ancestorId => {
      if (!this.doesAncestorHaveSelectedChildren(ancestorId)) {
        const ancestorIndex = this.selectedpermissions.indexOf(ancestorId);
        if (ancestorIndex > -1) {
          this.selectedpermissions.splice(ancestorIndex, 1);
        }
      }
    });
  }
  
  private doesAncestorHaveSelectedChildren(ancestorId: number): boolean {
    const ancestorPermission = this.findPermissionById(ancestorId);
    if (!ancestorPermission) {
      return false;
    }
  
    let hasSelectedChildren = false;
    const checkChildren = (permission: any) => {
      if (this.selectedpermissions.includes(permission.id)) {
        hasSelectedChildren = true;
      }
      permission.children.forEach((child: any) => checkChildren(child));
    };
  
    checkChildren(ancestorPermission);
    return hasSelectedChildren;
  }

  public findPermissionById(id: number): any {
    const findRecursive = (permissions: any[]): any => {
      for (const permission of permissions) {
        if (permission.id === id) {
          return permission;
        }
        if (permission.children && permission.children.length > 0) {
          const foundChild = findRecursive(permission.children);
          if (foundChild) {
            return foundChild;
          }
        }
      }
      return null; 
    };

    return findRecursive(this.permissions);
  }

  private updatePermissionSelectedState(): void {
    const updateStateRecursive = (permissions: any[]) => {
      permissions.forEach(permission => {
        permission.selected = this.selectedpermissions.includes(permission.id);
        if (permission.children && permission.children.length > 0) {
          updateStateRecursive(permission.children);
        }
      });
    };
  
    updateStateRecursive(this.permissions);
  }


}







