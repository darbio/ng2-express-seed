import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { ConfigService } from './config.service';

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

export function configServiceFactory(config: ConfigService) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot(),
    NgbModule.forRoot()
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
    },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [
        ConfigService
      ],
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
