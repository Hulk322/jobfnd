import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { InterviewsService } from 'src/Services/admin/interviews.service';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {

  isLoading = false;
  defaultSkillsCount = 10;
  interview_id;
  sub;
  interview = {
    title: '',
    type: '',
    dates: [],
    date: { date:'', time_in: '', time_out: '' },
    notes: '',
    reason: '',
    location: '',
    current_status: 'New',
    candidate: {
      meta: {
        profilePictureFullUrl: null
      }
    },
    submission: {
      id: null,
  status:null,
  bill_rate_min: null,
  bill_rate_max:null,
  pay_rate: null,
  created_at:null,
  estimated_joning_date:null,
  is_client_fav: false,
  first_name: '',
  last_name: '',
  candidate: {
    first_name: '',
    last_name: ''
  },
  gender: '',
  dob: '',
  location: '',
  address: '',
  full_address: '',
  willing_to_relocated: '',
  home_phone: '',
  mobile: '',
  city: '',
  country: '',
  state: '',
  zip: null,
  salary_amount: null,
  salary_type: null,
  skills: [],
  additional_information: null,
  quick_summary: null,
  facebook: null,
  liknedin: '',
  twitter: '',
  authorized_in_us: null,
  resume: null,
  is_local_file: false,
  resumeFullUrl: '',
  type: null,
    },
    job : {
      title: ''
    },
    actions : []
  };
  showMoreText = "more";


  constructor(
  			private route: ActivatedRoute,
    		private _interviewService: InterviewsService,
    		private _ErrorService: ErrorService
    ) { }

  ngOnInit() {
  	this.getInterview();
  }

  getInterview() {
  	this.isLoading = true;
  	    this.sub = this.route.params.subscribe(params => {
  	    this.interview_id = +params['id']; // (+) converts string 'id' to a number
  	   
  	    return this._interviewService.show(this.interview_id).subscribe(
  	      data => this.handleSuccess(data),
  	      error => this.handleError(error)
  	    );  
  	  });

  }

  handleSuccess(data) {
  	this.interview = data.data.interview;
  }

  handleError(error) {
  this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
  this.isLoading = false;
}
toggleSkillsCount(){
  if(this.defaultSkillsCount==10) {
    this.defaultSkillsCount = this.interview.submission.skills.length;
    this.showMoreText = "less";
  }else{
    this.showMoreText = "more";
    this.defaultSkillsCount = 10;
  }
}



}
