import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/admin/services/apis/post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css']
})
export class DetailPostComponent  implements OnInit{
  public post: any = {
    postId: '',
    name: '',
    email: '',
    phone: '',
    verificationType: 2,
    status: true,
  };
  constructor(private postService: PostService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const request = {
        id: params.get('id')
      }
      
      this.postService.getPostById(request).subscribe((result: any) => {
        this.post = result.data;
      });
    });
  }
}
