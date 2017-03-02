import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { OAuthService } from 'angular-oauth2-oidc';
import { Location } from '@angular/common';
import { ConfigService, ClientConfig } from './config.service';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AuthService {

  constructor(
    private location: Location,
    private router: Router,
    private oauthService: OAuthService,
    private configService: ConfigService,
    private cookie: Cookie
  ) {
    // URL of the SPA to redirect the user to after login
    this.oauthService.redirectUri = window.location.origin;

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
    this.oauthService.loadDiscoveryDocument().then(() => {
        // This method just tries to parse the token(s) within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't send the user the the login page
        this.oauthService.tryLogin({
          onTokenReceived : context => {
            if (context.state) {
              var unencodedState = new Buffer(context.state, 'base64').toString('ascii');
              this.router.navigateByUrl(unencodedState);
            }
            else {
              this.router.navigate(['/']);
            }
          }
        });
    });
  }

  login(): void {
    // Init implicit with extra state for redirect
    let additionalState = new Buffer(this.location.path(false)).toString('base64');
    this.oauthService.initImplicitFlow(additionalState);
  }

  logout(no_redirect: boolean = false): void {
    this.oauthService.logOut(no_redirect);
    Cookie.deleteAll();
  }

  getClaims(): Observable<any> {
    let that = this;
    return Observable.create(function (observer) {
      let claims = that.oauthService.getIdentityClaims();
      observer.next(claims);
    });
  }

  loggedIn(): Observable<boolean> {
    let that = this;
    return Observable.create(function (observer) {
      let timer = setInterval(() => {
        if (that.oauthService.discoveryDocumentLoaded) {
          // Work out if we are logged in
          let token = that.oauthService.getIdToken();
          let is_expired = !tokenNotExpired(null, token);

          // Return our value
          observer.next(!is_expired);
          observer.complete();

          // Stop our callback
          clearInterval(timer);
        }
      }, 600);
    });
  }

}
