import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { TokenService } from 'src/Services/token.service';
import  *  as  data  from  'src/customize.json';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categories : any[] = [];
  candidate_logged = false;
  full_name = "";
  profile_picture = "";
  @Input() current_menu_item: string = "";
  clientLogos:any[] = [];
  href:any = "";
  clientName:any;
  products:  any  = (data  as  any).default;
  filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };

  constructor(private router:Router,private jobService:PublicJobService, private Token: TokenService) { }

  ngOnInit() {
    this.href = window.location.host;
    // this.href = "honeywell.simplifysource.com";
    this.getClientLogo();
	this.full_name = localStorage.getItem("full_name");
    this.profile_picture = localStorage.getItem("profile_picture");

	  if(localStorage.getItem("token") && localStorage.getItem("is_candidate"))
		  this.candidate_logged = true;
		else
		  this.candidate_logged = false;

  	let filters = sessionStorage.getItem('filters');
  	if(!filters) {
  		this.getFilters();
  	}else{
  		let data = JSON.parse(filters);
  		this.categories = data.popularCategories.slice(0,7);
  	}
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
    let head  = document.getElementsByTagName('head')[0];
    let otherlink  = document.createElement('link');
   otherlink.rel  = 'stylesheet';
   otherlink.type = 'text/css';
   otherlink.href = 'assets/css/honeywell.css'; // you may want to get this from local storage or location
   head.appendChild(otherlink);
    this.clientLogos.push({'name':this.products[3].logo,'color':this.products[3].color,'banner':this.products[1].banner})
  }else if(this.href === "talentzhire.com" || this.href === 'talentzhire.com'){
    this.clientName='thermofisher';
    this.clientLogos.push({'name':this.products[4].logo,'color':this.products[4].color,'banner':this.products[1].banner})
  }else if(this.href === "ms.simplifycareers.com"){
    this.clientName='microsoft';
    this.clientLogos.push({'name':this.products[4].logo,'color':this.products[4].color,'banner':this.products[1].banner})
  }else{
    this.clientName='';
     this.clientLogos.push({'name':this.products[2].logo,'color':this.products[2].color,'banner':this.products[1].banner})
   }
   // alert(this.clientName);
  }

  getFilters(){
  	this.jobService.getFilters().then((response : any)=>{
  		let data = response.data;
  		sessionStorage.setItem('filters',JSON.stringify(data));
  		this.categories = data.popularCategories.slice(0,7);
  	},error=>{
  		console.log(error);
  	});
  }

  searchJob(categoryName){
  	this.router.navigate(['/jobs'],{queryParams: {categories: categoryName } });
  }

  search(){
    this.router.navigate(['/candidate/dashboard'],{queryParams:this.filters });
  }

  logout(){
    this.Token.remove();
    localStorage.removeItem('is_candidate');
    this.router.navigateByUrl('login');
  }

}
