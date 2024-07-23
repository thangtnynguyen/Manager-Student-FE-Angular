import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { Page } from 'src/app/core/enums/page.enum';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  page = Page;

  constructor(private router: Router) { }

  backToDashboard(){
    this.router.navigate([Page.Dashboard]);
  }
}
