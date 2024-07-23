import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/student/services/api/home.service';
import { BASE_URL_API } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-free-course-list',
  templateUrl: './free-course-list.component.html',
  styleUrls: ['./free-course-list.component.css']
})
export class FreeCourseListComponent implements OnInit {
  public courses: any;
  public totalNumberRegistrations: any;
  public baseUrlApi: string;

  constructor(private homeService: HomeService) { 
    this.baseUrlApi = BASE_URL_API;
  }

  ngOnInit() {
    this.homeService.getCoursesHome().subscribe((result: any) => {
      if(result.status){
        this.courses = result.data;
        this.totalNumberRegistrations = result.data.reduce((total:any, obj:any) => total + obj.numberRegistrations, 0);
      }
    });
  }
}
