import { Component, ViewContainerRef } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ConfigService, ClientConfig } from './config.service';

import { OAuthService } from 'angular-oauth2-oidc';
import * as JwtDecode from 'jwt-decode';
import { AuthHttp } from 'angular2-jwt';
import { ToastsManager } from 'ng2-toastr/ng2-toastr'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  status: any = {};

  constructor(
    private oauthService: OAuthService,
    private configService: ConfigService,
    private http: Http,
    private authHttp: AuthHttp,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef
  ) {
    // Set up toastr
    this.toastr.setRootViewContainerRef(vRef);

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
    this.oauthService.issuer = this.configService.config.okta_server_url;

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {
        // This method just tries to parse the token(s) within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't send the user the the login page
        this.oauthService.tryLogin({ });
    });
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  get() {
    this.authHttp.get('/api/v1/status').subscribe((response: Response) => {
      this.status = response.json();
    })
  }
}
