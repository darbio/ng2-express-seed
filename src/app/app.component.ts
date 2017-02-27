import { Component, ViewContainerRef } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { ConfigService, ClientConfig } from './config.service';
import { AuthService } from './auth.service';
import { AuthHttp } from './auth-http.service';

import { OAuthService } from 'angular-oauth2-oidc';

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
    private http: Http,
    private authHttp: AuthHttp,
    private auth: AuthService,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef
  ) {
    // Set up toastr
    this.toastr.setRootViewContainerRef(vRef);
  }

  logout() {
    this.auth.logout();
  }

  get() {
    this.authHttp.get('/api/v1/status').subscribe((response: Response) => {
      this.status = response.json();
    });
  }
}
