import { Component, OnInit } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/admin/services/apis/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent  implements OnInit{

  public post: any = {
    id: '',
    title: '',
    description: '',
    image: '',
    imageFile: null,
    content: '',
    priority:0,
    isPublished: true,
  };
  constructor(private ngxToastr: NgxToastrService,private postService: PostService,private router:Router) { }
  ngOnInit() {
    
  }
  onSubmit(){

     const formData = new FormData();

    // Thêm các trường dữ liệu vào FormData
    formData.append('title', this.post.title);
    formData.append('description', this.post.description);
    formData.append('imageFile', this.post.imageFile); // Đây là file, chắc chắn rằng bạn có đối tượng File thích hợp ở đây.
    formData.append('content', this.post.content);
    formData.append('priority', this.post.priority);
    formData.append('isPublished', this.post.isPublished);



    this.postService.createPosts(formData).subscribe((result: any) => {
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
