import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {

	public job = {
	  id: null,
	  title: null,
	  job_type: null,
	  created_at: null,
	  deleted: false,
	  salary_type:null,
	  start_date:null,
	  min_rate:null,
	  max_rate:null,
	  tentative_end_date:null,
	  posted: null,
	  category: null,
	  currency: null,
	  description: '',
	  openings: 0,
	  experience: '',
	  address: '',
	  category_id: null,
	  additional_detail: '',
	  reason_for_hire: '',
	  submissionsCount:'',
	  client_organization: {
	    business_logo: null,
	    businessLogoFullUrl: null
	  },
	  skills: [],
	  other_skills: [],
	  descriptions: [],
	  submissions: [],
	  interviews: [],
	  offers: [],
	  is_published: 1,
	};

	defaultSkillsCount = 10;
  showMoreText = "more";
	id: number;
	private sub: any;
  isLoading = false;

  jobUrl = environment.baseApiUrlClient+"/admin/jobs/";
  private headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem('token'));
  private httpOptions = {
    headers: this.headers_object
  };

  constructor(private http: HttpClient,
  	          private router: Router,
  	          private route: ActivatedRoute,
  				    private _ErrorService: ErrorService) { }

  ngOnInit() {
    this.isLoading = true;
  	 this.sub = this.route.params.subscribe(params => {
  	   this.id = +params['id']; // (+) converts string 'id' to a number
  	   this.http.get(this.jobUrl  + this.id, this.httpOptions)
  	   .subscribe( 
  	     data => this.handleSuccess(data),
  	    err => this.handleError(err)
  	 );
  	});
  }

    handleSuccess(data){
    this.job = data.data.job;
    this.isLoading = false;
  }

  handleError(error){
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.job.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }

}
