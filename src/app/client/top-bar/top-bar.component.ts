import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/Services/token.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NotificationService } from 'src/Services/client/notification.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  public showSettingMenuFlag = false;
  full_name = "";
  notifications = [];

  constructor(
    private Token: TokenService,
    private router: Router,
    private _NotificationService: NotificationService) { }

  ngOnInit() {
    this.full_name = localStorage.getItem("full_name");

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

  logout() {
    this.Token.remove();
    localStorage.removeItem('is_client');
    this.router.navigateByUrl('login');
  }

  showSetting() {
    this.showSettingMenuFlag = true;
  }

  hideSetting() {
    this.showSettingMenuFlag = false;
  }


  markRead(notification) {
    //if (notification.notification_type == 'jobs' && notification.type == 'view')
    //  this.router.navigateByUrl("/candidate/applied-jobs/" + notification.notification_id + "?job_id=" + notification.notification_id);

    for (let i = 0; i < this.notifications.length; ++i) {
      if (this.notifications[i].id === notification.id) {

        this.notifications.splice(i, 1);

        this._NotificationService.markRead(notification.id)
          .subscribe(
            data => this.handleMarkReadSuccess(data, i),
            err => this.handleError(err)
            //() => console.log('ok')
          );

      }
    }
  }

  handleMarkReadSuccess(data, index) {


    //this.notifications_count = Number(localStorage.getItem('notifications_count'))-1;
    //localStorage.setItem('notifications_count', (Number(localStorage.getItem('notifications_count'))-1).toString());

  }


  menutoggle(event) {

    var el = $(event.target);
    if (event.target.tagName == 'A') {
      var el = el.parent('li');
    }

    if (el.children('ul').hasClass('show-menu')) {
      el.find('a span').addClass('fa-angle-right');
      el.find('a span').removeClass('fa-angle-down');
      el.children('ul').removeClass('show-menu');
      el.children('ul').slideUp(350);

    } else {
      el.find('a span').removeClass('fa-angle-right');
      el.find('a span').addClass('fa-angle-down');
      el.children('ul').addClass('show-menu');
      el.children('ul').slideDown(350);
    };

  }

}
