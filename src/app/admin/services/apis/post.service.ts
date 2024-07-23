import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpPostLoadingService } from 'src/app/shared/services/https/http-post-loading.service';
import { HttpPostNotLoadingService } from 'src/app/shared/services/https/http-post-not-loading.service';


import { HttpClient } from '@angular/common/http';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { ApiResult } from 'src/app/core/models/interfaces/common/api-result.interface';



@Injectable({
  providedIn: 'root'
})
export class PostService {

  private adminApiPrefix = PrefixApi.admin;

  constructor(private http: HttpClient) { }

  getPosts(request: any = null): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/post/get`, request);
  }
  getPostsApprove(request: any = null): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/post/get-approve`, request);
  }

  createPosts(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/create`, request);
  }

  getPostById(request: any): Observable<any> {
    return this.http.get(`post/get-by-id?id=${request.id}`,{});
  }

  editPost(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/edit`, request);
  }
  approvePost(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/approve`, request);
  }
  approveMultiplePost(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/approve-multiple`, request);
  }
  deletePost(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/delete`, request);
  }

  deleteMultiplePost(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/post/delete-multiple`, request);
  }



  // constructor(private http: HttpPostLoadingService) { }

  // getPosts(request: any = null): Observable<any> {
  //   return this.http.get('post/get', request);
  // }
  // getPostsApprove(request: any = null): Observable<any> {
  //   return this.http.get('post/get-approve', request);
  // }

  // createPosts(request: any): Observable<any> {
  //   return this.http.postWithFormData('post/create', request);
  // }

  // getPostById(request: any): Observable<any> {
  //   return this.http.get(`post/get-by-id?id=${request.id}`,{});
  // }

  // editPost(request: any): Observable<any> {
  //   return this.http.post('post/edit', request);
  // }
  // approvePost(request: any): Observable<any> {
  //   return this.http.post('post/approve', request);
  // }
  // approveMultiplePost(request: any): Observable<any> {
  //   return this.http.post('post/approve-multiple', request);
  // }
  // deletePost(request: any): Observable<any> {
  //   return this.http.post('post/delete', request);
  // }

  // deleteMultiplePost(request: any): Observable<any> {
  //   return this.http.post('post/delete-multiple', request);
  // }
}
