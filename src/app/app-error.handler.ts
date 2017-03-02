import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from './auth.service';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  toastr: ToastsManager;
  auth: AuthService;
  router: Router;

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
        // Log the user out of the entire context
        // Do this without a redirect
        // This is needed to ensure that there are no tokens left in our browser
        this.auth.logout(true);

        // Send the user back to the home page
        // This will ensure that they are logged in
        this.router.navigate(['/unauthorized']);

        // End here so that we don't do anything else
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
