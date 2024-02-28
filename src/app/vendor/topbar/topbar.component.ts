import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NotificationService } from 'src/Services/vendor/notification.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  notifications = [];

  constructor(private http: HttpClient,
    private Token: TokenService,
    private router: Router,
    private _NotificationService: NotificationService) { }

  ngOnInit() {
    this._NotificationService.getUnread()
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
        //() => console.log('ok')
      );
  }

  handleSuccess(data) {
    this.notifications = data.data.notifications.data;

  }

  handleError(err) {
    console.log(err);
  }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_vendor');
    this.router.navigateByUrl('login');
  }


    menutoggle(event) {
      
      var el = $(event.target);
      if (event.target.tagName == 'A' ) {
       var el = el.parent('li');
      }
      
        if (el.children('ul').hasClass('show-menu')) {
            el.find('a span').addClass('fa-angle-right');
            el.find('a span').removeClass('fa-angle-down');
            el.children('ul').removeClass('show-menu');
            el.children('ul').slideUp(350);
            
        }else { 
          el.find('a span').removeClass('fa-angle-right');
          el.find('a span').addClass('fa-angle-down');
          el.children('ul').addClass('show-menu');
          el.children('ul').slideDown(350);
        };
      
  }


}
