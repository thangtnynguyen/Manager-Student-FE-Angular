import { Component, Input, OnInit } from '@angular/core';
import { Breadcrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
  public breadcrumbTitle: string = '';

  ngOnInit(): void {
    this.updateTitleBreadcrumb();
  }

  private updateTitleBreadcrumb(): void {
    const titleBreadcrumb = this.breadcrumbs.find(breadcrumb => breadcrumb.isTitle === true);
    this.breadcrumbTitle = titleBreadcrumb ? titleBreadcrumb.label : '';
  }
}
