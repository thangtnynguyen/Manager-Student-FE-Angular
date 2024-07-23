import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/student/services/api/home.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  public videos: any;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getVideosHome().subscribe((result: any) => {
      this.videos = result.data;
    });
  }

  redirectToVideoUrl(externalUrl: string): void {
    window.open(externalUrl, '_blank');
  }
}
