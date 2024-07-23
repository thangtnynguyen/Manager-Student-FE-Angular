import { Component } from '@angular/core';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-auth-facebook',
  templateUrl: './auth-facebook.component.html',
  styleUrls: ['./auth-facebook.component.css']
})
export class AuthFacebookComponent {
  user!: SocialUser;

  constructor(private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      console.log('Facebook access token:', userData);
    });
  }

  signOut(): void {
    this.authService.signOut();
  }
}
