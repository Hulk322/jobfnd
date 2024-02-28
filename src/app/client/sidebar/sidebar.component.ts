import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() current_menu_item: string = "dashboard";

  submenu_active = false;

  constructor() { }

  ngOnInit() {

    window.addEventListener('scroll', this.scroll, true); //third parameter

    $('.add-new-btn').click(function () {

      $('.quickaction-tabs').toggleClass('active');

    });

    $('.btn-notification').click(function () {

      $('#togglesidebar').addClass('open');

    });

    $('.close_notifications_bar_button').click(function () {

      $('#togglesidebar').removeClass('open');

    });

    $(".open-filter").click(function() {
        $(".view-switcher .drop-wrap").addClass("open");
    });
  
  $(".close-filter-panel").click(function() {
      $(".view-switcher .drop-wrap").removeClass("open");
  });
  

    $('.btn-dark-theme').click(function () {

      //$(this).toggleClass('active');
      $('body').toggleClass('dark');

    });

    $(".navigation .has-submenu").click(function() {
      $(this).parents("li").find(".submenu").addClass("active");
  });

  $(".navigation .submenu-close").click(function() {
    $(this).parents(".submenu").removeClass("active");
});

  }

  scroll = (event): void => {
     
    // var height = $('.content-area').height();
    // console.log(height); 

    // $('.sidebar__inner').height(height+'px');
      //handle your scroll here
      //notice the 'odd' function assignment to a class field
      //this is used to be able to remove the event listener
    };

}
