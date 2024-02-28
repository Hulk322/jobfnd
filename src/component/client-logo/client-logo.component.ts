import { Component, OnInit } from '@angular/core';
import  *  as  data  from  'src/customize.json';

@Component({
  selector: 'client-logo',
  templateUrl: './client-logo.component.html',
  styleUrls: ['./client-logo.component.css']
})
export class ClientLogoComponent implements OnInit {

	clientLogos:any[] = [];
	href:any = "";
	clientName:any;
	products:  any  = (data  as  any).default;

  constructor() { }

  ngOnInit() {
  	this.href = window.location.host;
    //  this.href = "honeywell.simplifysource.com";
  	this.getClientLogo();

  }

  getClientLogo(){
   if(this.href === "capitalone.simplifyhire.com"){
    this.clientName = 'capitalone';
     this.clientLogos.push({'name':this.products[0].logo,'color':this.products[0].color})
   }else if(this.href === "delta.simplifyhire.com"){
    this.clientName='delta';
    this.clientLogos.push({'name':this.products[1].logo,'color':this.products[1].color,'banner':this.products[1].banner})
  }else if(this.href === "dev.simplifycareers.com"  || this.href ==="uat.simplifycareers.com" || this.href === "simplifycareers.com"){
    this.clientName='career';
    this.clientLogos.push({'name':this.products[3].logo,'color':this.products[3].color,'banner':this.products[1].banner})
  }else if(this.href === "honeywell.simplifysource.com"){
    this.clientName='honeywell';
    this.clientLogos.push({'name':this.products[3].logo,'color':this.products[3].color,'banner':this.products[1].banner})
  }else if(this.href === "talentzhire.com"  || this.href === 'talentzhire.com'){
    this.clientName='thermofisher';
    this.clientLogos.push({'name':this.products[4].logo,'color':this.products[4].color,'banner':this.products[1].banner})
  }else if(this.href === "ms.simplifycareers.com"){
    this.clientName='microsoft';
    this.clientLogos.push({'name':this.products[4].logo,'color':this.products[4].color,'banner':this.products[1].banner})
  }else{
    this.clientName='';
     this.clientLogos.push({'name':this.products[2].logo,'color':this.products[2].color,'banner':this.products[1].banner})
   }
  }

}
