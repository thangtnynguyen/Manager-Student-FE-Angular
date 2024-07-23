import { Component, OnInit } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/admin/services/apis/post.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  public post: any = {
    id: '',
    title: '',
    description: '',
    image: '',
    imageFile: null,
    content: '',
    priority:0,
    isPublished: true,
    isApproved: null,
  };
  constructor(private ngxToastr: NgxToastrService,private postService: PostService,private router:Router, private route: ActivatedRoute) { }
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

  onSubmit(){
    this.postService.editPost(this.post).subscribe((result: any) => {
      if(result.status){
        this.ngxToastr.success(result.message,'',{
          progressBar: true
        });
        this.router.navigate(['/admin/post']);
      }
    },error => {
      console.log(error);
      this.ngxToastr.error(error.error.message,'',{
        progressBar: true
      });
    });
  }
  onFileSelected(event: any) {
    this.post.imageFile = event.target.files[0];
  }

  
}
