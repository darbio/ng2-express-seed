import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Response } from '@angular/http';
import { AuthService } from './auth.service';
import { AuthHttp } from './auth-http.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  status: any = {};

  is_logged_in: boolean = false;

  constructor(
    private authHttp: AuthHttp,
    private auth: AuthService,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef
  ) {
    // Set up toastr
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.auth.loggedIn().subscribe((is_logged_in) => {
      this.is_logged_in = is_logged_in;
    });
  }

  // get() {
  //   this.authHttp.get('/api/v1/status').subscribe((response: Response) => {
  //     this.status = response.json();
  //   });
  // }
}
