import { AuthGuardService, NotAuthGuardService } from './auth-guard.service';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const AppRoutes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [
      AuthGuardService
    ]
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
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
