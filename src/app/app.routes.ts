import { AuthGuardService, NotAuthGuardService } from './auth-guard.service';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

export const AppRoutes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: HomeComponent
  },
  {
    path: 'secure',
    component: HomeComponent,
    canActivate: [
      AuthGuardService
    ]
  },
  {
    path: 'account',
    children: [
      {
        path: '',
        component: AccountComponent,
        canActivate: [
          AuthGuardService
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: 'callback',
            component: LoginCallbackComponent
          }
        ],
        canActivate: [
          NotAuthGuardService
        ]
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
