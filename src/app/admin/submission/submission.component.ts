import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import { SubmissionsService } from 'src/Services/admin/submissions.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

    interview = {
      title: '',
      type: '',
      recommended_dates : [],
      recommended_datetime_in: null,
      
      other_datetime_in: null,
      
      notes: '',
      reason: '',
      location: '',
      current_status: 'New'
    };
    sidebar_open = false; 
    types = [];
    interview_recommended_date = {
      date: null,
      time_in: null,
      time_out: null
    }

  isLoading = false;
  current_interview_type;
  submission_id;
  sub;
  submission = {
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
    answers: [],
    documents: [],
    interviews: [],
    job: {
      id: null,
      title:null,
      job_type: null,
      description: null,
      posted: null,
      address: null,
      category: {
        name: null
      }
    },
    talent: {
      first_name: null,
      last_name: null,
      resume : {
        title: null,
        documents:[]
      },
      talentMeta: {
        mobile:null,
        location:null
      },
      meta : {
        profilePictureFullUrl: null
      }
    }
  };

  talentMeta ={
    mobile: null,
    location: null
  };

  fullUrl = "";
  closeResult: string;
  opened_class = '';
  defaultSkillsCount = 10;
  showMoreText = "more";
  current_tab = "pdf";

  constructor(
  			private route: ActivatedRoute,
    		private _submissionsService: SubmissionsService,
    		private _ErrorService: ErrorService
    ) { }

  ngOnInit() {
  	this.getSubmission();
  }

  getSubmission() {
  	this.isLoading = true;
  	    this.sub = this.route.params.subscribe(params => {
  	    this.submission_id = +params['id']; // (+) converts string 'id' to a number
  	   
  	    return this._submissionsService.show(this.submission_id).subscribe(
  	      data => this.handleSuccess(data),
  	      error => this.handleError(error)
  	    );  
  	  });

  }

  interviews = [];
  
  handleSuccess(data){
    this.submission = data.data.submission;
    this.interviews = data.data.interviews;
    if(this.submission.resumeFullUrl !='' && this.submission.resumeFullUrl != null){
      let url = this.submission.resumeFullUrl;
      this.createPdfUrl(url);
    }
  }

  createPdfUrl(url){
      this.fullUrl = url;
  }
    handleError(error) {
    this._ErrorService.flashMessage({ 'type': 'error', 'messages': error.error });
    this.isLoading = false;
  }

  toggleSkillsCount(){
    if(this.defaultSkillsCount==10) {
      this.defaultSkillsCount = this.submission.skills.length;
      this.showMoreText = "less";
    }else{
      this.showMoreText = "more";
      this.defaultSkillsCount = 10;
    }
  }
}
