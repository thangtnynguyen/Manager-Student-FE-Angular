import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { HomeService } from 'src/app/student/services/api/home.service';
import { PLACE_HOME ,TYPE_SLIDESHOW, DEFAULT_PROPERTIES_BANNER } from 'src/app/student/constants/banner.constant';
import { BASE_URL_API } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SlideShowComponent implements OnInit {
  public banners: any;
  public baseUrlApi: string;

  constructor(private homeService: HomeService) { 
    this.baseUrlApi = BASE_URL_API;
  }

  public slideConfig = {
    itemsPerSlide: 1,
    singleSlideOffset: false,
    noWrap: false,
    cycleInterval: 5000,
    startIndex: 0,
  };

  ngOnInit() {
    const requestGetBannerHome = {
      Place: PLACE_HOME,
      Type: TYPE_SLIDESHOW
    }

    this.homeService.getBannersHome(requestGetBannerHome).subscribe((result: any) => {
      const convertResult = result.data.map((item:any) =>{
        try {
          if (item.properties) {
            item.properties = JSON.parse(item.properties);
          }else{
            item.properties = DEFAULT_PROPERTIES_BANNER;
          }
        } catch (error) {
          item.properties = DEFAULT_PROPERTIES_BANNER;
        }
        return item;
      });
      this.banners = convertResult;
    });
  }
}
