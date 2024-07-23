import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import layoutConfig from 'src/app/teacher/configs/layout.config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isAuthPage: boolean = false;
  isAdminPage: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    const currentUrl = this.router.url;
    const pageKey = currentUrl.split('/')[2];
    if (pageKey === layoutConfig.authKeyLayout){
      this.isAuthPage = true;
    }

    if(pageKey !== layoutConfig.authKeyLayout){
      this.isAdminPage = true;
    }
  }
}
