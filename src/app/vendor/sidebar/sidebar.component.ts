import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() current_menu_item: string = "dashboard";

  constructor() { }

  ngOnInit() {
    $('.add-new-btn').click(function () {

      $('.quickaction-tabs').toggleClass('active');

    });

    $('.btn-notification').click(function () {

      $('#togglesidebar').toggleClass('open');

    });

    $('.close_notifications_bar_button').click(function () {

      $('#togglesidebar').toggleClass('open');

    });

    $('.btn-dark-theme').click(function () {

      //$(this).toggleClass('active');
      $('body').toggleClass('dark');

    });
  }

}
