import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingUiService } from '../../components/loading-ui/loading-ui.service';
import loadingUiConstant from '../../components/loading-ui/loading-ui.constant';

@Injectable({
  providedIn: 'root',
})
export class HttpGuesLoadingService {
  private baseUrl: string = environment.host.apiGuestBaseUrl;

  constructor(
    private http: HttpClient,
    private loadingUi: LoadingUiService,
  ) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getToken(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  }

  get(endpoint: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(error);
      })
    );
  }
  getN(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders();
    const queryParams = this.buildQueryParams(data);
    this.loadingUi.show(loadingUiConstant.type.dualRing);

    return this.http.get(`${this.baseUrl}/${endpoint}${queryParams ? `?${queryParams}` : ''}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingUi.hide();
      })
    );
  }
  buildQueryParams(data: any): string {
    if (data) {
      const params = new URLSearchParams();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          params.set(key, data[key]);
        }
      }
      return params.toString();
    }
    return '';
  }
  post(endpoint: string, data: any): Observable<any> {
    this.loadingUi.show(loadingUiConstant.type.dualRing);
    const headers = this.createHeaders();
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingUi.hide();
      })
    );
  }

  put(endpoint: string, data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(error);
      })
    );
  }

  delete(endpoint: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(error);
      })
    );
  }

  private createHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  handleErrorResponse(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
  }
}
