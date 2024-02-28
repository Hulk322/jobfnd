import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { PublicJobService } from 'src/Services/public_portal/public-job.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import  *  as  data  from  'src/customize.json';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Home1Component implements OnInit {

  filters : any = {
    what : '',
    where : ''
    //experience : 'Experienced'
  };
  clientName:any
  categories : any[] = [];
  usedCategories: any[] = [];
  popularCategories: any[] = [];
  clientLogos:any[] = [];
  href:any = "";
  placeholder="Choose Location";
  products:  any  = (data  as  any).default;

  stats : any = {
    campanies : 0,
    candidates_hired : 0,
    job_seekers : 0,
    jobs_posted: 0
  };

  recent_jobs: any[];
  isLoading = false;
  constructor(private publicJobService: PublicJobService,
    private router: Router,
    private _ErrorService: ErrorService,
    @Inject(DOCUMENT) document: any) {

    let x =  document.getElementById('svms-chat-widget');
    x.style.display = "block";
    }

  ngOnInit() {
    this.href = window.location.host;
    // this.href = "honeywell.simplifysource.com";

    this.getClientLogo();
    this.getFilters();
  }

  getClientLogo(){
   if(this.href === "capitalone.simplifyhire.com"){
    this.clientName = 'capitalone';
     this.clientLogos.push({'name':this.products[0].logo,'color':this.products[0].color})
   }else if(this.href === "delta.simplifyhire.com"){
    this.clientName='delta';
    this.clientLogos.push({'name':this.products[1].logo,'color':this.products[1].color,'banner':this.products[1].banner})
  }else if(this.href === "dev.simplifycareers.com" || this.href ==="uat.simplifycareers.com" || this.href === "simplifycareers.com"){
    this.clientName='career';
    this.clientLogos.push({'name':this.products[3].logo,'color':this.products[3].color,'banner':this.products[1].banner})
  }else if(this.href === "honeywell.simplifysource.com"){
    this.clientName='honeywell';
     let head  = document.getElementsByTagName('head')[0];
    let otherlink  = document.createElement('link');
    otherlink.rel  = 'stylesheet';
    otherlink.type = 'text/css';
    otherlink.href = 'assets/css/honeywell.css'; // you may want to get this from local storage or location test
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
  	this.publicJobService.getHomeFilters().then((response : any)=>{
      let data = response.data;
      this.stats = data.stats;
      this.usedCategories = data.popularCategories.slice(0,8);
      this.recent_jobs = data.recent_jobs;
      if(data.popularCategories)
        this.popularCategories = data.popularCategories.slice(0,8);
  		//sessionStorage.setItem('filters',JSON.stringify(data));
      this.categories = data.popularCategories.slice(0,7);
      //this._ErrorService.flashMessage({'type': 'success', 'messages': response.msg } );
  	},error=>{
  		console.log(error);
  	});
  }

  searchJob(categoryName){
  	this.router.navigate(['/jobs'],{queryParams: {categories: categoryName } });
  }

  search(){
    this.router.navigate(['/jobs'],{queryParams:this.filters });
  }

  getAddress(place: object) {
		this.filters.where = place['formatted_address'];
  }

  onValueChange(newValue) {
    this.filters.where = newValue;
}
  goToJob(jobSlug){
    this.router.navigate(['/jobs/'+jobSlug]);
  }
}
