import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import layoutConfig from 'src/app/admin/configs/layout.config';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
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
