import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from '../auth-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authHttp: AuthHttp
  ) { }

  ngOnInit() {
  }

  sendEmail() {
    this.authHttp.get("/api/v1/status/test").subscribe((response: Response) => {
      var t = response;
    });
  }

}
