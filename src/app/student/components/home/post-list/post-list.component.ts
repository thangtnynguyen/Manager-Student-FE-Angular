import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/student/services/api/home.service';
import { BASE_URL_API } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  public posts: any;
  public baseUrlApi: string;

  constructor(private homeService: HomeService) { 
    this.baseUrlApi = BASE_URL_API;
  }

  ngOnInit() {
    this.homeService.getPostsHome().subscribe((result: any) => {
      if(result.status){
        this.posts = result.data;
      }
    });
  }
}
