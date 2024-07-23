import { Component, OnInit } from '@angular/core';
import { BASE_URL_API } from 'src/app/shared/constants/app.constant';
import { HomeService } from 'src/app/student/services/api/home.service';

@Component({
  selector: 'app-pro-course-list',
  templateUrl: './pro-course-list.component.html',
  styleUrls: ['./pro-course-list.component.css']
})
export class ProCourseListComponent implements OnInit {
  public pages: any;
  public baseUrlApi: string;

  constructor(private homeService: HomeService) { 
    this.baseUrlApi = BASE_URL_API;
  }

  ngOnInit() {
    this.homeService.getPageFeaturesHome().subscribe((result: any) => {
      if(result.status){
        this.pages = result.data;
      }
    });
  }
}
