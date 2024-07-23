// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-detail-question',
//   templateUrl: './detail-question.component.html',
//   styleUrls: ['./detail-question.component.css']
// })
// export class DetailQuestionComponent {

// }

import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { QuestionService } from 'src/app/admin/services/apis/question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import questionConstant from 'src/app/admin/constants/question.constant';

@Component({
  selector: 'app-detail-question',
  templateUrl: './detail-question.component.html',
  styleUrls: ['./detail-question.component.css']
})
export class DetailQuestionComponent  implements OnInit{
  public question: any = {
    questionId: '',
    type: 1,
    title: '',
    questionAnswers: [],
    questionCategoryId: 1,
    questionTags: []
  };

  constructor(private questionService: QuestionService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }
      
      this.questionService.getQuestionById(request).subscribe((result: any) => {
        this.question = result.data;

        this.question.difficultyName = questionConstant.difficulties.find(item => item.key === this.question.difficulty)?.value;

        this.question.tags = result.data.questionTags.map((tagInfo: any) => tagInfo.tag);
      });
    });

  }

  handleConvert(index:any){
    return String.fromCharCode(65+index);
  }

  getMaxScoreQuestionAnswers(){
    return Math.max(...this.question.questionAnswers.map((item: any)=> item.score));
  }
}

