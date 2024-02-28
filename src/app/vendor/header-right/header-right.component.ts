import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-header-right',
  templateUrl: './header-right.component.html',
  styleUrls: ['./header-right.component.css']
})
export class HeaderRightComponent implements OnInit {

  full_name = "";
  profile_picture = "";

  constructor(
    private Token: TokenService,
    private router: Router,
    private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.full_name = message);
    this.data.currentPicturePath.subscribe(path => this.profile_picture = path);
    this.full_name = localStorage.getItem("full_name");
    this.profile_picture = localStorage.getItem("profile_picture");
  }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_client');
    this.router.navigateByUrl('login');
  }

}
