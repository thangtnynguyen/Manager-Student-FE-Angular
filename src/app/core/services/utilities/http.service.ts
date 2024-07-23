import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Header } from '../../enums/request.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  addSkipLoadingHeader(headers?: HttpHeaders): HttpHeaders {
    if (!headers) {
      headers = new HttpHeaders();
    }
    return headers.set(Header.SkipLoading, 'true');
  }
}
