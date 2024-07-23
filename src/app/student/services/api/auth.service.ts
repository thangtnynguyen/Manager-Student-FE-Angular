import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpGuesLoadingService } from 'src/app/shared/services/https/http-guest-loading.service';
import { HttpGuestNotLoadingService } from 'src/app/shared/services/https/http-guest-not-loading.service';
import { HttpNotLoadingService } from 'src/app/shared/services/https/http-not-loading.service';
import { HttpStudentLoadingService } from 'src/app/shared/services/https/http-student-loading.service';
import { HttpStudentNotLoadingService } from 'src/app/shared/services/https/http-student-not-loading.service';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public isAuthenticated: any = null;
	public userData: any = null;
	private changeAuthEvent = new BehaviorSubject<boolean>(false);

	constructor(private httpLoading: HttpGuesLoadingService, private http: HttpGuestNotLoadingService, private httpStudentNotLoading: HttpStudentNotLoadingService, private httpNotLoadingService: HttpNotLoadingService, private httpss: HttpTeacherLoadingService) {
		// const user = JSON.parse(localStorage.getItem('user') || '{}');
		// if(user?.token){
		//   this.getUserInfo().subscribe(res => {
		//     if(res.status){
		//       this.setAuthData(res.data);
		//     }
		//   })
		// }else{
		//   this.removeAuthData();
		// }
	}

	getAuth(): void {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		if (user?.token) {
			this.httpNotLoadingService.get('user/user-info', {}).subscribe(res => {
				if (res.status) {
					this.setAuthData(res.data);
					this.emitChangeAuthEvent(true);
				}
			})
		} else {
			this.removeAuthData();
		}
	}

	setAuthData(data: any): void {
		this.isAuthenticated = true;
		this.userData = data;
		this.emitChangeAuthEvent(true);
	}

	removeAuthData(): void {
		this.isAuthenticated = false;
		this.userData = null;
	}

	logout(): void {
		//Chưa xong, handle call api huỷ token
		// this.httpLoading.post(`auth/logout`, {});

		localStorage.removeItem('user');
		this.isAuthenticated = false;
		this.userData = null;
	}

	getUserInfo(): Observable<any> {
		return this.http.get('user/user-info', {});
	}

	getStudentInfo(request: any): Observable<any> {
		return this.httpss.get('auth/get-student-user-id', request);
	}

	getOtpLoginPhone(phone: string): Observable<any> {
		const encodedPhone = encodeURIComponent(phone);
		return this.httpNotLoadingService.post(`auth/send-otp-login-numberphone?numberphone=${encodedPhone}`, {});
	}

	getOtpRegisterPhone(request: any): Observable<any> {
		return this.http.post(`auth/send-otp-login-numberphone`, request);
	}

	loginPhone(request: any): Observable<any> {
		return this.httpLoading.post(`auth/login-by-verify-otp-numberphone`, request);
	}

	loginEmail(request: any): Observable<any> {
		return this.httpLoading.post(`auth/login-by-email`, request);
	}

	loginUserName(request: any): Observable<any> {
		return this.httpLoading.post(`auth/login`, request);
	}

	getOtpLoginEmail(request: any): Observable<any> {
		return this.httpLoading.post(`auth/send-otp-login-email`, request);
	}

	verifyOtpLoginEmail(request: any): Observable<any> {
		return this.httpLoading.post(`auth/login-by-verify-otp-email`, request);
	}

	public hasPermisson(permisson: string): boolean {
		if (!this.userData) {
			return false;
		}

		if (this.userData.permissions.includes(permisson)) {
			return true;
		} else {
			return false;
		}
	}

	emitChangeAuthEvent(status: boolean): void {
		this.changeAuthEvent.next(status);
	}

	getChangeAuthEvent(): Observable<boolean> {
		return this.changeAuthEvent.asObservable();
	}
}
