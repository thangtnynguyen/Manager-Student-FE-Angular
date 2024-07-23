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
import { QuestionService } from '../../services/apis/question.service';
import { StudentService } from '../../services/apis/student.service';
import { CourseService } from '../../services/apis/course.service';
import { PostService } from '../../services/apis/post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  //Init
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private groupService: GroupService,
    private questionService: QuestionService,
    private studentService: StudentService,
    private courseService: CourseService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const request = {
        ...params,
        pageIndex: 1
      };

      this.getQuestions(request);

      this.getStudents(request);

      this.getPosts(request);

      // this.queryParameters = {
      //   ...params,
      //   type: params['type'] ? params['type'] : 0,
      // };

      // this.getGroups(request);
    });
  }

  //Main
  public numberQuestion: any = 0;
  public numberStudent: any = 0;
  public numberPosts: any = 0;

  public getQuestions(request: any): any{
    this.questionService.getQuestions(request).subscribe((result: any) => {
      if(result.status){
        this.numberQuestion = result.data.items.length;
        // console.log(result)
      }
    });
  };

  public getStudents(request: any): any{
    this.studentService.getStudents(request).subscribe((result: any) => {
      if(result.status){
        this.numberStudent = result.data.items.length;
        // console.log(result)
      }
    });
  };

  public getPosts(request: any): any{
    this.postService.getPosts(request).subscribe((result: any) => {
      if(result.status){
        this.numberPosts = result.data.items.length;
        // console.log(result)
      }
    });
  };
}
