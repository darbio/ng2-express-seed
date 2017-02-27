import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthHttp {

  constructor(
    public http: Http,
    private oauthService: OAuthService
  ) {  }

  get(url: string, options?: RequestOptions): Observable<Response> {
    options = this.ensureHeaders(options);
    return this.http.get(url, options);
  }

  post(url: string, body: any, options?: RequestOptions): Observable<Response> {
    options = this.ensureHeaders(options);
    return this.http.post(url, options);
  }

  private ensureHeaders(options: RequestOptions): RequestOptions {
    if (!options) {
      options = new RequestOptions();
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + this.oauthService.getAccessToken());

    return options;
  }

}
