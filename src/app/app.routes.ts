import { AuthGuardService, NotAuthGuardService } from './auth-guard.service';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const AppRoutes = [
  {
    path: '',
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
        component: LoginComponent,
        canActivate: [
          NotAuthGuardService
        ]
      },
      {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [
          AuthGuardService
        ]
      }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
