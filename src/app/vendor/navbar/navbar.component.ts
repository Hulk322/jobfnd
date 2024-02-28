import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private Token: TokenService,
    private router: Router ) { }

  ngOnInit() {
    /*let body = document.getElementsByTagName('body')[0];
    body.classList.add("menu-position-top");
    body.classList.add("full-screen");
    body.classList.add("with-content-panel");   
    body.classList.remove("auth-wrapper");   */
  }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_vendor');
    this.router.navigateByUrl('login');
  }

}
