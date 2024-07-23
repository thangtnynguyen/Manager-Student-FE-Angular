import { Component, OnInit } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/admin/services/apis/student.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  public student: any = {
    studentId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };

  constructor(private ngxToastr: NgxToastrService,private studentService: StudentService,private router:Router, private route: ActivatedRoute) { }

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

  onSubmit(){
    this.studentService.editStudent(this.student).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.router.navigate(['/admin/student']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }
}
