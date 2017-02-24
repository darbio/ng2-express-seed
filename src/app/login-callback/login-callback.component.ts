import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: OAuthService
  ) { }

  ngOnInit() {
    // Load Discovery Document and then try to login the user
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

}
