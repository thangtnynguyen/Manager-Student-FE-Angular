import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EndsWithHtmlGuard } from 'src/app/student/shared/guards/endsWithHtml.guard';
import { HomeService } from 'src/app/student/services/api/home.service';
import { BASE_URL_API } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent {
  public id: any;
  public posts: any;
  public post: any;
  public baseUrlApi: string;

  constructor(private route: ActivatedRoute, private homeService: HomeService) {
    this.route.params.subscribe(params => {
      console.log(params)
      this.id = params['id']
      console.log(this.id)
      this.homeService.getPostsHome().subscribe((result: any) => {
        if(result.status){
          this.posts = result.data;
          this.post = result.data.find((post: any) => +post.id === +params['id']);
        }
      });
    })

    this.baseUrlApi = BASE_URL_API;
  }
}
