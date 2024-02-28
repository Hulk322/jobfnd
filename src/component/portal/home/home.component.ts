import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class PortalHomeComponent implements OnInit {

  

  constructor(private router:Router,
              @Inject(DOCUMENT) document: any) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'assets/css/style.css'; // you may want to get this from local storage or location
    head.appendChild(link);
     let chatbot =  document.getElementById('svms-chat-widget');
     chatbot.style.display = "block";
  }

  ngOnInit() {
  }

}
