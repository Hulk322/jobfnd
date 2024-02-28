import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
@Input() title : any;

  constructor(private location:Location) { }

  ngOnInit() {
  }

  back(){
  	this.location.back();
  }
}
