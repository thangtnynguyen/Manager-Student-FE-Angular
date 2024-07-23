import { Component, OnInit } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/admin/services/apis/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent  implements OnInit{
  public student: any = {
    studentId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };

  constructor(private ngxToastr: NgxToastrService,private studentService: StudentService,private router:Router) { }

  ngOnInit() {
    
  }

  onSubmit(){
    this.studentService.createStudents(this.student).subscribe((result: any) => {
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

  validVerificationType(): number {
    if (this.student.verificationType === 2) {
        if (!this.student.email) {
            return -1;
        } else {
            return 1;
        }
    } else {
      if (!this.student.phone) {
        return -2;
      } else {
        return 1;
      }
    }
  }
}
