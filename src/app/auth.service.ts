import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { OAuthService } from 'angular-oauth2-oidc';
import { Location } from '@angular/common';
import { ConfigService, ClientConfig } from './config.service';

@Injectable()
export class AuthService {

  constructor(
    private location: Location,
    private oauthService: OAuthService,
    private configService: ConfigService,
  ) {
    // URL of the SPA to redirect the user to after login
    this.oauthService.redirectUri = window.location.origin + "/account/login/callback";

    // The SPA's id. The SPA is registerd with this id at the auth-server
    this.oauthService.clientId = this.configService.config.client_id;

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC.
    this.oauthService.scope = "openid profile email";

    // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
    // OAuth2-based access_token
    this.oauthService.oidc = true;

    // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // instead of localStorage
    this.oauthService.setStorage(sessionStorage);

    // The name of the auth-server that has to be mentioned within the token
    this.oauthService.issuer = this.configService.config.oidc_server_url;

    // Load Discovery Document
    this.oauthService.loadDiscoveryDocument();
  }

  login() {
    // Init implicit with extra state for redirect
    let additionalState = new Buffer(this.location.path(false)).toString('base64');
    this.oauthService.initImplicitFlow(additionalState);
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
