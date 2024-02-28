import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[appLoginNavbar]',
  templateUrl: './login-navbar.component.html',
  styleUrls: ['./login-navbar.component.css']
})
export class LoginNavbarComponent implements OnInit {

  logged_in = false;

  constructor() { }

  ngOnInit() {
    if(localStorage.getItem("token")!=null)
      this.logged_in = true;
  }

}
