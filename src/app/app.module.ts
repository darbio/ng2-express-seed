import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppRoutes } from './app.routes';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
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
    },
    AuthService,
    AuthGuardService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

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
