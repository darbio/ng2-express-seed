import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';
import { AuthGuardService, NotAuthGuardService } from './auth-guard.service';
import { AppErrorHandler } from './app-error.handler';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppRoutes } from './app.routes';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,
    LoginCallbackComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    OAuthModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    ToastModule.forRoot()
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
    AuthGuardService,
    NotAuthGuardService,
    AppErrorHandler,
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    }
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
    noJwtError: true,
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
