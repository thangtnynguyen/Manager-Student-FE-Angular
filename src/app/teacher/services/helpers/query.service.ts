import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  public pagingWithQuery(objects: any, data: any): void{
    objects = data;
  }
}
