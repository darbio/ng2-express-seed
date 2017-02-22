import { AuthGuardService } from './auth-guard.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
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
        component: null,
        canActivate: [
          AuthGuardService
        ]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'logout',
        component: null,
        canActivate: [
          AuthGuardService
        ]
      }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
