// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-group-test-exam',
//   templateUrl: './group-test-exam.component.html',
//   styleUrls: ['./group-test-exam.component.css']
// })
// export class GroupTestExamComponent {

// }


import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import groupModuleConstant from '../../constants/group-module.constant';
import { GroupModuleService } from 'src/app/admin/services/apis/group-module.service';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';

import { AuthService } from 'src/app/core/services/identity/auth.service';
import { UserCurrent } from 'src/app/core/models/interfaces/user/user-current.interface';
@Component({
  selector: 'app-group-test-exam',
  templateUrl: './group-test-exam.component.html',
  styleUrls: ['./group-test-exam.component.css']
})
export class GroupTestExamComponent implements OnInit { 

  userCurrent: UserCurrent;
  constructor(
    private teacherService: TeacherService,
    private groupModuleService: GroupModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    // private ngxToastr: ToastrService
    public authService: AuthService,

  ) { 
    this.userCurrent = this.authService.getUserCurrent() as UserCurrent;

  }

  ngOnInit(){
    this.getTeachers({});

    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        // userId:'D5E5B63A-53A1-4F88-A399-1F7C7F4B08A7'//dữ liệu mẫu,thì mới có dữ liệu
        userId:this.userCurrent.id,
      };

      this.queryParameters = {
        ...params,
        userId: params['userId'] ? params['userId'] : 0,

      };

      this.getGroupModules(request);
      console.log(this.userCurrent.id);
    });

    
  }

  public constant: any = {
    groupModule: groupModuleConstant
  }

  //Prepare
  public teachers: any = [];

  public getTeachers(request: any): void{
    this.teacherService.getTeachers(request).subscribe((result: any) => {
      if(result.status){
        this.teachers = result.data.items;
      }
    });
  }

  public getGroupModules(request: any): void{
    this.groupModuleService.getGroupModuleByUser(request).subscribe((result: any) => {
      if(result.status){
        this.groupModules = result.data;
        console.log(result.data)
      }
    });

  }

  public getCurrentYear(): number {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
  
    var currentYear = currentMonth < 6 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  
    return currentYear;
  }

  public getCurrentSemester() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; 

    var currentSemester = currentMonth < 6 ? 2 : 1;
  
    return currentSemester;
  }

  //Group modules
  public groupModules: any = [];

  public queryParameters: any = {
    status: 0,
    semester: 0,
    teacherId: 0,
    name: '',
    year: ''
  }


  public handleSearchGroupModule(): void{
    this.route.queryParams.subscribe(params => {

      const request = {
        ...params,
        semester: this.queryParameters.semester ? this.queryParameters.semester : null,
        status: this.queryParameters.status ? (this.queryParameters.status === 0 ? null : this.queryParameters.status  ) : null,
        year: this.queryParameters.year ? this.queryParameters.year : null,
        teacherId: this.queryParameters.teacherId ? this.queryParameters.teacherId : null,
        name: this.queryParameters.name ? this.queryParameters.name : null,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: request,
        queryParamsHandling: 'merge',
      });
    });
  }






  public validateGroupModule: any = {
    touchSemester: false,
  }

  public validateForm(): boolean {
    return Object.values(this.validateGroupModule).some(value => value === false || value === null || value === undefined);
  }

  
  
 
  
  

  
}
