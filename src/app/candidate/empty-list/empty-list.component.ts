import { Component, OnInit , Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.css']
})
export class EmptyListComponent implements OnInit {

	@Input() pageName: string = "";
	filters = {
    what : '',
    where : '',
    categories : 'AllCategories'
  };
  routeSub : any;
	props = {
		"title": "No Submissions Found !", 
		"desc": "Seems like you are not applying any jobs yet",
		"img": "graphics-1-noresult.svg",

	}

	acceptedJobs = {
		"title": "No accepted submissions !", 
		"desc": "Your submissions are still under client reviews",
		"img": "graphics-2-noresult.svg",
	}

	appliedJobs = {
		"title": "No Submissions Found !", 
		"desc": "Seems like you are not applying any jobs yet",
		"img": "graphics-1-noresult.svg",
	}

	interviews = {
		"title": "No Interviews Scheduled !", 
		"desc": "You don't have any interviews Scheduled Yet",
		"img": "graphics-3-noresult.svg",
	}

	savedJobs = {
		"title": "You are not saving any Jobs !", 
		"desc": "bookmark your favourite jobs for future",
		"img": "graphics-4-noresult.svg",
	}

	offers = {
		"title": "You dont have any offers yet!", 
		"desc": "Your submissions are still under client reviews",
		"img": "graphics-5-nosubmission.svg",
	}

	dashboardJobs = {
		"title": "No Job Recommendations found", 
		"desc": "We cant find any new recommended jobs at the moment..",
		"img": "graphics-1-norecommendations.svg",
	}

	contracts = {
		"title": "No Active Contracts !", 
		"desc": "You dont have any active contracts yet",
		"img": "graphics-1-noresult.svg",
	}

	  constructor(private router: Router,private route: ActivatedRoute ,  private http: HttpClient) { }

	  ngOnInit() {

	  	switch (this.pageName) {
	  		case "accepted-jobs":
	  			this.props = this.acceptedJobs; 
	  			break;
	  		case "applied-jobs":
	  			this.props = this.appliedJobs;
	  			break;
	  		case "saved-jobs":
	  			this.props = this.savedJobs;
	  			break;
	  		case "interviews":
	  			this.props = this.interviews;
	  			break;
	  		case "offers":
	  			this.props = this.offers;
	  			break;
	  		case "contracts":
	  			this.props = this.contracts;
				break;
			case "dashboardJobs":
				this.props = this.dashboardJobs;
				break;
	  		default:
	  			// code...
	  			break;
	  	}

	  this.routeSub = this.route
      .queryParams
      .subscribe(params => {
        if(Object.keys(params).length != 0 && params.constructor === Object) {
          // this.isFiltersCleared = true;
          this.filters.what = '';
          this.filters.where = '';
          this.filters.categories = '';
          
          for (let key in params) {
            this.filters[key] = params[key];
          }
         
        }
     });

	  }
	  
	search(){
    this.router.navigate(['/candidate/dashboard'],{queryParams:this.filters });
    console.log(this.router.url);
  }

}
