import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { QuestionService } from 'src/app/admin/services/apis/question.service';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngxToastr: NgxToastrService,
    private questionService: QuestionService
  ) { }


  public importExcelForm: any = {
    file: null,
  }
  
  public onFileSelected(event: any):void{
    this.importExcelForm.file = event.target.files[0];
  }





  public handleImportQuestionGroupModule(): void{
    this.route.params.subscribe(params => {

      const formData = new FormData();

      formData.append('file', this.importExcelForm.file);


    this.questionService.importQuestionsExcel(formData).subscribe((result: any) => {
      if (result.status) {
        this.ngxToastr.success('Import câu hỏi thành công','',{
          progressBar: true
        });

        this.router.navigate(['/question']);

       
      } 
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
    });
  }

}
