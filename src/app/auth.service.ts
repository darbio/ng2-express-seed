import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthService {

  constructor(
    private oauthService: OAuthService
  ) { }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  loggedIn() {
    let token = this.oauthService.getIdToken();

    let is_expired = !tokenNotExpired(null, token);
    return !is_expired;
  }

}
