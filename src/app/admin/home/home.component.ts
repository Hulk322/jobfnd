import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(@Inject(DOCUMENT) document: any) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'assets/admin/style.css'; 
    head.appendChild(link);
    let chatbot =  document.getElementById('svms-chat-widget');
    chatbot.style.display = "none";
  }

  ngOnInit() {
    $('.btn-dark-theme').click(function(){
    
      //$(this).toggleClass('active');
      $('body').toggleClass('dark');
      
  });
  }

}
