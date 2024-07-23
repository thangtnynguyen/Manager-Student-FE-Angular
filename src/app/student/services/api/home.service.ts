import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpPublicService } from 'src/app/shared/services/https/http-public.service';

@Injectable({
  providedIn: 'root', 
})
export class HomeService {
  constructor(private http: HttpPublicService) {
  }

  getBannersHome(request: any): Observable<any> {
    return this.http.get(`home/get-banners?place=${request.Place}&type=${request.Type}`);
  }

  getCoursesHome(): Observable<any> {
    return this.http.get(`home/get-courses`);
  }

  getPostsHome(): Observable<any> {
    return this.http.get(`home/get-posts`);
  }

  getPageFeaturesHome(): Observable<any> {
    return this.http.get(`home/get-feature-pages`);
  }

  getVideosHome(): Observable<any> {
    return this.http.get(`home/get-videos`);
  }
}
