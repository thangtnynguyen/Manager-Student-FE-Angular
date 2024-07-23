import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/admin/services/apis/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-student',
  templateUrl: './detail-student.component.html',
  styleUrls: ['./detail-student.component.css']
})
export class DetailStudentComponent implements OnInit {
  public student: any = {
    studentId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };

  constructor(private studentService: StudentService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }
      
      this.studentService.getStudentById(request).subscribe((result: any) => {
        this.student = result.data;
      });
    });
  }
}
