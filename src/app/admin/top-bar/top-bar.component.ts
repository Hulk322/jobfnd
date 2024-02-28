import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  public showSettingMenuFlag = false; 
  notifications = [];

  constructor(
    private Token: TokenService,
    private router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_admin');
    this.router.navigateByUrl('login');
  }

  showSetting() {
    this.showSettingMenuFlag = true; 
  }

  hideSetting() {
    this.showSettingMenuFlag = false; 
  }

}
