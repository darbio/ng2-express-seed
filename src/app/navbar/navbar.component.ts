import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  is_logged_in: boolean = false;
  username: string;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getClaims().subscribe((claims) => {
      this.username = claims.email;
    });
  }

}
