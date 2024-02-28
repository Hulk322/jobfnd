import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router) { 
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'assets/admin/style.css'; 
    head.appendChild(link);
   }

  ngOnInit() {

    if(localStorage.getItem('token')==null)
      this.router.navigateByUrl('login');
      //this.router.navigateByUrl('vendor/dashboard');
    //else
      //this.router.navigateByUrl('login');

      $('.btn-dark-theme').click(function(){
    
        //$(this).toggleClass('active');
        $('body').toggleClass('dark');
        
    });

  }

}
