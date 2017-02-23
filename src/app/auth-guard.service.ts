import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate() {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.auth.login();
      return false;
    }
  }
}

@Injectable()
export class NotAuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate() {
    if (this.auth.loggedIn()) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
