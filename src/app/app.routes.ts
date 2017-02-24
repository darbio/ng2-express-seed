import { AuthGuardService, NotAuthGuardService } from './auth-guard.service';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

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
  { path: 'unauthorized', component: UnauthorizedComponent }
];
