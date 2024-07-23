import { Component, OnInit } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { TeacherService } from 'src/app/admin/services/apis/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-teacher',
  templateUrl: './detail-teacher.component.html',
  styleUrls: ['./detail-teacher.component.css']
})
export class DetailTeacherComponent implements OnInit {
  //Data
  public teacher: any = {
    teacherId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };

  constructor(private teacherService: TeacherService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }
      
      this.teacherService.getTeacherById(request).subscribe((result: any) => {
        this.teacher = result.data;
      });
    });
  }
}
