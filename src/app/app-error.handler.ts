import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './auth.service';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  toastr: ToastsManager;
  auth: AuthService;

  constructor(
    // Don't inject things here as they cause a circular dependency in ng2
    // Instead inject an Injector and resolve them later
    private injector: Injector
  ) {
    super(false);
  }

  handleError(error: any) {
    // Load any dependencies
    this.ensureDependencies();

    // HTTP Errors
    if (error.status){
      if (error.status == 401) {
        // If this is a 401 then login
        if (this.auth.loggedIn) {
          this.auth.logout();
        }
        this.auth.login();
        return;
      }
    }

    // Add the error to toast
    this.toastr.error(error, 'An error occurred');

    // Call the base
    super.handleError(error);
  }

  ensureDependencies() {
    if (!this.toastr) {
      this.toastr = this.injector.get(ToastsManager);
    }

    if (!this.auth) {
      this.auth = this.injector.get(AuthService);
    }
  }

}
