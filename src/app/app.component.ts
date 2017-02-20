import { Component } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(
    private oauthService: OAuthService,
    private http: Http
  ) {
    // URL of the SPA to redirect the user to after login
    this.oauthService.redirectUri = window.location.origin;

    // The SPA's id. The SPA is registerd with this id at the auth-server
    this.oauthService.clientId = "kgkNF8ILGmkR8Cj8f1Iz";

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
    this.oauthService.issuer = "https://dev-460081.oktapreview.com";

    // Load Discovery Document and then try to login the user
    this.oauthService.loadDiscoveryDocument().then(() => {
        // This method just tries to parse the token(s) within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't send the user the the login page
        this.oauthService.tryLogin({
          validationHandler: context => {
            return http.get(this.oauthService.issuer + '/.well-known/openid-configuration').subscribe((response: Response) => {
              let doc = response.json();

              // Verify that the iss (issuer) claim in the ID Token exactly matches the issuer identifier for your Okta org (which is typically obtained during Discovery.

              // Verify that the aud (audience) claim contains the client_id of your app.

              // Verify the signature of the ID Token according to JWS using the algorithm specified in the JWT alg header property. Use the public keys provided by Okta via the Discovery Document.

              // Verify that the expiry time (from the exp claim) has not already passed.

              // A nonce claim must be present and its value checked to verify that it is the same value as the one that was sent in the Authentication Request. The client should check the nonce value for replay attacks.

              // The client should check the auth_time claim value and request re-authentication using the prompt=login parameter if it determines too much time has elapsed since the last end-user authentication.
              
            });
          }
        });
    });
  }

  login() {
    this.oauthService.initImplicitFlow();
  }
}
