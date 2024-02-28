import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(@Inject(DOCUMENT) document: any) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'assets/css/style.css'; 
    head.appendChild(link);
    let chatbot =  document.getElementById('svms-chat-widget');
    chatbot.style.display = "none";
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("menu-position-top");
    body.classList.add("full-screen");
    body.classList.add("with-content-panel");   
    body.classList.remove("auth-wrapper"); 
  }

}
