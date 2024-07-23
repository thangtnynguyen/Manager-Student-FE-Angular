import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Header } from '../../enums/request.enum';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor() { }

  convertToFormData(obj: any): FormData {
    const formData = new FormData();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key]);
        }
    }
    
    return formData;
    }
}
