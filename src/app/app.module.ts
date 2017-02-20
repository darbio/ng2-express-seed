import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(
  http: Http,
  options: RequestOptions,
  oauthService: OAuthService
) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
        tokenGetter: (() => oauthService.getIdToken()),
        globalHeaders: [
          { 'Content-Type' : 'application/json' }
        ],
    }), http, options);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot()
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [
        Http,
        RequestOptions,
        OAuthService
      ]
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
