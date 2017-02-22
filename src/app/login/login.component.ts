import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private oauthService: OAuthService
  ) { }

  ngOnInit() {
    if (!this.auth.loggedIn()) {
      this.oauthService.initImplicitFlow();
    }
    else {
      this.router.navigate(['/']);
    }
  }

}
