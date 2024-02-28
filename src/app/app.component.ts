import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title, Meta  } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  metaTilte ="Job Vacancy | Latest Job Openings | Job Search Online | Talentzhire";
  ngOnInit() {
    this.titleService.setTitle(this.metaTilte);
    this.metaService.addTags([
      {name: 'google-site-verification', content: '2twZp3PsonsJQjbhWHaxcMLZKy7YJIYc3j4TbTDt8Ws'},
      {name: 'msvalidate.01', content: 'B49D3F96641096D391E5110E00940BE4'},
      {name: 'robots', content: 'index, follow'}
    ]);
  }

  title = 'Talentzhire api consumer';

  constructor(private router:Router,private titleService:Title,private metaService: Meta){
  	 this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.changeTitle(event.url);
      }
    });
    this.appendGaTrackingCode();
  }

   private appendGaTrackingCode() {
     if(environment.MODE === "dev" || environment.MODE === "career"){
       var analytic_mode = '_debug';

     }else {
       var analytic_mode = '';
     }
     try {
       const script = document.createElement('script');
       script.innerHTML = `
         (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
         (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
         m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
         })(window,document,'script','https://www.google-analytics.com/analytics`+analytic_mode+`.js','ga');

         ga('create', '` + environment.GTM_ID + `', 'auto');
       `;
       document.head.appendChild(script);
     } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
     }
  }

    changeTitle(url){
    if(url.indexOf("templates/create")!=-1) {
       this.titleService.setTitle("Create Template");
    }else if(url.indexOf("templates/edit")!=-1) {
       this.titleService.setTitle("Edit Template");
    }else if(url.indexOf("create-interview")!=-1) {
       this.titleService.setTitle("Create Interview");
    }else if(url.indexOf("create-offer")!=-1) {
       this.titleService.setTitle("Create Offer");
    }else if(url.indexOf("jobs/create")!=-1) {
       this.titleService.setTitle("Create Job");
    }else if(url.indexOf("jobs/edit")!=-1){
       this.titleService.setTitle("Edit Job");
    }else {
       let arr = url.split("/");
       if(arr[1]=='jobs' || arr[1].indexOf('jobs?')!=-1) {
         return ;
       }
       let title = "";
       if(arr.length>2) {
       	title = arr[2];
         title =  (parseInt(title)==NaN) ?  title : arr[1]+"/"+arr[2];
       }else{
       	title = arr[1];
       }
       if(title!="") {
         title = title.replace(title[0],title[0].toUpperCase());
         this.titleService.setTitle(title);
       }
    }
  }
}
